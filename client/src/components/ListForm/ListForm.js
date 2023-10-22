// How the list entry form looks on the list page

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { createList, updateList } from '../../actions/lists';

const ListForm = ({ currentId, setCurrentId }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [listData, setListData] = useState({ creator: user?.result?.name, title: '', items: [{ name: '', category: ''}] });
    const list = useSelector((state) => (currentId ? state.lists.find((l) => l._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (list) setListData(list);
    }, [list]);

    const clear = () => {
        setCurrentId(null);
        setListData({ creator: '', title: '', item: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId) {
            dispatch(updateList(currentId, listData));
        } else {
            dispatch(createList(listData));
        }

        clear();
    };

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Editing' : 'Creating' } a List</Typography>
                <TextField name="title" variant="outlined" label="List Title" fullWidth value={listData.title} onChange={(e) => setListData({ ...listData, title: e.target.value })} />
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="large" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    );
};

export default ListForm;
