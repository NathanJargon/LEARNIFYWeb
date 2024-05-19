import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import UserHome from './UserHome';
import InstructerHome from './InstructerHome';
import CreateCourse from './CreateCourse';
import Course from './Course';
import CreateActivity from './CreateActivity';
import UserCourse from './UserCourse';

function RedirectToLogin() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/instructor" element={<InstructerHome />} />
        <Route path="/createcourse" element={<CreateCourse />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route path="/createactivity/:courseId" element={<CreateActivity />} />
        <Route path="/usercourse/:courseId" element={<UserCourse />} />
      </Routes>
    </Router>
  );
}

export default App;