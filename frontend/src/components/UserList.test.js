import React from "react";
import "../setupEnzymeTests";
import { shallow, mount, render } from "enzyme";
import UserList from "./UserList";
import Spinner from "react-spinkit";
import User from "./User";

describe("<UserList />", () => {
  it("renders a particular <Spinner> when loading data", () => {
    const wrapper = shallow(<UserList isLoadingData={true} />);
    const spinner = <Spinner name="pacman" color="#ffff00" />;
    expect(wrapper.contains(spinner)).toEqual(true);
  });
  it("renders no <Spinner> and no <User> when it's not loading and there are no users", () => {
    const wrapper = shallow(<UserList isLoadingData={false} />);
    const child = (
      <ul>
        <li>No users are using this app</li>
      </ul>
    );
    expect(wrapper.contains(child)).toEqual(true);
    expect(wrapper.contains(<User />)).toEqual(false);
  });
  it("renders a <User> for each user", () => {
    const wrapper = shallow(<UserList users={[{}, {}, {}]} />);
    expect(wrapper.find(User)).toHaveLength(3);
  });
});
