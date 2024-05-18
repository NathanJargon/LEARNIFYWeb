import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './InstructerHome.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import bell from './images/bell.png'; 
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate(); 

  const navigateToCreateCourse = () => {
    navigate('/createcourse'); 
  };

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
          <img src={bell} alt="Notifications" className="bell-icon" />
          <img src={profile} alt="Profile" className="profile-icon" />
        </div>
      </div>
      <div className="big-text">
        <h2>Take IT education experience to the next level</h2>
      </div>
      <div className="search-profile-below">
        <img src={profile} alt="Profile" className="profile-icon-below" />
        <div className="search-box-below" onClick={navigateToCreateCourse}>
          <input type="text" placeholder="Create a Course..." readOnly />
        </div>
      </div>
      <div className="courses-title">
        <h3>Courses</h3>
      </div>
    </div>
  );
}

export default Home;