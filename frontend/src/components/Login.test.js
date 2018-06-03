import React from "react";
import "../setupEnzymeTests";
import { shallow, mount, render } from "enzyme";
import Login from "./Login";

describe("<Login />", () => {
  it("renders a <h1> with the correct text", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.contains(<h1>Login</h1>)).toEqual(true);
  });
  it("renders one (and only one) <button>", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find("button")).toHaveLength(1);
  });
});
