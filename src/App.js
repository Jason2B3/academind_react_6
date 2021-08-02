import React, { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";

function App() {
  //% Upon startup, isLoggedIn equals false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //% Change isLoggedIn to true, if local storage's object says so
  const storedLoginStatus = localStorage.getItem("isLoggedIn");
  useEffect(() => {
    if (storedLoginStatus === "true") setIsLoggedIn(true);
  }, [storedLoginStatus]);
  // holding storedLoginStatus gets rid of a non-fatal console error (dw, about this)

  //% Handlers
  const loginHandler = (email, password) => {
    // Should check email and password, but it's just a demo
    setIsLoggedIn(true);
    //$ Save our true login status to LocalStorage
    localStorage.setItem("isLoggedIn", true);
  };
  const logoutHandler = () => {
    setIsLoggedIn(false);
    //$ Save our false login status to LocalStorage
    localStorage.setItem("isLoggedIn", false);
  };
  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}

export default App;
