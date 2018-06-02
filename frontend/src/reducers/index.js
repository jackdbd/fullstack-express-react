import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { apiReducer } from "./apiReducer";

const rootReducer = combineReducers({
  apiStore: apiReducer,
  form: formReducer
});

export default rootReducer;
