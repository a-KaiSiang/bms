import React from "react"
import Page from "./page/Page"
import Login from "./page/Login";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearLoginState } from "./app/userSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import { current } from "@reduxjs/toolkit";

function App() {
  const login = useSelector((state)=>state.user.loginSuccess);
  const dispatch = useDispatch();
  const [loginSession, setLoginSession] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const sessionTimeout = 18000000;
  // const sessionTimeout = 300000;

  useEffect(()=>{
    //check session timespan, clear login session if timespan exceed 30 minutes
    const loginTimestamp = sessionStorage.getItem('ts');

    if(loginTimestamp){
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTimestamp);
      console.log(timeElapsed);
      if(timeElapsed >= sessionTimeout){
        dispatch(clearLoginState());
        setLoginSession(false);
        sessionStorage.removeItem("loginSuccess");
        sessionStorage.removeItem("u");
        sessionStorage.removeItem("t");
        sessionStorage.removeItem("ts");
        setLoading(false);
        return;
      }
    }
    //
    const loginStatus = sessionStorage.getItem("loginSuccess");
    if(loginStatus){
      setLoginSession(true);
    }
    setLoading(false);
  },[])

  if (loading) {
    // Show nothing or a loading spinner while checking the session storage
    return null;
  }

  return (
    <Router>
      <div className="mainContainer">
        { 
          (loginSession || login) ? 
          <Page loginSession={loginSession} setLoginSession={setLoginSession}/> 
          : 
          <Login/>
        }
      </div>
    </Router>

  );
}

export default App;
