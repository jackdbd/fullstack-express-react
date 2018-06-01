import { createStore, applyMiddleware } from "redux";
// import logger from "redux-logger";
import reduxThunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

const storeEnhancer = composeWithDevTools(
  // applyMiddleware(logger, promise(), reduxThunk)
  applyMiddleware(promise(), reduxThunk)
);
const store = createStore(rootReducer, storeEnhancer);

export default store;
