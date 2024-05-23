import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './CreateActivity.css'; 
import logo from './images/logo.png'; 
import profile from './images/profile.png';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { firebase } from './FirebaseConfig';
import { useNavigate } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';

function CreateActivity() {
  const { courseId } = useParams(); 
  const [activityName, setActivityName] = useState('');
  const [activityNumber, setActivityNumber] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');
  const [questions, setQuestions] = useState([{ question: '', choices: ['', '', '', ''], correctAnswer: '' }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    if (user) {
      const docId = `${activityName.replace(/\s/g, '')}-${user.uid}`; 
    
      await db.collection('activities').doc(docId).set({
        id: docId,
        activityName,
        activityNumber,
        activityDescription,
        numberOfItems,
        questions,
        userEmail: user.email,
        userId: user.uid,
        courseId: courseId,
      });
    
      navigate('/instructor');
    } else {
      // Handle the case where no user is signed in.
      console.error('No user is currently signed in.');
    }
  };

  const handleQuestionChange = (event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (choiceIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].choices[choiceIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].correctAnswer = event.target.value;
    setQuestions(newQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < numberOfItems - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate(`/course/${courseId}`); // navigate back to the previous page
    }
  };

  useEffect(() => {
    const numItems = parseInt(numberOfItems);
    if (Number.isInteger(numItems) && numItems > 0) {
      if (numItems > questions.length) {
        setQuestions(oldQuestions => [
          ...oldQuestions,
          ...new Array(numItems - oldQuestions.length).fill({ question: '', choices: ['', '', '', ''], correctAnswer: '' })
        ]);
      }
    }
  }, [numberOfItems]);

  return (
    <div className="create-activity-container">
        <div className="header-box">
          <div className="logo-title">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Learnify</h1>
          </div>
        </div>

      <div className="create-activity-title">
        <h1>Create Activity</h1>
      </div>

      <form className="create-activity-form" onSubmit={handleSubmit}>
        <label>
          Activity Name:
          <input type="text" value={activityName} onChange={e => setActivityName(e.target.value)} />
        </label>
        <label>
          Activity #:
          <input type="text" value={activityNumber} onChange={e => setActivityNumber(e.target.value)} />
        </label>
        <label>
          Activity Description:
          <textarea value={activityDescription} onChange={e => setActivityDescription(e.target.value)} />
        </label>
        <label>
          Number of Items:
          <input type="number" value={numberOfItems} onChange={e => setNumberOfItems(e.target.value)} />
        </label>

        {questions.slice(currentQuestionIndex, currentQuestionIndex + 1).map((question, questionIndex) => (
          <div key={questionIndex}>
            <label>
              Question {currentQuestionIndex + 1}:
              <input type="text" value={question.question} onChange={e => handleQuestionChange(e)} />
            </label>

            {question.choices.map((choice, choiceIndex) => (
              <label key={choiceIndex}>
                Choice {choiceIndex + 1}:
                <input type="text" value={choice} onChange={e => handleChoiceChange(choiceIndex, e)} />
              </label>
            ))}

            <label>
              Correct Answer:
              <select value={question.correctAnswer} onChange={e => handleCorrectAnswerChange(e)}>
                {question.choices.map((choice, index) => (
                  <option key={index} value={index + 1}>
                    Choice {index + 1}
                  </option>
                ))}
              </select>
            </label>

          </div>
        ))}

      <div className="create-activity-button-container">
        <button type="button" className="cancel-button" onClick={handlePrevious}>
          {currentQuestionIndex > 0 ? 'Previous' : 'Cancel'}
        </button>
          {currentQuestionIndex < numberOfItems - 1 ? (
            <button type="button" className="next-button" onClick={handleNext}>Next</button>
          ) : (
            <input type="submit" value="Submit" className="submit-button" />
          )}
      </div>

      </form>
    </div>
  );
}

export default CreateActivity;