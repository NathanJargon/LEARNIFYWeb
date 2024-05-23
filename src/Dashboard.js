import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 
import logo from './images/logo.png';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome to <img src={logo} alt="Logo" className="logo" /> Learnify</h1>
      <p>Unlock the limitless IT learning environment</p>
      <button className="login-button" onClick={() => navigate('/login')}>Log in</button>
      <button className="create-account-button" onClick={() => navigate('/register')}>Create Account</button>
    </div>
  );
}

export default Dashboard;