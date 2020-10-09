import axios from "axios";
import * as actions from "../actions/types";
import { returnErrors } from "./errorActions";

export const getBoards = () => (dispatch, getState) => {
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

  export const setBoardsLoading = () => {
    return {
      type: actions.BOARDS_LOADING,
    };
  };