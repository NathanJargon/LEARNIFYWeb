import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import UserHome from './UserHome';
import InstructerHome from './InstructerHome';
import CreateCourse from './CreateCourse';

function RedirectToLogin() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/login');
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
      </Routes>
    </Router>
  );
}

export default App;