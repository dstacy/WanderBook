// How the lists are displayed on the list page

import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deleteList, updateList } from '../../../actions/lists';

import useStyles from './styles';

const List = ({ list, setCurrentId }) => {
    const [item, setItem] = useState({ name: '', category: '' });
    // set useState to list.item so the list would populate with current items in the database
    const [newItems, setNewItems] = useState(list.items);
    const currentId = list._id;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [listData, setListData] = useState({ item: newItems });

    // When newItem changes, update listData
    useEffect(() => {
        setListData({ ...listData, items: newItems });
    }, [newItems]);

    // when listData changes, update database
    useEffect(() => {
        dispatch(updateList(currentId, listData));
    }, [listData]);

    const createANewItemToAdd = (event) => {
        // Set Category to default to Main until a category field is created
        setItem({ ...item, name: event.target.value, category: 'Main' });
    };

    const addItem = () => {
        // set if statement so a blank item couldn't be added to the list
        if (item.name) {
            // If Item already exists in newItem then it will not be added.
            // Alert user if the item already exists
            if (!newItems.some((existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase())) {
                // If it doesn't exist, add the item
                setNewItems((prev) => ([...prev, item]));
            } else {
                window.alert('This item is already in the lest.');
                console.log('Item already exists in the array.');
            }
        }

        // set the item field back to blank
        setItem({ name: '', category: '' });
    };

    // delete an item from an existing list
    const deleteItem = (index) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const updatedItems = [...newItems];
            updatedItems.splice(index, 1);
            setNewItems(updatedItems);
        }
    };

    // clears the entire list
    const clearList = () => {
        const shouldClear = window.confirm('Are you sure you want to clear the entire list?');
        if (shouldClear) {
            setNewItems([]);
        }
    };

    // edit an existing item in an existing list
    const editItem = (index) => {
        const updatedName = prompt('Edit the item name:', newItems[index].name);
        const updatedCategory = prompt('Edit the item category:', newItems[index].category);
        if (updatedName !== null && updatedCategory !== null) {
            const updatedItems = [...newItems];
            updatedItems[index] = { name: updatedName, category: updatedCategory };
            setNewItems(updatedItems);
        }
    };

    // code to addItem if "Enter" is pressed
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    };

    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image="client/src/images/campFire1.jpg" title={list.title} />
            <div className={classes.overlay}>
                <Typography variant="h6">{list.creator}</Typography>
                {/* moment used for showing the creation date.  This may not be necessary. */}
                {/* <Typography variant="body2">{moment(list.createdAt).fromNow()}</Typography> */}
            </div>
            <div className={classes.overlay2}>
                <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(list._id)}>
                    <MoreHorizIcon fontSize="medium" />
                </Button>
            </div>
            <CardContent>
                <Typography className={classes.title} variant="h5" gutterBottom>{list.title}</Typography>
            </CardContent>
            <div>
            <br />
            <br />
                <div>
                    <input type="text" value={item.name} placeholder="Add an Item" onChange={createANewItemToAdd} onKeyDown={handleKeyPress} />
                    <Button onClick={addItem}>
                        <AddIcon />
                    </Button>
                    <br />
                    <br />
                    <ul className="textFont">
                        {
                            newItems.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.category}
                                <Button size="small" color="primary" onClick={() => editItem(index)}><EditIcon /></Button>
                                <Button className="deleteItem" size="small" color="primary" onClick={() => deleteItem(index)}><DeleteIcon /></Button>
                            </li>))
                        }
                    </ul>
                </div>
                <br />
                <br />
                <div>
                    <Button onClick={clearList}>
                        <DeleteIcon />Delete All Items
                    </Button>
                </div>
            </div>
                <CardActions className={classes.cardActions}>
                    <Button size="small" color="primary" onClick={() => dispatch(deleteList(list._id))}>
                        <DeleteIcon fontSize="small" />
                            Delete List
                    </Button>
                </CardActions>
        </Card>
    );
};

export default List;
