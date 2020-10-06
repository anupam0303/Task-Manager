import {combineReducers} from 'redux';
import errorReducer from './errorReducer';

export default combineReducers({
    error: errorReducer,
});