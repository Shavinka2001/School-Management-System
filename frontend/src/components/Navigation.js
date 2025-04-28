import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check authentication status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const type = localStorage.getItem('userType');
    setIsLoggedIn(loggedIn);
    setUserType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">Smart School</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-primary ${location.pathname === '/' ? 'text-primary font-semibold' : ''}`}
            >
              Home
            </Link>
            
            {/* Show these links based on authentication and user type */}
            {isLoggedIn && (
              <>
                {userType === 'student' && (
                  <Link 
                    to="/student/dashboard" 
                    className={`text-gray-600 hover:text-primary ${location.pathname.startsWith('/student') ? 'text-primary font-semibold' : ''}`}
                  >
                    Student Dashboard
                  </Link>
                )}
                {userType === 'teacher' && (
                  <Link 
                    to="/teacher/dashboard" 
                    className={`text-gray-600 hover:text-primary ${location.pathname.startsWith('/teacher') ? 'text-primary font-semibold' : ''}`}
                  >
                    Teacher Dashboard
                  </Link>
                )}
                <Link 
                  to="/assignments" 
                  className={`text-gray-600 hover:text-primary ${location.pathname === '/assignments' ? 'text-primary font-semibold' : ''}`}
                >
                  Assignments
                </Link>
              </>
            )}
            
            <Link 
              to="/about" 
              className={`text-gray-600 hover:text-primary ${location.pathname === '/about' ? 'text-primary font-semibold' : ''}`}
            >
              About Us
            </Link>

            {/* Authentication buttons */}
            <div className="flex items-center space-x-2">
              {!isLoggedIn ? (
                <>
                  <Link 
                    to="/login" 
                    className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                      location.pathname === '/login'
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                      location.pathname === '/register'
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 