import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { firebase } from './FirebaseConfig';
import 'firebase/firestore';
import './InstructerHome.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import html from './images/html.png';
import bell from './images/bell.png'; 
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]); // add this line
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [progress, setProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivityResult = async () => {
      const db = firebase.firestore();
      const user = firebase.auth().currentUser;
  
      if (!user) {
        return;
      }
  
      const snapshot = await db.collection('activities').get();
      const activityResults = snapshot.docs.flatMap(doc => doc.data().ActivityResult);
  
      // Log the activityResults to the console
      console.log('Activity results:', activityResults);
  
      const courseActivityResults = courses.reduce((acc, course) => {
        acc[course.id] = activityResults.filter(ar => ar && ar.userEmail === user.email && ar.courseId === course.id);
        return acc;
      }, {});
  
      // Log the courseActivityResults to the console
      console.log('Course activity results:', courseActivityResults);
  
      const promises = Object.entries(courseActivityResults).map(async ([courseId, activityResults]) => {
        const completedActivities = activityResults.filter(ar => ar.score !== undefined).length;
        const totalActivities = activityResults.length;
  
        // Log the completedActivities and totalActivities to the console
        console.log(`Completed activities for course ${courseId}:`, completedActivities);
        console.log(`Total activities for course ${courseId}:`, totalActivities);
  
        return {
          courseId,
          progress: (completedActivities / totalActivities) * 100
        };
      });
  
      const results = await Promise.all(promises);
  
      const newProgress = results.reduce((acc, { courseId, progress }) => {
        acc[courseId] = progress;
        return acc;
      }, {});
  
      setProgress(newProgress);
    };
  
    if (courses.length > 0 && firebase.auth().currentUser) {
      fetchActivityResult();
    }
  }, [courses, firebase.auth().currentUser]);

  useEffect(() => {
    const fetchCourses = async (currentUser) => {
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
  
    const unsubscribe = firebase.auth().onAuthStateChanged(fetchCourses);
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  const navigateToCreateCourse = () => {
    navigate('/createcourse'); 
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigate('/dashboard'); // navigate to the dashboard page
  };

  
  return (
    <div className="home-container">
      <div className="header-box">
        <div className="instructor-logo-title" onClick={() => navigate('/instructor')}>
          <img src={logo} alt="Logo" className="logo" />
          <h1>Learnify</h1>
        </div>
        <div className="search-profile">
          <div className="search-box">
          <input type="text" placeholder="Search Courses" onChange={e => setSearchTerm(e.target.value)} />
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
      <div className="search-profile-below">
        <img src={profile} alt="Profile" className="profile-icon-below" />
        <div className="search-box-below" onClick={navigateToCreateCourse}>
          <input type="text" placeholder="Create a Course..." readOnly />
        </div>
      </div>
      <div className="courses-title">
      <h3>Your Courses</h3>
        <div className="container">
        <div className="course-grid">
        {courses.filter(course => course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())).map((course) => (
            <div className="course-card" key={course.id}>
              <div className="card" style={{ backgroundImage: `url(${html})` }}>
                <div className="card-body">
                  <h2>{firebase.auth().currentUser.email}</h2>
                  <h5 className="card-title">{course.courseName}</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{ width: `${progress[course.id] || 0}%` }} aria-valuenow={progress[course.id] || 0} aria-valuemin="0" aria-valuemax="100"></div>
                      <span className="progress-percentage">Progress: {Math.round(progress[course.id] || 0)}%</span>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate(`/course/${course.id}`)}>View Course</button>
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