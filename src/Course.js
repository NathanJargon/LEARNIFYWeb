import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { firebase } from './FirebaseConfig';
import 'firebase/firestore';
import './Course.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import cardBackground from './images/html.png';
import bell from './images/bell.png'; 
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';

function CourseContent() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // get the course id from the URL
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [isStudentsVisible, setStudentsVisible] = useState(false);
  const [dropdownCardVisible, setDropdownCardVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDelete = async (index, type) => {
    const db = firebase.firestore();
  
    if (type === 'learningMaterial') {
      const newLearningMaterials = course.learningMaterials.filter((_, i) => i !== index);
      await db.collection('courses').doc(courseId).update({
        learningMaterials: newLearningMaterials,
      });
      setCourse((prevCourse) => ({ ...prevCourse, learningMaterials: newLearningMaterials }));
    } else if (type === 'activity') {
      if (activities[index]) {
        const activityId = activities[index].id;
        await db.collection('activities').doc(activityId).delete();
        setActivities((prevActivities) => prevActivities.filter((_, i) => i !== index));
      } else {
        console.error(`No activity found at index ${index}`);
      }
    }
  
    setDropdownVisible(null); // close the dropdown
  };

  const handleEdit = (index, type) => {
    if (type === 'learningMaterial') {
      // Navigate to the edit page for the learning material at the given index
      navigate(`/editLearningMaterial/${course.learningMaterials[index].id}`);
    } else if (type === 'activity') {
      // Navigate to the edit page for the activity at the given index
      navigate(`/editActivity/${courseId}/${activities[index].id}`);
    }
  };

  useEffect(() => {
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
      const activitiesData = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(activitiesData);
      setActivities(activitiesData);

      // Fetch students
      const studentsSnapshot = await db.collection('users').where('instructor', '==', false).get();
      const studentsData = studentsSnapshot.docs.map(doc => doc.data());
      console.log(studentsData);
      setStudents(studentsData);
    };

    fetchCourseAndActivities();
  }, [courseId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const commentText = event.target.elements[0].value;
    const db = firebase.firestore();

    const newComment = {
      text: commentText,
      date: new Date(),
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

  const handleFileChange = (event) => {
    if (event.target.files[0] && event.target.files[0].type === 'application/pdf') {
      setSelectedFile(event.target.files[0]);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
  if (selectedFile) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(selectedFile.name);
    await fileRef.put(selectedFile);
    const fileUrl = await fileRef.getDownloadURL();

    const db = firebase.firestore();
    await db.collection('courses').doc(courseId).update({
      learningMaterials: firebase.firestore.FieldValue.arrayUnion(fileUrl),
    });

    setCourse((prevCourse) => ({
      ...prevCourse,
      learningMaterials: [...prevCourse.learningMaterials, fileUrl],
    }));

    setSelectedFile(null);
  }
};


  return (
    <div className="content-container">
      <div className="header-box">
          <div className="logo-title" onClick={() => navigate('/instructor')}>
            <img src={logo} alt="Logo" className="logo" />
            <h1>Learnify</h1>
          </div>
        <div className="search-profile">
          <div className="search-box">
            <input type="text" placeholder="Search Courses" />
            <FaSearch />
          </div>
          <img src={bell} alt="Notifications" className="bell-icon" />
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

      <div className="content-students">
        <h3 className="clickable-header" onClick={() => setStudentsVisible(!isStudentsVisible)}>Students Enrolled</h3>
        {isStudentsVisible && (
          <div className="students-card">
            {students.map((student, index) => (
              <div className="content-student" key={index}>
                <p>{student.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
        
        <div className="content-learningtitle">
        <h3>Learning Materials</h3>
        <input 
          type="file" 
          onChange={handleFileChange} 
          style={{
            display: 'none',
            cursor: 'pointer',
          }}
          id="upload-button"
        />
        <label htmlFor="upload-button" style={{
          padding: '10px',
          color: 'white',
          backgroundColor: '#007BFF',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}>
          Select File
        </label>
        <button 
          onClick={handleUpload} 
          style={{
            marginBottom: '30px',
            padding: '10px',
            marginLeft: '10px',
            color: 'white',
            backgroundColor: '#28a745',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
          <div className="content-learningcontainer">
            <div className="content-course-grid">
            {course && course.learningMaterials.map((material, index) => (
                <div className="content-course-card" key={index} style={{ position: 'relative' }}>
              <FaEllipsisV 
                className="dropdown-icon" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setDropdownCardVisible(dropdownCardVisible === index ? false : index); 
                }} 
                style={{ position: 'absolute', top: '10px', right: '100px' }} 
              />
                  {dropdownCardVisible === index && (
                    <div className="dropdown-menu-card" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleDelete(index, 'learningMaterial')}>Delete</button>
                    </div>
                  )}
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
        
      <div className="content-activitytitle">
        <h3>Activities <span className="add-activity" onClick={() => navigate(`/createactivity/${courseId}`)}>Add Activity</span></h3>
        <div className="content-activitycontainer">
        <div className="content-course-grid">
        {activities.map((activity, index) => (
            <div 
              className="content-course-card" 
              key={index} 
              onClick={() => navigate(`/activity/${courseId}/${activity.id}`)}
              style={{ position: 'relative' }}
            >
              <FaEllipsisV 
                className="dropdown-icon" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setDropdownCardVisible(dropdownCardVisible === index ? false : index); 
                }} 
                style={{ position: 'absolute', top: '10px', right: '100px' }} 
              />

                {dropdownCardVisible === index && (
                  <div className="dropdown-menu-card" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEdit(index, 'activity')}>Edit</button>
                    <button onClick={() => handleDelete(index, 'activity')}>Delete</button>
                  </div>
                )}

              <div className="content-card" style={{ backgroundImage: `url(${activity.image})` }}>
                <div className="content-card-body">
                  <img src={cardBackground} alt="Activity Logo" /> 
                  <h5 className="content-card-title">{`Activity ${index + 1}`}</h5>
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
          <button type="submit">Post Comment</button>
        </form>
          <div className="content-forumcomments">
            {comments.slice().reverse().map((comment, index) => (
              <div className="content-comment" key={index}>
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