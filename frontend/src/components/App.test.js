import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "../store";

describe("App component", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      div
    );
    unmountComponentAtNode(div);
  });
});
