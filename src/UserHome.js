import React from 'react';
import './UserHome.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function Home() {
  return (
    <div className="home-container">
      <div className="header-box">
        <div className="logo-title">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Learnify</h1>
        </div>
        <div className="search-profile">
          <div className="search-box">
            <input type="text" placeholder="Search Courses" />
            <FaSearch />
          </div>
          <img src={profile} alt="Profile" className="logo" />
        </div>
      </div>
      <div className="big-text">
        <h2>Take IT education experience to the next level</h2>
      </div>
      <div className="courses-title">
        <h3>Courses</h3>
      </div>
    </div>
  );
}

export default Home;