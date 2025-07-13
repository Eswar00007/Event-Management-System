import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './signup.js';
import Login from './Login.js';
import Home from './home.js';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setTokenAndStore = (token) => {
    setToken(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setTokenAndStore} />} />
          <Route path="/home" element={token ? <Home token={token} setToken={setTokenAndStore} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/home" />} />
          {/* <Route path="/users" element={<Navigate/>} /> */}


        </Routes>
      </div>
    </Router>
  );
};

export default App;
