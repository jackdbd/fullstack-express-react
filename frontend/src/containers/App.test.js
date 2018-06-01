import React from "react";
import { Route } from "react-router";
import { shallow, mount, render } from "enzyme";
import { Provider } from "react-redux";
import { App, AppWithRedux } from "./App";
import { fetchUsers } from "../actions";
import store from "../store";
import "../setupEnzymeTests";

describe("<App /> (not connected to redux)", () => {
  it("should render without crashing", () => {
    const wrapper = shallow(<App fetchUsers={fetchUsers} />);
  });
  it("should be wrapped in a .container", () => {
    const wrapper = mount(<App fetchUsers={fetchUsers} />);
    expect(
      wrapper
        .find("div")
        .first()
        .hasClass("container")
    ).toEqual(true);
  });
  it("should have 4 <Route> components (shallow)", () => {
    const wrapper = shallow(<App fetchUsers={fetchUsers} />);
    expect(wrapper.find(Route)).toHaveLength(4);
  });
  it("should have 1 <Route> when mounted (because of <Switch>)", () => {
    const wrapper = mount(<App fetchUsers={fetchUsers} />);
    expect(wrapper.find(Route)).toHaveLength(1);
  });
  it("should have 1 exact route to / when mounted", () => {
    const wrapper = mount(<App fetchUsers={fetchUsers} />);
    const routeProps = wrapper.find(Route).props();
    expect(routeProps.path).toBe("/");
    expect(routeProps.exact).toBeTruthy();
  });
  it("should have 3 exact routes and 1 catch-all route", () => {
    const wrapper = shallow(<App fetchUsers={fetchUsers} />);
    const routes = wrapper.find(Route).map(r => r.props());
    const exactRoutes = routes.filter(r => r.exact);
    expect(routes.length).toBe(4);
    expect(exactRoutes.length).toBe(3);
    expect(routes.length - exactRoutes.length).toBe(1);
  });
  it("should have routes to the correct paths", () => {
    const wrapper = shallow(<App fetchUsers={fetchUsers} />);
    const routePaths = wrapper.find(Route).map(r => r.props().path);
    expect(routePaths).toContain("/");
    expect(routePaths).toContain("/me");
    expect(routePaths).toContain("/login");
    expect(routePaths).toContain(undefined); // catch-all route
  });
  it("should call componentDidMount once (spy)", () => {
    const componentDidMountSpy = jest.spyOn(App.prototype, "componentDidMount");
    const wrapper = shallow(<App fetchUsers={fetchUsers} />);
    expect(App.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
  });
  it("should call fetchUsers once when mounting (mock)", () => {
    const mockfetchUsers = jest.fn(fetchUsers);
    const wrapper = shallow(<App fetchUsers={mockfetchUsers} />);
    // expect(mockActionCreator.mock.calls.length).toBe(1);
    expect(mockfetchUsers).toHaveBeenCalledTimes(1);
    mockfetchUsers.mockClear();
  });
});

describe("<AppWithRedux /> (connected to redux store)", () => {
  it("should render without crashing", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <AppWithRedux fetchUsers={fetchUsers} />
      </Provider>
    );
  });
});
