import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase, Menu, MenuItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteList } from '../../../actions/lists';

import campFire from '../../../images/campFire1.jpg';
import useStyles from './styles';

const List = ({ list, setCurrentId }) => {
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