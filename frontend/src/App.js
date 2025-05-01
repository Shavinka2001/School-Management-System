import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ClassManagement from './pages/ClassManagement';
import ClassList from './pages/ClassList';
import EditClass from './pages/EditClass';
import Sections from './pages/Sections';
import Students from './pages/Students';
import ClassPolls from './pages/ClassPolls';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          <Routes>
            <Route path="/" element={<ClassManagement />} />
            <Route path="/class-list" element={<ClassList />} />
            <Route path="/edit-class/:id" element={<EditClass />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/students" element={<Students />} />
            <Route path="/class-polls/:id" element={<ClassPolls />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 