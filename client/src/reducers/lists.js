// Reducers/Lists
import { FETCH_ALL_LISTS, CREATE_LIST, UPDATE_LIST, DELETE_LIST } from '../constants/actionTypes';

export default (lists = [], action) => {
    switch (action.type) {
        case DELETE_LIST:
            console.log('DELETE_LIST Called from reducers/lists');
            return lists.filter((list) => list._id !== action.payload);
        case UPDATE_LIST:
            console.log('UPDATED_LIST Called from Reducers/lists');
            return lists.map((list) => (list._id === action.payload._id ? action.payload : list));
        case FETCH_ALL_LISTS:
            return action.payload;
        case CREATE_LIST:
            console.log('CREATE_LIST Called from reducers/lists');
            return [...lists, action.payload];
        default:
            return lists;
    }
};
