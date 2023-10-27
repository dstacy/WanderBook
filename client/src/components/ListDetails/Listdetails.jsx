import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory, Link } from 'react-router-dom';

import { getList, updateList } from '../../actions/lists';
import useStyles from './styles';

console.log("listDetails/Listdetails");

const List = () => {
  const { list, isLoading } = useSelector((state) => state.lists);
  const [item, setItem] = useState({ name: '', category: '' });
  const [newItem, setNewItem] = useState(list ? list.item : []);
  const currentId = list ? list._id : null;
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [listData, setListData] = useState({ item: newItem });

  useEffect(() => {
    dispatch(getList(id));
  }, [id]);

  // When newItem changes, update listData
  useEffect(() => {
    setListData({ ...listData, items: newItem });
  }, [newItem]);

  // when listData changes, update database
  useEffect(() => {
    dispatch(updateList(currentId, listData));
  }, [listData]);

  const createANewItemToAdd = (event) => {
    // Set Category to default to Main until a category field is created
    setItem({ ...item, name: event.target.value, category: 'Main' });
  };

  const addItemToList = () => {
    // set if statement so a blank item couldn't be added to the list
    if (item.name) {
        // If Item already exists in newItem then it will not be added.
        // Alert user if the item already exists
        if (!newItem.some((existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase())) {
            setNewItem((prev) => ([...prev, item]));
        } else {
            window.alert('This item is already in the lest.');
            console.log('Item already exists in the array.');
        }
    }

    // set the item field back to blank
    setItem({ name: '', category: '' });
  };

  // edit an existing item in an existing list
  const editItem = (index) => {
    const updatedName = prompt('Edit the item name:', newItem[index].name);
    const updatedCategory = prompt('Edit the item category:', newItem[index].category);
    if (updatedName !== null && updatedCategory !== null) {
        const updatedItems = [...newItem];
        updatedItems[index] = { name: updatedName, category: updatedCategory };
        setNewItem(updatedItems);
    }
};

  // delete an item from an existing list
  const deleteItem = (index) => {
      if (window.confirm('Are you sure you want to delete this item?')) {
          const updatedItems = [...newItem];
          updatedItems.splice(index, 1);
          setNewItem(updatedItems);
      }
  };

  // clears the entire list
  const clearList = () => {
    const shouldClear = window.confirm('Are you sure you want to clear the entire list?');
    if (shouldClear) {
        setNewItem([]);
    }
};

  // code to addItemToList if "Enter" is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addItemToList();
    }
  };

  if (!list) return null;

  const openList = (_id) => history.push(`/lists/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  console.log('return on listDetails.jsx')
  console.log()

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{list.title}</Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${list.creator}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${list.creator}`}
            </Link>
          </Typography>
          <Typography variant="body1">{moment(list.createdAt).fromNow()}</Typography>
          
          <Divider style={{ margin: '20px 0' }} />
        </div>
      </div>
        <br />
        <br />
            <div>
                <input type="text" value={item.name} placeholder="Add an Item" onChange={createANewItemToAdd} />
                <Button onClick={addItemToList}>
                    <AddIcon />
                </Button>
                <br />
                <br />
                <ul className="textFont">
                    {
                        newItem.map((item, index) => (
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
      
    </Paper>
  );
};

export default List;
