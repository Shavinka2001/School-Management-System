import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ClassManagement from './pages/ClassManagement';
import ClassList from './pages/ClassList';
import EditClass from './pages/EditClass';
import Sections from './pages/Sections';
import Students from './pages/Students';
import ClassPolls from './pages/ClassPolls';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard routes with sidebar */}
        <Route path="/dashboard" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <Dashboard />
            </main>
          </div>
        } />
        <Route path="/class-management" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <ClassManagement />
            </main>
          </div>
        } />
        <Route path="/class-list" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <ClassList />
            </main>
          </div>
        } />
        <Route path="/edit-class/:id" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <EditClass />
            </main>
          </div>
        } />
        <Route path="/sections" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <Sections />
            </main>
          </div>
        } />
        <Route path="/students" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <Students />
            </main>
          </div>
        } />
        <Route path="/class-polls/:id" element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
              <ClassPolls />
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App; 