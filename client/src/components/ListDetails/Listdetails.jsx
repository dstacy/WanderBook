import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core/';
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
  
  const { id } = useParams();
  console.log("id", id);
  const { list, isLoading } = useSelector((state) => state.lists);
  const [item, setItem] = useState({ name: '', category: '' });
  const [newItem, setNewItem] = useState(list ? list.items : []);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [listData, setListData] = useState({ items: newItem });

  useEffect(() => {
    console.log("Id Changed or set - listDetails Calling getList");
    dispatch(getList(id));
  }, [id]);

  useEffect(() => {
    if(list && list.items) {
      console.log("list had Changed or set - setNewItem");
      setNewItem([...list.items]);
    }
  }, [list]);

  // When newItem changes, update listData
  useEffect(() => {
    console.log("newItem has changed or set - setListData");
    setListData({ ...listData, items: newItem });    
  }, [newItem]);

  // when listData changes, update database
  useEffect(() => {
    console.log('listData has changed or set - dispatch(updateList(listData)');
    dispatch(updateList(id, listData));
  }, [listData]);

  const createANewItemToAdd = (event) => {
    const itemName = event.target.value;
    // Set Category to default to Main until a category field is created
    const itemCategory = item.category || 'Main';
    setItem({ name: itemName, category: itemCategory });
  };

  const addItemToList = () => {
    // set if statement so a blank item couldn't be added to the list
    if (item.name) {
      console.log("addItemToList has been initiated")
        // If Item already exists in newItem then it will not be added.
        // Alert user if the item already exists
        if (!newItem.some((existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase())) {
            console.log("addItemToList calling setNewItem");
            setNewItem((prev) => ([...prev, item]));
        } else {
            window.alert('This item is already in the list.');
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

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  console.log('newItem: ', newItem);
  console.log('listData: ', listData)

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
                <input type="text" value={item.name} placeholder="Add an Item" onChange={createANewItemToAdd} onKeyPress={handleKeyPress} />
                <br />
                <input type="text" value={item.category} placeholder="Add an Category" onChange={(e) => setItem({ ...item, category: e.target.value })} />
                <Button onClick={addItemToList}>
                    <AddIcon />
                </Button>
                <br />
                <br />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.TableHead}>Item</TableCell>
                        <TableCell className={classes.TableHead}>Category</TableCell>
                        <TableCell className={classes.TableHead}>Edit</TableCell>
                        <TableCell className={classes.TableHead}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {newItem.map((item, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? classes.evenRow : classes.oddRow}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <Button size="small" color="primary" onClick={() => editItem(index)}>
                              <EditIcon />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button className="deleteItem" size="small" color="primary" onClick={() => deleteItem(index)}>
                              <DeleteIcon />
                            </Button>
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
                <Button onClick={clearList}>
                    <DeleteIcon />Delete All Items
                </Button>
            </div>
      
    </Paper>
  );
};

export default List;
