import * as actions from "../actions/types";

const initialState = {
  taskLists: [],
  loading: false,
  taskListCreateLoading: false,
  taskCreateLoading: false,
  newTask: null,
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
    case actions.TASKLIST_CREATE_SUCCESS:
      window.location.reload();
      return {
        ...state,
        taskListCreateLoading: false,
      };
    case actions.TASK_CREATE_SUCCESS:
      window.location.reload();
      return {
        ...state,
        newTask: action.payload,
        taskCreateLoading: false,
      };
    case actions.TASK_CREATE_FAIL:
    case actions.TASKLIST_CREATE_FAIL:
    default:
      return state;
  }
}
