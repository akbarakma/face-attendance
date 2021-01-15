import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddFace from "./pages/AddFace";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <Switch>
          <Route exact path="/addface">
            <AddFace />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
