import {combineReducers} from 'redux';
import boardsReducer from './boardsReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';


export default combineReducers({
    boards: boardsReducer,
    error: errorReducer,
    auth: authReducer
});