import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { firebase } from './FirebaseConfig';
import 'firebase/firestore';
import './Course.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import cardBackground from './images/html.png';
import bell from './images/bell.png'; 
import { FaSearch, FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function CourseContent() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // get the course id from the URL
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userScores, setUserScores] = useState({});

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set the user to the currentUser state
        setCurrentUser(user);
      } else {
        // No user is signed in
        setCurrentUser(null);
      }

      console.log("User:", user.email);
    });
  }, []);


  useEffect(() => {
    if (currentUser) {
      const db = firebase.firestore(); // define db here

      const fetchCourseAndActivities = async () => {
        console.log('Fetching course with id:', courseId);
          
        const doc = await db.collection('courses').doc(courseId).get();
          
        if (doc.exists) {
          const courseData = doc.data();
          setCourse(courseData); // set the course state
          setComments(courseData.comments || []); // set the comments state
        } else {
          console.error('No course found with this id!');
        }

        // Fetch activities
        const activitiesSnapshot = await db.collection('activities').where('courseId', '==', courseId).get();
        const activitiesData = activitiesSnapshot.docs.map(doc => doc.data());

        // Fetch the user's scores
        const userScores = {};
        for (const activity of activitiesData) {
          if (currentUser) {
            if (activity.ActivityResult) {
              const userResult = activity.ActivityResult.find(result => result.userEmail === currentUser.email);
              if (userResult) {
                userScores[activity.id] = {
                  score: userResult.score,
                  totalItems: activity.numberOfItems
                };
              }
            }
          }
        }
  

        console.log('User Scores:', JSON.stringify(userScores, null, 2));

        setActivities(activitiesData);
        setUserScores(userScores);
      };

      fetchCourseAndActivities();
    }
  }, [courseId, currentUser]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const commentText = event.target.elements[0].value;
    const db = firebase.firestore();

    // Don't proceed if commentText is empty
    if (!commentText.trim()) {
      return;
    }

    const newComment = {
      text: commentText,
      date: new Date(),
      userEmail: currentUser ? currentUser.email : 'Anonymous', // add the user's email to the comment
    };

    setComments((prevComments) => [...prevComments, newComment]);

    await db.collection('courses').doc(courseId).update({
      comments: firebase.firestore.FieldValue.arrayUnion(newComment),
    });

    event.target.reset();
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigate('/dashboard'); // navigate to the dashboard page
  };


  return (
    <div className="content-container">
      <div className="header-box">
          <div className="logo-title" onClick={() => navigate('/home')}>
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

      <div className="content-profile-info">
        <img src={profile} alt="Profile" className="content-profile-icon" />
        <span>{course ? course.userEmail : 'Loading...'}</span>
      </div>
      <div className="content-info">
        <h2 className="course-title">{course ? course.courseName : 'Loading...'}</h2>
        <p className="course-description">{course ? course.courseDescription : 'Loading...'}</p>
      </div>

      <div className="content-objectives">
        <h3>Course Objectives</h3>
        <p>{course ? course.courseObjectives : 'Loading...'}</p>
      </div>

      <div className="content-topics">
        <h3>Course Topics</h3>
        <p>{course ? course.courseTopics : 'Loading...'}</p>
      </div>
        
      {course && course.learningMaterials && course.learningMaterials.length > 0 && (
        <div className="content-learningtitle">
          <h3>Learning Materials</h3>
          <div className="content-learningcontainer">
            <div className="content-course-grid">
              {course.learningMaterials.map((material, index) => (
                <div className="content-course-card" key={index}>
                  <a href={material} download>
                    <div className="content-card" style={{ backgroundImage: `url(${material})` }}>
                      <div className="content-card-body">
                        <img src={cardBackground} alt="HTML Logo" /> 
                        <h5 className="content-card-title">{`Learning Material ${index + 1}`}</h5>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        
      <div className="content-activitytitle">
      <h3>Activities</h3>
        <div className="content-activitycontainer">
        <div className="content-course-grid">
        {activities.map((activity, index) => (
          <div 
          className="content-course-card" 
            key={index} 
            onClick={() => navigate(`/activity/${courseId}/${activity.id}`)}
          >
            <div className="content-card" style={{ backgroundImage: `url(${activity.image})` }}>
              <div className="content-card-body">
                <img src={cardBackground} alt="Activity Logo" /> 
                <h5 className="content-card-title">
                  {`Activity ${index + 1}`}
                </h5>
                {userScores[activity.id] !== undefined && 
                  <div className="score-container">
                    <h3>{`Score: ${userScores[activity.id].score}/${userScores[activity.id].totalItems}`}</h3>
                  </div>
                }
              </div>
            </div>
          </div>
          ))}
          </div>
          </div>
      </div>

      <div className="content-forumtitle">
        <h3>Forum</h3>
        <div className="content-forumcontainer">
        <form className="content-forumform" onSubmit={handleCommentSubmit}>
          <textarea placeholder="Write a comment..." required />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </form>
          <div className="content-forumcomments">
          {comments.slice().reverse().map((comment, index) => (
            <div className="content-comment" key={index}>
              <p>{comment.userEmail || "Anonymous"}</p>
              <p>{comment.text}</p>
              <p>{comment.date && comment.date.toDate ? comment.date.toDate().toLocaleString() : new Date(comment.date).toLocaleString()}</p>
            </div>
          ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default CourseContent;