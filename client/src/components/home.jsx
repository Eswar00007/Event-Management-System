import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = ({ token, setToken }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/home', {
          headers: { Authorization: token }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error(error);
        setToken(null);
        navigate('/login');
      }
    };
    fetchData();
  }, [token, setToken, navigate]);

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <div>
      {token ? (
        <div>
          <h2>Welcome, {username}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Signup</button>
        </div>
      )}
    </div>
  );
};

export default Home;
