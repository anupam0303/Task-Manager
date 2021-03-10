import axios from "axios"; 
import * as backend from '../config';
import * as actions from "../actions/types";
import { returnErrors } from "./errorActions";
import {tokenConfig} from './authActions';

export const getTaskLists = (boardid) => (dispatch, getState) => {
    console.log('boardid in getTaskLists: ' + boardid );
    dispatch(setBoardListsLoading());
    const BOARDLIST_URL = '/api/boards/';
    console.log('URL to fetch the boardlists is : ' + BOARDLIST_URL+ boardid );
    axios
    .get(backend.backend+BOARDLIST_URL+ boardid, tokenConfig(getState))
    .then((response) =>
      dispatch({
        type: actions.GET_BOARD_TASKLISTS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("Error:" + error);
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

export const createtaskList = (newTaskList) => (dispatch, getState) => {

  // Request Body
  const body = JSON.stringify({ ...newTaskList });
  console.log('Create task list body is: ' + body);
  axios
    .post(backend.backend+"/api/tasklists", body, tokenConfig(getState))
    .then((response) =>
      dispatch({
        type: actions.TASKLIST_CREATE_SUCCESS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("In catch block" + error);
      dispatch({
        type: actions.TASKLIST_CREATE_FAIL,
        payload: error,
      });
      dispatch(
        returnErrors(
          error.response.data,
          error.response.status,
          "TASKLIST_CREATE_FAIL"
        )
      );
    });
};


export const createTask = (newTask) => (dispatch, getState) => {
    // Request Body
  const body = JSON.stringify({ ...newTask });
  console.log('Create task body is: ' + body);
  axios
    .post(backend.backend+"/api/tasks", body, tokenConfig(getState))
    .then((response) =>
      dispatch({
        type: actions.TASK_CREATE_SUCCESS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("In catch block" + error);
      dispatch({
        type: actions.TASK_CREATE_FAIL,
        payload: error,
      });
      dispatch(
        returnErrors(
          error.response.data,
          error.response.status,
          "TASK_CREATE_FAIL"
        )
      );
    });
};


export const setBoardListsLoading = () => {
    return {
      type: actions.BOARD_TASKLISTS_LOADING,
    };
  };