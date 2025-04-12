import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import About from './pages/About';
import Assignments from './pages/Assignments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/assignments" element={<Assignments />} />
          <Route path="/student/*" element={<div>Student Dashboard (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 