import * as actions from "../actions/types";

const initialState = {
  boards: [],
  loading: false,
  boardCreateLoading: false,
  workingBoard: localStorage.getItem('workingboardid'),
  workingBoardName: localStorage.getItem('workingboardname'),
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
    case actions.SET_WORKING_BOARD:
      localStorage.setItem('workingboardid', action.boardid);
      localStorage.setItem('workingboardname', action.boardname);    
      return {
          ...state,
          workingBoard: action.boardid,
          workingBoardName: action.boardname
        };
    case actions.BOARD_CREATE_SUCCESS:
      window.location.reload();
      return {
          ...state,
          boardCreateLoading: false,
      };
    case actions.BOARD_CREATE_FAIL:
    default:
      return state;
  }
}
