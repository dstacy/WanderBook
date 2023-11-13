import React, { useState } from 'react';
import { Grid, CircularProgress, Checkbox, FormControlLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';

import List from './List/List';
import useStyles from './styles';

const Lists = ({ setCurrentId }) => {
  const { lists, isLoading } = useSelector((state) => state.lists);
  const currentUser = JSON.parse(localStorage.getItem('profile')) || { result: { name: null } };
  const classes = useStyles();

  const [showPublicLists, setShowPublicLists] = useState(false);

  if (!lists.length && !isLoading) return 'No lists';

  // Create two lists to view public Lists and user's Lists
  const publicLists = lists.filter((list) => list.isPublic);
  const userLists = lists.filter((list) => list.creator === currentUser.result.name);

  // Combine lists based on the showPublicLists value
  const displayedLists = showPublicLists ? publicLists : userLists;

  // Sort displayed lists by most recent to least recent
  const sortedLists = displayedLists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return (
    isLoading ? ( <CircularProgress /> ) : (
      <div>
        <FormControlLabel
          control={<Checkbox checked={showPublicLists} onChange={() => setShowPublicLists(!showPublicLists)} />}
          label="Show Public Lists"
        />
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {sortedLists.map((list) => (
          <Grid key={list._id} item xs={12} sm={12} md={6} lg={3}>
            <List list={list} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
      </div>
    )
  );
};

export default Lists;