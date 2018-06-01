import React from "react";
import "../setupEnzymeTests";
import { shallow, mount, render } from "enzyme";
import Like from "./Like";

describe("<Like />", () => {
  it("renders some text that shows the number of likes", () => {
    // we need to mount here (shallow won't work)
    const wrapper = mount(<Like numLikes={123} />);
    expect(wrapper.props().numLikes).toEqual(123);
    expect(wrapper.text()).toContain("Likes: 123");
  });
  it("renders one (and only one) icon", () => {
    const wrapper = shallow(<Like />);
    expect(wrapper.find("i")).toHaveLength(1);
  });
  it("renders an icon from Materialize CSS", () => {
    const wrapper = shallow(<Like />);
    expect(wrapper.find("i").hasClass("material-icons right")).toEqual(true);
  });
  it("renders the correct icon when liked", () => {
    const wrapper = shallow(<Like isLiked={true} />);
    expect(wrapper.find("i").text()).toEqual("favorite");
  });
  it("renders the correct icon when not liked", () => {
    const wrapper = shallow(<Like isLiked={false} />);
    expect(wrapper.find("i").text()).toEqual("favorite_border");
  });
});
