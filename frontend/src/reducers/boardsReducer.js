import * as actions from "../actions/types";

const initialState = {
  boards: [],
  loading: false,
  boardCreateLoading: false,

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
    case actions.CREATE_BOARD:
      return {
        ...state,
        loading: true,
      };
      case actions.BOARD_CREATE_FAIL:
      case actions.BOARD_CREATE_SUCCESS:
        return {
            ...state,
            boardCreateLoading: false,
        };
    default:
      return state;
  }
}
