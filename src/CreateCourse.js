import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './CreateCourse.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

function Home() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

      <form className="course-form">
        <label>
          Course Name:
          <input type="text" name="courseName" />
        </label>
        <label>
          Course Description:
          <textarea name="courseDescription" />
        </label>
        <label>
          Course Objectives:
          <textarea name="courseObjectives" />
        </label>
        <label>
          Course Topics:
          <textarea name="courseTopics" />
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
                </div>
            }
        </div>

        <div className="course-button-container">
            <button type="button" className="course-cancel-button">Cancel</button>
            <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

export default Home;