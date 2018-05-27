import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

const storeEnhancer = composeWithDevTools(applyMiddleware(logger));
const store = createStore(rootReducer, storeEnhancer);

export default store;
