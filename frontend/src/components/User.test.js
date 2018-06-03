import React from "react";
import "../setupEnzymeTests";
import { shallow, mount, render } from "enzyme";
import User from "./User";
import Like from "./Like";

describe("<User />", () => {
  it("renders a <h1> with the correct text", () => {
    const username = "some-username";
    const wrapper = shallow(<User username={username} />);
    expect(wrapper.contains(<h1>{username}</h1>)).toEqual(true);
  });
  it("renders one (and only one) .card", () => {
    const wrapper = shallow(<User />);
    expect(wrapper.find(".card")).toHaveLength(1);
  });
  it("renders one (and only one) <Like>", () => {
    const wrapper = shallow(<User />);
    expect(wrapper.find(Like)).toHaveLength(1);
  });
});
