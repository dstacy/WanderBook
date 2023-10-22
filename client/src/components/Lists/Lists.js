import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';

import List from './List/List';
import useStyles from './styles';

const Lists = ({ setCurrentId }) => {
    const lists = useSelector((state) => state.lists);
    const classes = useStyles();

    console.log(lists);

    return (
        // May want to 
        !lists.length ? <CircularProgress /> : (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {lists.map((list) => (
                    <Grid key={list._id} item xs={12} sm={6}>
                        <List list={list} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </Grid>
        )
    );
};

export default Lists;
