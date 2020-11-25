import * as actions from "../actions/types";

const initialState = {
  taskLists: [],
  loading: false,
  taskListCreateLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.GET_BOARD_TASKLISTS:
      return {
        ...state,
        taskLists: action.payload,
        loading: false,
      };
    case actions.BOARD_TASKLISTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actions.TASKLIST_CREATE_FAIL:
    case actions.TASKLIST_CREATE_SUCCESS:
      return {
        ...state,
        taskListCreateLoading: false,
      };
    default:
      return state;
  }
}
