import { FETCH_USERS } from "../actions";

export const initialState = {
  users: []
};

export const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${FETCH_USERS}_FULFILLED`:
      return {
        ...state,
        users: action.payload.data
      };
    case `${FETCH_USERS}_REJECTED`:
      return {
        ...state,
        users: [{ username: "TODO" }]
      };
    default:
      return state;
  }
};
