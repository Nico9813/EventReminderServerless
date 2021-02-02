import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { NavBar } from "./components/navBar";
import CreateEvento from "./pages/createEvento";
import Eventos from "./pages/eventos";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/create">
            <NavBar>
              <CreateEvento></CreateEvento>
            </NavBar>
          </Route>
          <Route path="/">
            <NavBar>
              <Eventos></Eventos>
            </NavBar>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
