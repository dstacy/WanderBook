import React, { useState } from 'react';
import { Container, Grow, Grid, Paper } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

import Lists from '../Lists/Lists';
import ListForm from '../ListForm/ListForm';
import Pagination from '../Pagination';
import useStyles from './styles';
import { getLists } from '../../actions/lists'; // Adjust the import path as needed


function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const ListHome = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  


  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Lists setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ListForm currentId={currentId} setCurrentId={setCurrentId} />
              <Paper className={classes.pagination} elevation={6}>
              <Pagination page={page} action={getLists} selector={(state) => state.lists} uniqueKey="lists" />
              </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default ListHome;
