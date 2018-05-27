import axios from "axios";

export const FETCH_USERS = "fetch users from a remote mongo db database";


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

// const users = [
//   { username: "bob123", numLikes: 4 },
//   { username: "anna456", numLikes: 7 },
//   { username: "jack987", numLikes: 3 },
//   { username: "john333", numLikes: 5 },
//   { username: "steve111", numLikes: 1 }
// ];

// export function fetchUsers() {
//   const action = { type: FETCH_USERS, payload: users };
//   return action;
// }

export function fetchUsers() {
  return function(dispatch) {
    dispatch({
      type: FETCH_USERS,
      payload: axios.get("/most-liked")
    });
  };
}
