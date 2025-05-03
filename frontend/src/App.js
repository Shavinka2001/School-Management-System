import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import About from './pages/About';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeacherForm from './pages/TeacherForm';
import TeacherList from './pages/TeacherList';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/assignments" element={<Assignments />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Add this route */}
          <Route path="/teacher-form" element={<TeacherForm />} /> {/* Add this route */}
          <Route path="/teacher-list" element={<TeacherList />} /> {/* Add this route */}
        
           
        
        </Routes>
      </div>
    </Router>
  );
}

export default App; 