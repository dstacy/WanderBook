import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase, Menu, MenuItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteList, createList } from '../../../actions/lists';
import moment from 'moment';

import campFire from '../../../images/campFire1.jpg';
import useStyles from './styles';

const generateNewId = () => {
    return '_' + Math.random().toString(36).substr(2, 9); // Adjust the length as needed
  };

const List = ({ list, setCurrentId }) => {    
    const user = JSON.parse(localStorage.getItem('profile'));
    const [duplicatedListData, setListData] = useState({ creator: user?.result?.name, title: `${list.title} (Copy)`, items: list.items, isPublic: false });
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();    
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    
    useEffect(() => {
        // Check if the list has been deleted, then close the menu
        if (!list) {
            setMenuAnchorEl(null);
        }
    }, [list]);

    const openList= (e) => {
        history.push(`/lists/${list._id}`);
    }

    const handleMenuOpen = (e) => {
        e.stopPropagation();
        setMenuAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleDeleteList = (e) => {
        e.stopPropagation();
        dispatch(deleteList(list._id));
        handleMenuClose();
    };

    const handleDuplicateList = () => {
        dispatch(createList(duplicatedListData));
        handleMenuClose();
    };

    return (
        <Card className={classes.card}>
            <ButtonBase
                component="span"
                name="test"
                className={classes.cardAction}
                onClick={openList}
            >
                <CardMedia className={classes.media} image={campFire} alt={list.title} title={list.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{list.creator}</Typography>
                </div>
                <div className={classes.overlay2} onClick={(e) => e.stopPropagation()}>
                    <Button style={{ color: 'white' }} size="small" onClick={handleMenuOpen}>
                        <MoreHorizIcon fontSize="medium" />
                    </Button>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleDuplicateList}>
                            <FileCopyIcon fontSize="small" style={{ marginRight: '8px' }} />
                            Duplicate List
                        </MenuItem>
                        <MenuItem onClick={handleDeleteList}>
                            <DeleteIcon fontSize="small" style={{ marginRight: '8px' }} />
                            Delete List
                        </MenuItem>
                        {/* Add more menu items as needed */}
                    </Menu>
                </div>
                <CardContent>
                    <Typography className={classes.title} variant="h5" gutterBottom>
                        {list.title}
                    </Typography>
                </CardContent>
            </ButtonBase>
        </Card>
    );
};

export default List;