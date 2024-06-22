import "./assets/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./assets/css/style.scss";
import ProjectRouter from "./components/router/ProjectRouter";
import PublicRouter from "./components/router/PublicRouter";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.token !== undefined) {
      setAuth(true);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`
    }
  }, []);

  return (
    <Router>
      <Routes>
        {auth ? (
          ProjectRouter.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((childRoute, childIndex) => (
                <Route
                  key={childIndex}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))
        ) : (
          PublicRouter.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((childRoute, childIndex) => (
                <Route
                  key={childIndex}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))
        )}
      </Routes>
    </Router>
  );
}

export default App;