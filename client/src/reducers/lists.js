import { FETCH_LIST, FETCH_ALL_LISTS, CREATE_LIST, DELETE_LIST, UPDATE_LIST } from '../constants/actionTypes';

export default (state = { isLoading: true, lists: [] }, action) => {
    switch (action.type) {
      case 'START_LOADING':
        return { ...state, isLoading: true };
      case 'END_LOADING':
        return { ...state, isLoading: false };
      case FETCH_LIST:
        console.log("reducers/lists/FETCH_LIST");
        return { ...state, list: action.payload.list };
      case FETCH_ALL_LISTS:
        return {
          ...state,
          lists: action.payload.data,
          currentPage: action.payload.currentPage,
          numberOfPages: action.payload.numberOfPages,
        };
      case CREATE_LIST:
        return { ...state, lists: [...state.lists, action.payload] };
      case UPDATE_LIST:
        return { ...state, lists: state.lists.map((list) => (list._id === action.payload._id ? action.payload : list)) };
      case DELETE_LIST:
        return { ...state, lists: state.lists.filter((list) => list._id !== action.payload) };
      default:
        return state;
    }
  };
  
  