import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const mainMenuItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Add Class', path: '/class-management' },
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
  const [user, setUser] = useState(null);
  
  // Get user data from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto flex flex-col">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Smart School</h1>
        </div>
        
        {user && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-medium text-blue-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="mt-6 flex-1">
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
              {item.text === 'Dashboard' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
              {item.text === 'Add Class' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              {item.text === 'Class List' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
              {item.text === 'Sections' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              )}
              {item.text === 'Students' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
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
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Class Polls</span>
              </div>
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
        
        <div className="mt-auto border-t">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 text-left flex items-center space-x-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar; 