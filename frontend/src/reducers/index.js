import { combineReducers } from "redux";
import { apiReducer } from "./apiReducer";

const rootReducer = combineReducers({
  apiStore: apiReducer
});

export default rootReducer;
