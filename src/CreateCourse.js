import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './CreateCourse.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { firebase } from './FirebaseConfig';
import { useNavigate } from 'react-router-dom'; 

function Home() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseObjectives, setCourseObjectives] = useState('');
  const [courseTopics, setCourseTopics] = useState('');
  const [courseImage, setCourseImage] = useState(null); // add this line
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    const docId = `${courseName}-${user.uid}`; 

    // upload the course image to Firebase Storage
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(courseImage.name);
    await fileRef.put(courseImage);
    const fileUrl = await fileRef.getDownloadURL();

    await db.collection('courses').doc(docId).set({
      courseName,
      courseDescription,
      courseObjectives,
      courseTopics,
      courseImage: fileUrl, 
      userEmail: user.email,
      userId: user.uid,
    });

    navigate('/instructor');
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]);
  };

  const [numFiles, setNumFiles] = useState(0); // add this line

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Do something with the files
    if (fileRejections.length > 0) {
      alert('Only PDF files are accepted.');
    } else {
      setNumFiles(prevNumFiles => prevNumFiles + acceptedFiles.length); // add this line
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: 'application/pdf' // only accept PDF files
  });

  return (
    <div className="course-container">
      <div className="header-box">
        <div className="logo-title">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Learnify</h1>
        </div>
      </div>

      <div className="courses-title">
        <h3>Create Course</h3>
      </div>

        <form className="course-form" onSubmit={handleSubmit}>
        <label>
          Course Name:
          <input type="text" name="courseName" value={courseName} onChange={e => setCourseName(e.target.value)} />
        </label>
        <label>
          Course Description:
          <textarea name="courseDescription" value={courseDescription} onChange={e => setCourseDescription(e.target.value)} />
        </label>
        <label>
          Course Objectives:
          <textarea name="courseObjectives" value={courseObjectives} onChange={e => setCourseObjectives(e.target.value)} />
        </label>
        <label>
          Course Topics:
          <textarea name="courseTopics" value={courseTopics} onChange={e => setCourseTopics(e.target.value)} />
        </label>
        <label>
          Course Image:
          <input type="file" onChange={handleImageChange} />
        </label>

        <div className="upload-title">
            <h3>Uploaded Learning Materials</h3>
        </div>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {
            isDragActive ?
            <p>Drop the files here ...</p> :
            <div>
              <p>Drag 'n' drop some files here,</p>
              <p>or browse</p>
              <p>{numFiles} file(s) uploaded</p>
            </div>
          }
        </div>

        <div className="course-button-container">
            <button type="button" className="course-cancel-button" onClick={() => navigate('/instructor')}>Cancel</button>
            <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

export default Home;