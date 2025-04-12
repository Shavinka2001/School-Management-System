import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { FaChalkboardTeacher, FaBook, FaUsers, FaCalendarAlt, FaSignOutAlt, FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    completedAssignments: 0
  });

  const fetchTeacherData = useCallback(async () => {
    try {
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) {
        navigate('/login');
        return;
      }

      console.log('Fetching teacher data for ID:', teacherId);
      
      // Fetch teacher details
      const teacherResponse = await axios.get(`http://localhost:5000/api/teachers/${teacherId}`);
      console.log('Teacher data response:', teacherResponse.data);
      
      if (teacherResponse.data) {
        // Process the photo URL
        const teacherData = {
          ...teacherResponse.data,
          photo: teacherResponse.data.photo 
            ? `http://localhost:5000${teacherResponse.data.photo}`
            : null
        };
        setTeacher(teacherData);
        
        // Fetch assignment statistics
        const statsResponse = await axios.get('http://localhost:5000/api/assignments/stats');
        console.log('Assignment stats response:', statsResponse.data);
        
        setStats({
          totalAssignments: statsResponse.data.totalAssignments || 0,
          pendingAssignments: statsResponse.data.pendingReview || 0,
          completedAssignments: statsResponse.data.completed || 0
        });
      } else {
        throw new Error('No teacher data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to load teacher data');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An error occurred while fetching data');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userType = localStorage.getItem('userType');
      const teacherId = localStorage.getItem('teacherId');
      
      if (!isLoggedIn || userType !== 'teacher' || !teacherId) {
        navigate('/login');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      fetchTeacherData();
    }
  }, [fetchTeacherData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('teacherId');
    navigate('/login');
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    fetchTeacherData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="text-gray-500 mb-4">No teacher data available</div>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-primary">
                  {teacher.photo ? (
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 fallback-icon ${teacher.photo ? 'hidden' : ''}`}>
                    <FaChalkboardTeacher size={48} />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {teacher.name}</h1>
                <p className="text-gray-600 text-lg">{teacher.subject} Teacher</p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {teacher.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {teacher.phone}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Assignment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaTasks className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Completed Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/teacher/schedule')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Schedule</h3>
                <p className="text-gray-600">Check your class schedule</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/teacher/Assignments')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBook className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Assignments</h3>
                <p className="text-gray-600">Create and manage assignments</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/teacher/students')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUsers className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Students</h3>
                <p className="text-gray-600">View and manage your students</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 