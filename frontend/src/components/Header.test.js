import React from "react";
import { MemoryRouter, Link } from "react-router";
import "../setupEnzymeTests";
import { shallow, mount, render } from "enzyme";
import Header from "./Header";

describe("<Header />", () => {
  it("renders one <nav>", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(wrapper.find("nav")).toHaveLength(1);
  });
  it("has the correct class", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(
      wrapper
        .find("nav")
        .children()
        .first()
        .hasClass("nav-wrapper")
    ).toEqual(true);
  });
  it("renders three <li>", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(wrapper.find("li")).toHaveLength(3);
  });
  it("renders three <Link>", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(wrapper.find("Link")).toHaveLength(3);
  });
  it("renders four <a>", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(wrapper.find("a")).toHaveLength(4);
  });
  it("contains 3 internal links and 1 external link)", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const regex = /(http(s?))\:\/\//;
    const links = wrapper.find("a").map(a => a.props().href);
    const externals = links.filter(href => regex.test(href));
    expect(externals.length).toBe(1);
    expect(links.length - externals.length).toBe(3);
  });
  it("renders the correct text", () => {
    const wrapper = mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(wrapper.text()).toContain("Me");
    expect(wrapper.text()).toContain("Login");
    expect(wrapper.text()).toContain("Code");
  });
});
