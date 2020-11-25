import axios from "axios"; 
import * as actions from "../actions/types";
import { returnErrors } from "./errorActions";
import {tokenConfig} from './authActions';

export const getBoards = () => (dispatch, getState) => {
  dispatch(setBoardsLoading());
  axios
    .get("/api/boards", tokenConfig(getState))
    .then((response) =>
      dispatch({
        type: actions.GET_BOARDS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("Error:" + error);
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// Create new board
export const createBoard = ({ boardName }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ boardName });
  axios
    .post("/api/boards", body, config)
    .then((response) =>
      dispatch({
        type: actions.BOARD_CREATE_SUCCESS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("In catch block" + error);
      dispatch({
        type: actions.BOARD_CREATE_FAIL,
        payload: error,
      });
      dispatch(
        returnErrors(
          error.response.data,
          error.response.status,
          "BOARD_CREATE_FAIL"
        )
      );
    });
};

export const setBoardsLoading = () => {
  return {
    type: actions.BOARDS_LOADING,
  };
};

export const setWorkingBoard = (boardid) => {
  return {
    type: actions.SET_WORKING_BOARD,
    boardid: boardid
  }
}
