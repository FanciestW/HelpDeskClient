import React from 'react';
import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Navbar from '../Navbar/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Dashboard></Dashboard>
    </div>
  );
};

export default App;
