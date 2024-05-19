import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './UserHome.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import html from './images/html.png';
import { firebase } from './FirebaseConfig';

function Home() {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]); // add this line
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('courses').get();
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(coursesData);
        
      setCourses(coursesData); // set all courses
    };

    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigate('/dashboard'); // navigate to the dashboard page
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
          <img src={profile} alt="Profile" className="profile-icon" onClick={() => setDropdownVisible(!isDropdownVisible)} />
          
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}

        </div>
      </div>
      <div className="big-text">
        <h2>Take IT education experience to the next level</h2>
      </div>
      <div className="courses-title">
      <h3>Courses</h3>
        <div className="container">
          <div className="course-grid">
            {courses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="card" style={{ backgroundImage: `url(${html})` }}>
                  <div className="card-body">
                    <h2>{course.userEmail}</h2>
                    <h5 className="card-title">{course.courseName}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <button className="btn btn-primary" onClick={() => navigate(`/usercourse/${course.id}`)}>View Course</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;