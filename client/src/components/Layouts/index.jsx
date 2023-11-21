import React, {useEffect, useState} from 'react'
import {Button, styled} from "@material-ui/core";
import {Divider, Avatar} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import {Box, List} from "@mui/material";
import useStyles from "./styles";
import { ListItemText } from '@mui/material';


import ListItemButton from "@mui/material/ListItemButton";
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ListAltIcon from '@mui/icons-material/ListAlt';
import * as actionType from "../../constants/actionTypes";
import {useDispatch} from "react-redux";
import {useHistory, Link, useParams} from "react-router-dom";
import useInterval from "../../hooks/useInterval";
import {getPostsByCreator} from "../../actions/posts";
import {getLists} from "../../actions/lists";

const drawerWidth = 240;
const Drawer = styled(MuiDrawer)(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            border: 'none',
            background: 'transparent',
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

export default ({ children }) => {
    const { name } = useParams();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [open, setOpen] = useState(true);
    const classes = useStyles();

    const dispatch = useDispatch();
    const history = useHistory();

    useInterval(() => {
        dispatch(getPostsByCreator(name));
        dispatch(getLists())
    }, 10000);

    const logout = () => {
        dispatch({ type: actionType.LOGOUT });

        history.push('/auth');

        setUser(null);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        dispatch(getPostsByCreator(name))
        dispatch(getLists())
    }, []);

  return (
    <div className={classes.layoutWrapper}>
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>

            <div className={classes.userInfoWrapper}>
                <Avatar className={classes.userImage} alt={user.result.name} src="./images/user.jpg" sx={{ height: '120px', width: '120px' }} />

                <div className={classes.userInfo}>
                    <h3 className={classes.userName}>{user.result.name}</h3>
                    <span className={classes.userEmail}>{user.result.email}</span>
                </div>
            </div>
            <Drawer variant="permanent" open={open}>
                <Divider color="#673ab7" sx={{ my: 1, borderBottomWidth: 2 }} />
                <List component="nav">
                    {/*<ListItemButton component={Link} to="dashboard" className={classes.sidebarItem}>*/}
                    {/*    <PersonIcon fontSize="large"/>*/}
                    {/*    <ListItemText primary="Profile"/>*/}
                    {/*</ListItemButton>*/}

                    <ListItemButton component={Link} to={`/creators/${user.result.name}`} className={classes.sidebarItem}>
                        <RssFeedIcon fontSize="large"/>
                        <ListItemText primary="Posts"/>
                    </ListItemButton>

                    <ListItemButton component={Link} to="/lists" className={classes.sidebarItem}>
                        <ListAltIcon fontSize="large"/>
                        <ListItemText primary="Lists"/>
                    </ListItemButton>
                    <Divider color="#673ab7" sx={{ my: 1, borderBottomWidth: 2 }} />


                </List>
                <Button variant="contained" className={classes.signOut} onClick={logout}>Logout</Button>

            </Drawer>
        </Box>

        { children }
    </div>
  )
}