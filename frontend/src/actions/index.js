import axios from "axios";

export const FETCH_USERS = "fetch users from db";
export const LIKE_USER = "like user: increment numLikes in db";
export const UNLIKE_USER = "unlike user: decrement numLikes in db";
export const LOGIN_USER = "logs a user in";
export const LOGOUT_USER = "logs a user out";

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 5000;

/* 
  What is the best way to connect the React frontend with the Express backend in
  a development environment? I think there are several possibilities:
  - define a proxy in the package.json
  - use the cors library in the server
  - use 'Access-Control-Allow-Origin': '*' in the options of the axios request
  https://gorillalogic.com/blog/webpack-and-cors/
*/
// const apiServer = axios.create({
//   baseURL: "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

export function fetchUsers() {
  // const url = `${HOST}:${PORT}/api/most-liked`;
  const url = "/api/most-liked";
  return function(dispatch) {
    dispatch({
      type: FETCH_USERS,
      payload: axios.get(url)
    });
  };
}

export function likeUser(id, token) {
  // const url = `${HOST}:${PORT}/api/user/${id}/like`;
  const url = `/api/user/${id}/like`;
  const data = JSON.stringify({ id: id });
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    }
  };
  const request = axios.put(url, data, config);
  return function(dispatch) {
    dispatch({
      type: LIKE_USER,
      payload: request
    });
  };
}

export function unlikeUser(id, token) {
  // const url = `${HOST}:${PORT}/api/user/${id}/unlike`;
  const url = `/api/user/${id}/unlike`;
  const data = JSON.stringify({ id: id });
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    }
  };
  const request = axios.put(url, data, config);
  return function(dispatch) {
    dispatch({
      type: UNLIKE_USER,
      payload: request
    });
  };
}

export function loginUser(email, username, password) {
  // const url = `${HOST}:${PORT}/api/login`;
  const url = "/api/login";
  const data = JSON.stringify({ email, username, password });
  const config = {
    headers: { "Content-Type": "application/json" }
  };
  const request = axios.post(url, data, config);
  return function(dispatch) {
    dispatch({
      type: LOGIN_USER,
      payload: request
    });
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER
  };
}
