import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { firebase } from './FirebaseConfig';
import 'firebase/firestore';
import './InstructerHome.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import bell from './images/bell.png'; 
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]); // add this line

  useEffect(() => {
    const fetchCourses = async () => {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        return;
      }

      const db = firebase.firestore();
      const snapshot = await db.collection('courses').get();
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(coursesData);
      
      const userCourses = coursesData.filter(course => course.userId === currentUser.uid);
      setCourses(userCourses);
    };

    fetchCourses();
  }, []);


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

    </div>
  );
}

export default Home;