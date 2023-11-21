import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';
import lists from './lists';
export const reducers = combineReducers({ posts, auth, lists });
