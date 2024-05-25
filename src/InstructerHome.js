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
      
      const promises = courses.map(async (course) => {
        const snapshotActivities = await db.collection('activities')
          .where('courseId', '==', course.id)
          .get();

        const activities = snapshotActivities.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const totalActivities = activities.length;

        const completedActivities = activities.reduce((count, activity) => {
          const isCompleted = activity.ActivityResult && activity.ActivityResult.some(result => result.userEmail === user.email);
          return isCompleted ? count + 1 : count;
        }, 0);

        console.log(`Total and completed activities for course ${course.id}:`, totalActivities, completedActivities);

        return {
          courseId: course.id,
          totalActivities,
          completedActivities,
          activityIds: activities.map(activity => activity.id) // Extract the document IDs
        };
      });

      const results = await Promise.all(promises);

      const newActivityResults = results.reduce((acc, { courseId, totalActivities, completedActivities }) => {
        const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
        acc[courseId] = {
          totalActivities,
          completedActivities,
          progressPercentage
        };
        return acc;
      }, {});
  
      console.log(`Total and completed activities and progress percentages for all courses:`, newActivityResults);
      setProgress(newActivityResults); // Update the progress state
    };

    if (courses.length > 0) {
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
                      <div className="progress-bar" role="progressbar" style={{ width: `${progress[course.id]?.progressPercentage || 0}%` }} aria-valuenow={progress[course.id]?.progressPercentage || 0} aria-valuemin="0" aria-valuemax="100"></div>
                      <span className="progress-percentage">Progress: {Math.round(progress[course.id]?.progressPercentage || 0)}%</span>
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