// How the list entry form looks on the list page

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import useStyles from './styles';
import { createList, updateList } from '../../actions/lists';

const ListForm = ({ currentId, setCurrentId }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [listData, setListData] = useState({ creator: user?.result?.name, title: '', items: [], isPublic: false });
    const list = useSelector((state) => (currentId ? state.lists.find((l) => l._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (list) setListData(list);
    }, [list]);

    const clear = () => {
        setCurrentId(null);
        setListData({ title: '', isPublic: false });
    };

    const handleCheckboxChange = (e) => {
        setListData({ ...listData, createWithPresetItems: e.target.checked });

        // Add preset items when the checkbox is checked
        if (e.target.checked) {
            const presetItems = [
                { name: 'Tent', category: 'Shelter' },
                { name: 'Sleeping bag', category: 'Sleeping' },
                { name: 'More Items', category: 'can be Added' },
                // Add more items as needed
            ];

            setListData((prevData) => ({ ...prevData, items: [...prevData.items, ...presetItems] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId) {
            dispatch(updateList(currentId, listData));
        } else {
            const newListData = {
                ...listData, 
                creator: user.result.name,
                createdAt: moment().format(),   
            }
            dispatch(createList(newListData));
        }

        clear();
    };

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6" >{currentId ? 'Editing' : 'Creating' } a List</Typography>
                <TextField name="title" variant="outlined" label="List Title" fullWidth value={listData.title} onChange={(e) => setListData({ ...listData, title: e.target.value })} />
                <Button className={classes.buttonSubmit} variant="contained" size="large" type="submit" fullWidth>Submit</Button>
                <Button className={classes.buttonClear} variant="contained" size="large" onClick={clear} fullWidth>Clear</Button>
                <FormControlLabel
                    control={<Checkbox checked={listData.isPublic} onChange={(e) => setListData({ ...listData, isPublic: e.target.checked })} />}
                    label="Make Public"
                />
                <FormControlLabel
                    control={<Checkbox checked={listData.createWithPresetItems} onChange={handleCheckboxChange} />}
                    label="Create with Preset Items"
                />
            </form>
        </Paper>
    );
};

export default ListForm;