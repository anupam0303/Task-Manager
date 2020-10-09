import {combineReducers} from 'redux';
import boardsReducer from './boardsReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    boards: boardsReducer,
    error: errorReducer,
});