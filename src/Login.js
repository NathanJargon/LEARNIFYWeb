import React, { useState } from 'react';
import './Login.css'; 
import logo from './images/logo.png'; 
import sprinkles from './images/sprinkles.png'; 
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { firebase } from './FirebaseConfig'; // import firebase
import { useNavigate } from 'react-router-dom'; // import useNavigate

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // add password state
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false); // add isInstructor state

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // update password state
  };

  const navigate = useNavigate(); // create navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userRef = firebase.firestore().collection('users').doc(email);
      const doc = await userRef.get();
      if (!doc.exists) {
        alert('No such user!');
      } else {
        if (doc.data().instructor && !isInstructor) {
          alert('Instructors cannot log in here');
          return;
        }
        if (doc.data().password === password && doc.data().instructor === isInstructor) {
          console.log('Logged in successfully');
          // navigate to different pages based on isInstructor
          if (isInstructor) {
            navigate('/instructor');
          } else {
            navigate('/home');
          }
        } else {
          alert('Incorrect password or not an instructor');
        }
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
        <h2><img src={logo} alt="Logo" className="logo" />{isInstructor ? 'Instructor Log in' : 'Log in'}</h2>
          <img src={sprinkles} alt="Sprinkles" className="sprinkles" />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <div className="email-container">
            <input id="email" type="email" value={email} onChange={handleEmailChange} required />
            <i>
              {isValidEmail ? <FaCheck /> : <FaTimes />}
            </i>
          </div>
          <label htmlFor="password">Password</label>
          <div className="password-container">
          <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={handlePasswordChange} required />
            <i onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </i>
          </div>
          <p className="forgot-password">Forgot Password?</p>
          <button type="submit">Log in</button>
          </form>
        <div className="instructor-login">
            <hr />
            <p onClick={() => setIsInstructor(!isInstructor)}>{isInstructor ? 'User Log In' : 'Instructor Log In'}</p>
            <hr />
        </div>
      </div>
    </div>
  );
}

export default Login;