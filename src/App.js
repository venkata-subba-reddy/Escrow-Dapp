import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import  Feedback  from "./components/feedback/Feedback";
import Login from "./components/login/Login";
import ProjectList from "./components/ProjectList/ProjectList";

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Login} />
        <Route path="/project-list" exact component={ProjectList} />
        <Route path="/feedback/:index" exact component={Feedback} />
      </div>
    </Router>
  );
}

export default App;
