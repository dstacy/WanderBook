import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory, Link } from 'react-router-dom';

import { getList, updateList } from '../../actions/lists';
import useStyles from './styles';

const List = () => {
  const { id } = useParams();
  const { list, isLoading } = useSelector((state) => state.lists);
  const [item, setItem] = useState({ name: '', category: '' });
  const [newItem, setNewItem] = useState(list ? list.items : []);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [editedTitle, setEditedTitle] = useState(list ? list.title : '');
  const [listData, setListData] = useState({ items: newItem, isPublic: false });
  const [sortBy, setSortBy] = useState('name'); // Default sorting by name
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
  
  const currentUser = JSON.parse(localStorage.getItem('profile')) || { result: { name: null } };
  const isCurrentUserCreator = list ? list.creator === currentUser.result.name : false;  

  useEffect(() => {
    dispatch(getList(id));
  }, [id]);

  // When editedTitle changes, call getList
  useEffect(() => {
    dispatch(getList(id));
  }, [editedTitle, id]);

  useEffect(() => {
    if(list && list.items) {
      setNewItem([...list.items]);
    }
  }, [list]);

  // When newItem changes, update listData
  useEffect(() => {
    setListData({ ...listData, items: newItem, isPublic: list ? list.isPublic : false });
  }, [newItem]);

  useEffect(() => {
    if (isCurrentUserCreator) {
      focusOnAddItemInput();
    }
  }, []); // empty dependency array means this effect runs once on mount
  
  const focusOnAddItemInput = () => {
    const addItemInput = document.getElementById('addItemInput');
    if (addItemInput) {
      addItemInput.focus();
    }
  };

  // when listData changes, update database
  useEffect(() => {
    dispatch(updateList(id, listData));
  }, [listData]);

  const handleEditTitle = () => {
    const newTitle = prompt('Enter a new Title:', list.title);
    if(newTitle !== null) {
      setListData({ ...listData, title: newTitle });
      setEditedTitle(newTitle);

      // Dispatch API call to update the title immediately
      dispatch(updateList(id, { title: newTitle }));
    }
  };

  const createANewItemToAdd = (event) => {
    const itemName = event.target.value;
    // Set Category to default to Main until a category field is created
    const itemCategory = item.category || 'Main';
    setItem({ name: itemName, category: itemCategory });
  };

  const handleCategoryClick = (event) => {
    event.target.select();
  };

  const addItemToList = () => {
    // set if statement so a blank item couldn't be added to the list
    if (item.name) {
        // If Item already exists in newItem then it will not be added.
        // Alert user if the item already exists
        if (!newItem.some((existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase())) {

            setNewItem((prev) => ([...prev, item]));
            if (isCurrentUserCreator) {
              focusOnAddItemInput();
            }
        } else {
            window.alert('This item is already in the list.');
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
      if (document.activeElement.tagName === 'INPUT') {
        addItemToList();
      }
    }
  };

  // Handle the key press event for the title input
  const handleTitleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior (e.g., submitting a form)
      handleEditTitle();
    }
  };

  // Function to handle sorting option change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

   // Function to handle sorting order change
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Function to get sorted items based on the selected sorting option and order
  const getSortedItems = () => {
    return newItem.slice().sort((a, b) => {
      const orderFactor = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * orderFactor;
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category) * orderFactor;
      }
      return 0;
    });
  };

  if (!list) return null;

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6} onKeyPress={handleKeyPress}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2" onKeyPress={handleTitleKeyPress}>
            {list.title} 
            {isCurrentUserCreator && (
                <Button color="primary" style={{ marginTop: '30px', marginLeft: '10px', fontSize: '0.8rem' }}onClick={handleEditTitle}>
                  <EditIcon style={{ fontSize: '1rem', marginRight: '5px' }} />
                  Edit Title
                </Button>
            )}</Typography>
          <Typography variant="h6">
            Created by: {` ${list.creator}`}
          </Typography>
          <Typography variant="body1">Created: {moment(list.createdAt).format('YYYY-MM-DD')}</Typography>
          {isCurrentUserCreator && (
            <>
            <FormControlLabel
                control={<Checkbox checked={listData.isPublic} onChange={(e) => setListData({ ...listData, isPublic: e.target.checked })} />}
                label="Make Public"
            />
            </>
          )}
          <Divider style={{ margin: '20px 0' }} />
        </div>
      </div>
        <br />
        <br />
            <div>
            {isCurrentUserCreator && (
              <>
                <input id="addItemInput" type="text" value={item.name} placeholder="Add an Item" onChange={createANewItemToAdd} />
                <br />
                <input type="text" value={item.category} placeholder="Add an Category" onClick={handleCategoryClick} onChange={(e) => setItem({ ...item, category: e.target.value })} />
                <Button onClick={addItemToList}>
                    <AddIcon />
                </Button>
              </>
            )}
                  <select value={sortBy} onChange={handleSortChange}>
                    <option value="name">Sort by Name</option>
                    <option value="category">Sort by Category</option>
                  </select>
                  &nbsp;&nbsp;
                  <select value={sortOrder} onChange={handleSortOrderChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>                 
                      <>
                        <Button className={classes.buttonClose} component={Link} to="/lists" variant="contained" style={{ marginLeft: '650px' }}>
                          Close List
                        </Button>
                      </>
                <br />
                <br />
                <TableContainer style={{ maxHeight: '600px' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                      {isCurrentUserCreator && (
                          <>
                            <TableCell className={classes.TableHead} style={{ width: '1%' }}>Completed</TableCell>
                          </>
                        )}
                        <TableCell className={classes.TableHead} style={{ width: '20%' }}>Item</TableCell>
                        <TableCell className={classes.TableHead} style={{ width: '20%' }}>Category</TableCell>
                        <TableCell className={classes.TableHead} style={{ width: '1%' }}></TableCell>
                        <TableCell className={classes.TableHead} style={{ width: '1%' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getSortedItems().map((listItem, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? classes.evenRow : classes.oddRow}>
                          {isCurrentUserCreator && (
                          <>
                            <TableCell style={{ width: '1% '}}><Checkbox /></TableCell>
                          </>
                        )}
                          <TableCell style={{ width: '20%' }}>{listItem.name}</TableCell>
                          <TableCell style={{ width: '20%' }}>{listItem.category}</TableCell>
                          <TableCell style={{ width: '1%' }}>
                        {isCurrentUserCreator && (
                          <>
                            <Button size="small" color="primary" onClick={() => editItem(index)}>
                              <EditIcon />
                            </Button>
                          </>
                        )}
                          </TableCell>
                          <TableCell style={{ width: '1%' }}>
                          {isCurrentUserCreator && (
                            <>
                              <Button className="deleteItem" size="small" color="primary" onClick={() => deleteItem(index)}>
                                <DeleteIcon />
                              </Button>
                            </>
                          )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </div>
            <br />
            <br />
            <div>
            {isCurrentUserCreator && (
              <>
                <Button onClick={clearList}>
                    <DeleteIcon />Delete All Items
                </Button>
              </>
            )}
            </div>
      
    </Paper>
  );
};

export default List;
