import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import User from "./User";

describe("User component", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    render(<User />, div);
    unmountComponentAtNode(div);
  });
});
