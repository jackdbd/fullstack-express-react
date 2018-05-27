import React, { Component } from "react";
import Header from "./Header";
import UserList from "../containers/UserList";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <UserList />
      </div>
    );
  }
}

export default App;
