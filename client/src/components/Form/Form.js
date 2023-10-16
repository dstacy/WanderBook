import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import _debounce from 'lodash.debounce'; // Import the debounce function

import { createPost, updatePost, getCampgrounds } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const [selectedFacilityName, setSelectedFacilityName] = useState('');
  const [pname, setPname] = useState('');
  const [prevFirstWord, setPrevFirstWord] = useState('');
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const handleApiCall = (title) => {
    // Check the minimum character requirement and pass the first word as pname
    if (title.length > 3) {
      const firstWord = title.split(' ')[0];
      dispatch(getCampgrounds(firstWord));
    };
  };
  
  const debounceApiCall = _debounce(handleApiCall, 1000); // Debounce the API call to prevent going over rate limit

  const campgrounds = useSelector((state) => state.posts.campgrounds);

  const facilityNames = Array.isArray(campgrounds?.resultset?.result)
    ? campgrounds.resultset.result.map((campground) => campground.$.facilityName)
    : [];

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    setSelectedFacilityName('');
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) {
      setPostData(post);
      setSelectedFacilityName(post.facilityName || '');
    }
  }, [post]);

  useEffect(() => {
    dispatch(getCampgrounds());
  }, [dispatch]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setPostData({ ...postData, title });
    const words = title.split(' ');
    if (words.length > 0) {
      const firstWord = words[0];

      // Check if the first word has changed
      if (firstWord !== prevFirstWord) {
        setPrevFirstWord(firstWord); // Update the previous first word
        debounceApiCall(firstWord); // Pass the first word to the debounce function
      }
    }
  };

  const handleFacilityNameChange = (e) => {
    const selectedName = e.target.value;
    setSelectedFacilityName(selectedName);
    setPostData({ ...postData, title: selectedName }); // Update the title field
  };

  const filteredFacilityNames = facilityNames.filter((name) => name.toLowerCase().includes(postData.title.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(
        createPost({ ...postData, name: user?.result?.name }, history)
      );
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
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

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Campground Name"
          fullWidth
          value={postData.title}
          onChange={handleTitleChange}

        />
        <TextField
          select
          label="Select Facility Name"
          fullWidth
          value={selectedFacilityName}
          onChange={handleFacilityNameChange}
          variant="outlined"
        >
          <MenuItem value="">Select</MenuItem>
          {filteredFacilityNames.map((name, index) => (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
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
        <div className={classes.fileInput}>
          <FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        </div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
          Submit
        </Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;