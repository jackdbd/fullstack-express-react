import axios from "axios";

export const FETCH_USERS = "fetch users from db";
export const LIKE_USER = "like user and update his numLikes in db";
export const UNLIKE_USER = "unlike user and update his numLikes in db";

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
  return function(dispatch) {
    dispatch({
      type: FETCH_USERS,
      payload: axios.get("/most-liked")
    });
  };
}

export function likeUser(id) {
  // TODO
  // const request = axios.put(`/user/${id}/like`).set("x-access-token", token)
  // const request = axios.get(`/most-liked`)
  // const request = axios.get(`/me`)
  const url = `${HOST}:${PORT}/user/${id}/like`;
  const data = JSON.stringify({ id: id });
  const config = {
    headers: { "Content-Type": "application/json" }
  };
  const request = axios.put(url, data, config);
  return function(dispatch) {
    dispatch({
      type: LIKE_USER,
      payload: request
    });
  };
}

// TODO: unlike user
