// actions/lists

import { FETCH_ALL_LISTS, CREATE_LIST, UPDATE_LIST, DELETE_LIST } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getLists = () => async (dispatch) => {
    try {
        const { data } = await api.fetchLists();

        dispatch({ type: FETCH_ALL_LISTS, payload: data });
        console.log('FETCH_ALL_LISTS called in action/lists');
    } catch (error) {
        console.log('FETCH_ALL_LISTS Failed in Actions/lists');
        console.log(error);
    }
};

export const createList = (list) => async (dispatch) => {
    console.log('createList in Actions/lists');
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
        console.log('Waiting on api.updateList');
        const { data } = await api.updateList(id, list);
        console.log('UPDATE_LIST Called from actions/lists');
        dispatch({ type: UPDATE_LIST, payload: data });
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
