import {
  FETCH_USERS,
  LIKE_USER,
  UNLIKE_USER,
  LOGIN_USER,
  LOGOUT_USER
} from "../actions";

export const initialState = {
  users: [],
  isLoadingData: false,
  token: false,
  currentUser: {
    id: "",
    username: "",
    numLikes: 0
  }
};

function updateAndSortUsers(usersOld, doc) {
  const users = usersOld
    .map(user => {
      if (user.username === doc.username) {
        // doc is the document fetched from the database, so we need to keep
        // only a portion of the properties.
        const keys = Object.keys(user);
        const userNew = keys.reduce((obj, k) => {
          // Gotcha!
          // in "user" there is a "id" property;
          // in "doc" there is a "_id" property
          const key = k === "id" ? "_id" : k;
          return Object.assign(obj, { [k]: doc[key] });
        }, {});
        return userNew;
      } else {
        return user;
      }
    })
    .sort((a, b) => {
      return b.numLikes - a.numLikes;
    });
  return users;
}

export const apiReducer = (state = initialState, action) => {
  let users;
  switch (action.type) {
    case `${FETCH_USERS}_FULFILLED`:
      users = action.payload.data;
      return {
        ...state,
        users,
        isLoadingData: false
      };
    case `${FETCH_USERS}_REJECTED`:
      return {
        ...state,
        users: [{ username: "TODO: FETCH_USERS_REJECTED" }]
      };
    case `${FETCH_USERS}_PENDING`:
      return {
        ...state,
        isLoadingData: true
      };
    case `${LIKE_USER}_FULFILLED`:
    case `${UNLIKE_USER}_FULFILLED`:
      users = updateAndSortUsers(state.users, action.payload.data.new);
      return {
        ...state,
        users
      };
    case `${LIKE_USER}_REJECTED`:
    case `${UNLIKE_USER}_REJECTED`:
      console.log("TODO: LIKE/UNLIKE USER_REJECTED");
      return {
        ...state
      };
    case `${LOGIN_USER}_FULFILLED`:
      const { username, numLikes, id, token } = action.payload.data;
      return {
        ...state,
        currentUser: {
          username,
          numLikes,
          id
        },
        token
      };
    case `${LOGIN_USER}_REJECTED`:
      console.log("TODO: LOGIN_USER_REJECTED", action.payload);
      return {
        ...state,
        token: false,
        currentUser: initialState.currentUser
      };
    case LOGOUT_USER:
      return {
        ...state,
        token: false
      };
    default:
      return state;
  }
};
