import axios from "axios";

// action types

export const FETCH_USERS = "fetch users from a remote mongo db database";

// action creators

// TODO: replace with URLs of API server
// const URL_COLLECTION =
//   "http://fortunecookieapi.herokuapp.com/v1/lessons?limit=5&skip=0&page=1";
// const URL_DETAIL = "http://fortunecookieapi.herokuapp.com/v1/cookie";

const users = [
  { username: "bob123", numLikes: 4 },
  { username: "anna456", numLikes: 7 },
  { username: "jack987", numLikes: 3 },
  { username: "john333", numLikes: 5 },
  { username: "steve111", numLikes: 1 }
];

export function fetchUsers() {
  // const url = URL_COLLECTION;
  // const request = axios.get(url);
  // const action = { type: FETCH_USERS, payload: request };
  const action = { type: FETCH_USERS, payload: users };
  return action;
}
