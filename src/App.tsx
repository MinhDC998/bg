import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Canvas from "./components/canvas";

function App() {
  return (
    <div className="App">
      <Canvas />
      <div className="bg" />
    </div>
  );
}

export default App;
