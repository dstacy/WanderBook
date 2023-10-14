import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createPost, updatePost, getCampgrounds } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  console.log("Form component rendered");
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const [selectedFacilityName, setSelectedFacilityName] = useState(''); // Add state for the selected facility name
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const [inputBlurred, setInputBlurred] = useState(false);

  const campgrounds = useSelector((state) => state.posts.campgrounds);

  const facilityNames = Array.isArray(campgrounds?.resultset?.result)
    ? campgrounds.resultset.result.map((campground) => campground.$.facilityName)
    : [];

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    setSelectedFacilityName(''); // Clear the selected facility name
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) {
      setPostData(post);
      setSelectedFacilityName(post.facilityName || ''); // Set the selected facility name if available
    }
  }, [post]);

  useEffect(() => {
    console.log("UseEffect");
    dispatch(getCampgrounds());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name, facilityName: selectedFacilityName }, history)); // Include the selected facility name
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name, facilityName: selectedFacilityName })); // Include the selected facility name
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to share your adventures with others!
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  const handleFacilityNameChange = (e) => {
    console.log('handleFacilityNameChange called'); 
    const selectedName = e.target.value;
    setSelectedFacilityName(selectedName);

    setInputBlurred(true);
  };

  console.log(facilityNames);

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
        value={postData.title}
        onChange={(e) => {
          setPostData({ ...postData, title: e.target.value });
        }}
        onBlur={() => {
          if (inputBlurred) {
            console.log('Dispatching getCampgrounds action');
            dispatch(getCampgrounds(postData.title));
          }
        }}
        onFocus={() => setInputBlurred(true)}
        />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        /* Facility Name dropdown with 'Select' option */
        <TextField select label="Facility Name" fullWidth value={selectedFacilityName} 
          onChange={handleFacilityNameChange}
          variant="outlined"
        >
          <MenuItem value="">Select</MenuItem>
          {facilityNames.map((name, index) => (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;