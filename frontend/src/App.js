import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeachers from './pages/AdminTeachers';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import Assignments from './pages/Assignments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/Assignments" element={<Assignments />} />
          <Route path="/student/*" element={<div>Student Dashboard (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 