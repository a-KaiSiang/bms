import React from "react"
import Page from "./page/Page"

import './App.css';

function App() {
  const container = {
    boxSizing: 'border-box',
    width: '100vw',
    height : '100vh',
    backgroundColor : 'skyblue',
  }

  return (
    <div style={container}>
      <Page />
    </div>
  );
}

export default App;
