import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import PostDetails from './components/PostDetails/PostDetails';
import ListDetails from './components/ListDetails/Listdetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';
import Search from './components/Search/Search';
import ListHome from './components/ListHome/ListHome';
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/posts" />} />
          <Route path="/posts" exact component={Home} />
          <Route path="/search" exact component={Search} />
          <Route path="/lists" exact component={ListHome} />
          <Route path="/dashboard/:name" exact component={Dashboard}/>
          <Route path="/posts/:id" exact component={PostDetails} />
          <Route path="/lists/:id" exact component={ListDetails} />
          <Route path={['/creators/:name', '/tags/:name']} component={CreatorOrTag} />
          <Route path="/auth" exact component={() => (!user ? <Auth /> : <Redirect to="/posts" />)} /> 
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
