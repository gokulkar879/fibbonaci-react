import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Other from './Other';

function App() {
  return (
    <Router>
      <header>
        <Link to="/">
          Home
        </Link>
        <Link to="/other">
          Other
        </Link>
      </header>
      <Routes>
        <Route path="/other" element={<Other />}/>
        <Route exact path="/" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;
