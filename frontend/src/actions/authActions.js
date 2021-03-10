import axios from 'axios';
import * as backend from '../config';
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

import {returnErrors} from './errorActions';

// Verify token and then load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    // Fetch User
    axios.get(backend.backend+'/api/auth/user', tokenConfig(getState))
        .then(response => dispatch({
            type: USER_LOADED,
            payload: response.data
        }))
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch ({
                type: AUTH_ERROR
            });

        });
};

// Setup config headers and token
export const tokenConfig = getState => {
        // Get token from local storage
        const token = getState().auth.token;

        // Set Headers
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
};


// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

// Register User
export const register = ({firstName, lastName, email, password}) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Request body
    const body = JSON.stringify({firstName, lastName, email, password});
    axios.post(backend.backend+'/api/users', body, config)
        .then(response => dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data
        }))
        .catch(error => {
            dispatch({
                type: REGISTER_FAIL
            });
            dispatch(returnErrors(error.response.data, error.response.status, 'REGISTER_FAIL'));
            
        });
};

// Login User
export const login = ({email, password}) => dispatch =>  {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({email, password});
    axios.post(backend.backend+'/api/auth', body, config)
        .then(response => dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        }))
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};


// Verify Token
export const verifyToken = ()=> (dispatch, getState) =>  {
    console.log("Calling Verify Token service");
    axios.get(backend.backend+'/api/auth/verifytoken', tokenConfig(getState))
        .then(response => dispatch({
            type: USER_LOADED,
            payload: response.data
        }))
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};
