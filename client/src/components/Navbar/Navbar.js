import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import logo from '../../images/WanderBookFull.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';


const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img className={classes.image} component={Link} to="/" src={logo} alt="icon" height="100px" />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button className={classes.buttons} component={Link} to="/posts" variant="contained">Posts</Button>
            <Button className={classes.buttons} component={Link} to="/lists" variant="contained">Lists</Button>
            <Button className={classes.buttons} component={Link} to="/search" variant="contained">Search</Button>
            <Button variant="contained" className={classes.signOut} onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button className={classes.buttons} component={Link} to="/auth" variant="contained">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
