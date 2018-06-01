import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppWithRedux } from "./containers/App";
import store from "./store";
import "../node_modules/materialize-css/dist/css/materialize.min.css";

ReactDOM.render(
  <Provider store={store}>
    <AppWithRedux />
  </Provider>,
  document.getElementById("root")
);
