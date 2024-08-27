import React from "react"
import Page from "./page/Page"
import Login from "./page/Login";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

function App() {
  const login = useSelector((state)=>state.user.loginSuccess);

  return (
    <Router>
      <div className="mainContainer">
        { 
          login ? 
          <Page /> 
          : 
          <Login/>
          // <Routes>
          //   <Route path="/" element={<Login/>} />
          // </Routes>
        }
      </div>
    </Router>

  );
}

export default App;
