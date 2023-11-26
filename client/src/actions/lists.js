// actions/lists

import { START_LOADING, END_LOADING, FETCH_LIST, FETCH_ALL_LISTS, CREATE_LIST, UPDATE_LIST, DELETE_LIST } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getList = (id) => async (dispatch) => {
    try {
      console.log("Actions/lists/getList started");
      dispatch({ type: START_LOADING });
  
      const { data } = await api.fetchList(id);
  
      dispatch({ type: FETCH_LIST, payload: { list: data } });
      dispatch({ type: END_LOADING });
      console.log("Actions/lists/getList completed")
    } catch (error) {
      console.log(error);
    }
  };

export const getLists = (page) => async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });
      const { data: { data, currentPage, numberOfPages } } = await api.fetchLists(page);
  
      dispatch({ type: FETCH_ALL_LISTS, payload: { data, currentPage, numberOfPages } });
      dispatch({ type: END_LOADING });
    } catch (error) {
      console.log(error);
    }
  };

export const createList = (list) => async (dispatch) => {
    try {
        const { data } = await api.createList(list);
        dispatch({ type: CREATE_LIST, payload: data });
        console.log('CREATE_LIST Succeeded in Actions/Lists');
    } catch (error) {
        console.log(error);
        console.log('CREATE_LIST failed in Actions/Lists');
    }
};

export const updateList = (id, list) => async (dispatch) => {
    try {
        const { data } = await api.updateList(id, list);
        console.log('UPDATE_LIST Called from actions/lists');
   
        dispatch({ type: UPDATE_LIST, payload: data });
        
        console.log('UPDATE_LIST Succeeded in Actions/Lists');
    } catch (error) {
        console.log(error);
    }
};

export const deleteList = (id) => async (dispatch) => {
    try {
        const shouldDelete = window.confirm('Are you sure you want to delete the list?');

        if (shouldDelete) {
            console.log('DELETE_LIST called from actions/lists');
            await api.deleteList(id);
            dispatch({ type: DELETE_LIST, payload: id });
        }
    } catch (error) {
        console.log(error);
    }
};