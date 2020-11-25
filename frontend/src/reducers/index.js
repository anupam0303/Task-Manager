import {combineReducers} from 'redux';
import boardsReducer from './boardsReducer';
import taskListReducer from './taskListReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';


export default combineReducers({
    boards: boardsReducer,
    taskLists: taskListReducer,
    error: errorReducer,
    auth: authReducer
});