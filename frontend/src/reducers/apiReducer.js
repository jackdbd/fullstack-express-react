import { FETCH_USERS } from "../actions";

export const initialState = {
  users: []
};

export const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
};
