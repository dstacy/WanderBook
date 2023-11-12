import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import List from './List/List';
import useStyles from './styles';

const Lists = ({ setCurrentId }) => {
  const { lists, isLoading } = useSelector((state) => state.lists);
  const currentUser = JSON.parse(localStorage.getItem('profile')) || { result: { name: null } };
  const classes = useStyles();

  if (!lists.length && !isLoading) return 'No lists';

  const userLists = lists.filter((list) => list.creator === currentUser.result.name);

  return (
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {userLists.map((list) => (
          <Grid key={list._id} item xs={12} sm={12} md={6} lg={3}>
            <List list={list} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Lists;