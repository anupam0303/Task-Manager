import axios from "axios"; 
import * as actions from "../actions/types";
import { returnErrors } from "./errorActions";

export const getBoards = () => (dispatch) => {
  dispatch(setBoardsLoading());
  axios
    .get("/api/boards")
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
export const createBoard = ({ boardName, name }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ boardName, name });
  axios
    .post("/api/boards", body, config)
    .then((response) =>
      dispatch({
        type: actions.BOARD_CREATE_SUCCESS,
        payload: response.data,
      })
    )
    .catch((error) => {
      console.log("IN catch block" + error);
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
