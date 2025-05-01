import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Add Class', path: '/' },
  { text: 'Class List', path: '/class-list' },
  { text: 'Sections', path: '/sections' },
  { text: 'Students', path: '/students' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Smart School</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={() => navigate(item.path)}
              className={`w-full px-6 py-3 text-left flex items-center space-x-2 transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar; 