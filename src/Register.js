import React, { useState } from 'react';
import './Register.css'; 
import logo from './images/logo.png'; 
import sprinkles from './images/sprinkles.png'; 
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { firebase } from './FirebaseConfig'; // import firebase
import { useNavigate } from 'react-router-dom'; // import useNavigate

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false); 

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); 
  };

  const navigate = useNavigate(); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        alert("Signup failed"); 
        return;
      }

      const db = firebase.firestore();

      await db.collection("users").doc(email).set({
        email: email,
        uid: user.uid,
        password: password,
        instructor: isInstructor, 
        notification: [
          {
            imageUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnfAxGV-fZxGL9elM_hQ2tp7skLeSwMyUiwo4lMm1zyA&s",
            text: "Welcome to Learnify!"
          }
        ],
      });

      if (isInstructor) {
        navigate('/instructor'); 
      } else {
        navigate('/home'); 
      }

    } catch (error) {
      alert(error.message); 
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
            <h2><img src={logo} alt="Logo" className="logo" />{isInstructor ? 'Instructor Sign up' : 'Sign up'}</h2>
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
          <button type="submit">Register</button>
        </form>
        <div className="instructor-signup">
            <hr />
            <p onClick={() => setIsInstructor(!isInstructor)}>{isInstructor ? 'User Sign Up' : 'Instructor Sign Up'}</p>
            <hr />
        </div>
      </div>
    </div>
  );
}

export default Register;