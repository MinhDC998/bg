import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Canvas from "./components/canvas";
import WheelOfFortune from "./components/wheelOfFortune/index";

function App() {
  return (
    <div className="App">
      {/* <Canvas /> */}
      <WheelOfFortune />
      <div className="bg" />
    </div>
  );
}

export default App;
