import * as actions from "../actions/types";

const initialState = {
  boards: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.GET_BOARDS:
      return {
        ...state,
        boards: action.payload,
        loading: false,
      };
    case actions.BOARDS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
