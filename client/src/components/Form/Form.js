import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _debounce from 'lodash/debounce'; // Import the debounce function

import { createPost, updatePost, getCampgrounds } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', site: '', pros: '', cons: '', message: '', state: '', amps: '', pets: '', sewer: '', water: '', waterfront: '', tags: [], selectedFile: '' });
  
  const [prevFirstWord, setPrevFirstWord] = useState('');
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const [state, setState] = useState('');
  const [amps, setAmps] = useState('');
  const [pets, setPets] = useState('');
  const [sewer, setSewer] = useState('');
  const [water, setWater] = useState('');
  const [waterfront, setWaterfront] = useState('');
  const [isPrivate, setIsPrivate] = useState(post?.isPrivate || false);
 

  const handleApiCall = (title) => {
    // Check the minimum character requirement and pass the first word as pname
    if (title.length > 3) {
      const firstWord = title.substring(0,4);
      dispatch(getCampgrounds(firstWord));
    };
  };
  
  const debounceApiCall = _debounce(handleApiCall, 500); // Debounce the API call to prevent going over rate limit

  const campgrounds = useSelector((state) => state.posts.campgrounds);

  // create an array of facilityNames associated with title field
  const facilityNames = Array.isArray(campgrounds?.resultset?.result)
    ? campgrounds.resultset.result.map((campground) => campground.$.facilityName)
    : [];

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', site: '', pros: '', cons: '', message: '', contractID: '', facilityID: '', state: '', amps: '', pets: '', sewer: '', water: '', waterfront: '', tags: [], selectedFile: '', isPrivate: false });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) {
      setPostData(post);

    }
  }, [post]);

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

  const filteredFacilityNames = facilityNames.filter((name) => name.toLowerCase().includes(postData.title.toLowerCase()));
  
  // extract campgrund amenities from user-selected campground to populate in PostDetails component
  useEffect(() => {
    if (postData.title && Array.isArray(campgrounds?.resultset?.result)) { // Check if campgrounds.resultset.result is available
      const campgroundsArray = campgrounds.resultset.result;
    
      const selectedCampground = campgroundsArray.find(campground => campground.$.facilityName === postData.title);

      if(selectedCampground) {
      const state = selectedCampground.$.state || '';
      const amps = selectedCampground.$.sitesWithAmps || '';
      const pets = selectedCampground.$.sitesWithPetsAllowed || '';
      const sewer = selectedCampground.$.sitesWithSewerHookup || '';
      const water = selectedCampground.$.sitesWithWaterHookup || '';
      const waterfront = selectedCampground.$.sitesWithWaterfront || '';

      setState(state);
      setAmps(amps);
      setPets(pets);
      setSewer(sewer);
      setWater(water);
      setWaterfront(waterfront);

      setPostData({ ...postData, state, amps, pets, sewer, water, waterfront});
      } 

    }
  }, [postData.title, campgrounds]);

  useEffect(() => {
    // Update isPrivate when post changes
    setIsPrivate(post?.isPrivate || false);
  }, [post]);
     
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentId === 0) {
      dispatch(
        createPost({ ...postData, name: user?.result?.name, state: state, amps: amps, pets: pets, sewer: sewer, water: water, waterfront: waterfront, isPrivate: isPrivate}, history)
      );
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name, state: state, amps: amps, pets: pets, sewer: sewer, water: water, waterfront: waterfront, isPrivate: isPrivate }));
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
        <div>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Share Adventures'}</Typography>
        </div>
        <div style={{ padding: '10px 5px', width: '100%' }}>
        <label>
          <input type="checkbox" checked={isPrivate} // Assuming isPrivate is a state variable
          onChange={(e) => setIsPrivate(e.target.checked)} // Assuming setIsPrivate is a state update function
        />
          Private Post
        </label>
        </div>
        <div style={{ padding: '0 17px 0 0', width: '100%' }}>
          <Autocomplete
          freeSolo
          autoSelect
          id="title"
          value={postData.title} 
          onInputChange={(event, newValue) => {
            handleTitleChange({ target: { value: newValue } });
          }}
          options={postData.title ? filteredFacilityNames : []}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} label="Campground Name" variant="outlined"/>
          )}
        />
        </div>
        <TextField name="site" variant="outlined" label="Site Number" fullWidth value={postData.site} onChange={(e) => setPostData({ ...postData, site: e.target.value })} />
        <TextField name="pros" variant="outlined" label="Pros" fullWidth value={postData.pros} onChange={(e) => setPostData({ ...postData, pros: e.target.value })} />
        <TextField name="cons" variant="outlined" label="Cons" fullWidth value={postData.cons} onChange={(e) => setPostData({ ...postData, cons: e.target.value })} />
        <TextField name="message" variant="outlined" label="Description" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags - Press Enter"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        <div className={classes.fileInput}>
          <FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        </div>
        <Button className={classes.buttonSubmit} variant="contained" size="large" type="submit" fullWidth>
          Submit
        </Button>
        <Button className={classes.buttonClear} variant="contained" size="small" onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;