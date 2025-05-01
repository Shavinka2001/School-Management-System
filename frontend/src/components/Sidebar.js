import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const mainMenuItems = [
  { text: 'Add Class', path: '/' },
  { text: 'Class List', path: '/class-list' },
  { text: 'Sections', path: '/sections' },
  { text: 'Students', path: '/students' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeClassId, setActiveClassId] = useState(null);
  const [activeClassName, setActiveClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandPolls, setExpandPolls] = useState(false);

  // Check if we're in a polls page
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'class-polls' && pathParts.length >= 3) {
      const classId = pathParts[2];
      setActiveClassId(classId);
      setExpandPolls(true);
      // Fetch class info to display the name
      fetchClassInfo(classId);
    } else {
      setExpandPolls(false);
    }
  }, [location]);

  // Fetch all classes for the polls submenu
  useEffect(() => {
    if (expandPolls) {
      fetchClasses();
    }
  }, [expandPolls]);

  const fetchClassInfo = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/classes/${classId}`);
      setActiveClassName(response.data.subject);
    } catch (error) {
      console.error('Error fetching class info:', error);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const handlePollsToggle = () => {
    setExpandPolls(!expandPolls);
    if (!expandPolls && classes.length === 0) {
      fetchClasses();
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Smart School</h1>
        </div>
        
        <nav className="mt-6">
          {mainMenuItems.map((item) => (
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

          {/* Polls Menu Item with submenu */}
          <div className="mt-4">
            <button
              onClick={handlePollsToggle}
              className={`w-full px-6 py-3 text-left flex items-center justify-between transition-colors duration-200 ${
                location.pathname.includes('/class-polls')
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>Class Polls</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform duration-200 ${expandPolls ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Polls Submenu */}
            {expandPolls && (
              <div className="bg-gray-50 py-2">
                {loading ? (
                  <div className="px-8 py-2 text-sm text-gray-500">Loading...</div>
                ) : classes.length > 0 ? (
                  <>
                    {activeClassId && (
                      <div className="px-8 py-2 mb-2 text-sm font-medium text-blue-600">
                        Current: {activeClassName || 'Class Details'}
                      </div>
                    )}
                    {classes.map((cls) => (
                      <button
                        key={cls._id}
                        onClick={() => navigate(`/class-polls/${cls._id}`)}
                        className={`w-full px-8 py-2 text-left text-sm transition-colors duration-200 ${
                          activeClassId === cls._id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cls.subject} - {cls.teacherName}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-8 py-2 text-sm text-gray-500">No classes found</div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar; 