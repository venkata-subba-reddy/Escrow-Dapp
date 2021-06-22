import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import  Feedback  from "./components/feedback/Feedback";
import Login from "./components/login/Login";
import ProjectList from "./components/prjtList/ProjectList";

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Login} />
        <Route path="/project-list" exact component={ProjectList} />
        <Route path="/feedback" exact component={Feedback} />
      </div>
    </Router>
  );
}

export default App;
