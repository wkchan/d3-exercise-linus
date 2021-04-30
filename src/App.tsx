import React from 'react';
import logo from './logo.svg';
import './App.css';

import SeaSurfaceWaveHeight from "./components/SeaSurfaceWaveHeight";

function App() {
  return (
    <div className="App">
      <SeaSurfaceWaveHeight width={1500} left={50} right={50} height={800} top={50} bottom={50} fill="tomato" />
    </div>
  );
}

export default App;
