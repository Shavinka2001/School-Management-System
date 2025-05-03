import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  
  // For charts
  const [attendanceData, setAttendanceData] = useState([85, 76, 92, 88, 79, 95, 81]);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  
  // Activity stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    totalClasses: 0,
    upcomingEvents: 0
  });

  // Attempt to fetch real stats and class data on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/classes`);
      const classData = response.data;
      setClasses(classData);

      // Process class data to update stats and charts
      updateStatsFromClasses(classData);
      updateChartsFromClasses(classData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching class data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  // Update statistics based on class data
  const updateStatsFromClasses = (classData) => {
    const totalStudents = classData.reduce((sum, cls) => sum + (cls.numberOfStudents || 0), 0);
    const activeClasses = classData.filter(cls => cls.isActive).length;

    setStats({
      totalStudents,
      activeClasses,
      totalClasses: classData.length,
      upcomingEvents: Math.floor(Math.random() * 10) + 1 // Random for demo
    });
  };

  // Update chart data based on class data
  const updateChartsFromClasses = (classData) => {
    // Update subject performance based on actual classes
    const subjects = classData.map(cls => ({
      subject: cls.subject,
      score: cls.numberOfStudents || Math.floor(Math.random() * 30) + 60 // Use student numbers or random score for demo
    }));

    // Limit to top 5 subjects if there are more
    const topSubjects = subjects.slice(0, 5);
    setSubjectPerformance(topSubjects);
  };

  // Prepare Chart.js data for attendance
  const attendanceChartData = {
    labels: days,
    datasets: [
      {
        label: 'Attendance %',
        data: attendanceData,
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
      },
    ],
  };

  // Chart.js options for attendance
  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Attendance: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Calculate subject chart data
  const subjectChartData = {
    labels: subjectPerformance.map(item => item.subject),
    datasets: [
      {
        data: subjectPerformance.map(item => item.score),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options for subject performance
  const subjectChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    }
  };
  
  // Recent notifications - generate from class data if possible
  const generateNotifications = () => {
    if (!classes.length) return [];
    
    const notifications = [];
    // Use actual class names for notifications
    if (classes.length > 0) {
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      notifications.push({ 
        id: 1, 
        message: `New student enrolled in ${randomClass.subject} class`, 
        time: '2 hours ago' 
      });
    }
    
    notifications.push(
      { id: 2, message: 'Upcoming staff meeting on Friday', time: '5 hours ago' },
      { id: 3, message: 'Grade reports due next week', time: '1 day ago' },
      { id: 4, message: 'Parent-teacher conference scheduled', time: '2 days ago' }
    );
    
    return notifications;
  };
  
  // Activity stats items
  const activityStats = [
    { name: 'Total Students', count: stats.totalStudents, icon: '👨‍🎓', color: 'bg-blue-100 text-blue-800' },
    { name: 'Active Classes', count: stats.activeClasses, icon: '📚', color: 'bg-green-100 text-green-800' },
    { name: 'Total Classes', count: stats.totalClasses, icon: '👨‍🏫', color: 'bg-purple-100 text-purple-800' },
    { name: 'Upcoming Events', count: stats.upcomingEvents, icon: '📅', color: 'bg-yellow-100 text-yellow-800' },
  ];

  if (error) {
    return (
      <div className="py-6 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Dashboard Header */}
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">School Dashboard</h1>
        <p className="text-gray-600">Welcome to the Smart School Management System</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
        {activityStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-5 border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded my-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-800">{stat.count}</h3>
                )}
              </div>
              <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Section */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Class Overview</h2>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No classes found. Add your first class to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.slice(0, 5).map((cls, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.teacherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.section || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.numberOfStudents}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cls.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 px-4">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Attendance</h2>
          <div className="h-64">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Bar data={attendanceChartData} options={attendanceChartOptions} />
            )}
          </div>
        </div>

        {/* Subject Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Class Distribution</h2>
          <div className="h-64">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : subjectPerformance.length > 0 ? (
              <Pie data={subjectChartData} options={subjectChartOptions} />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500">No class data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Activity and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Notifications</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start p-3 border-b border-gray-100 animate-pulse">
                  <div className="rounded-full bg-gray-200 h-8 w-8 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {generateNotifications().map(notification => (
                <div key={notification.id} className="flex items-start p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 rounded-md">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Add Event</button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="rounded-lg bg-gray-200 h-14 w-14 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-300">
                <div className="bg-white rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-sm mr-4 border border-indigo-100">
                  <span className="text-sm font-bold text-indigo-600">10</span>
                  <span className="text-xs text-indigo-600">May</span>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Staff Meeting</h3>
                  <p className="text-sm text-gray-600">09:00 AM - Conference Room</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                <div className="bg-white rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-sm mr-4 border border-green-100">
                  <span className="text-sm font-bold text-green-600">15</span>
                  <span className="text-xs text-green-600">May</span>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Science Exhibition</h3>
                  <p className="text-sm text-gray-600">10:30 AM - Main Hall</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-300">
                <div className="bg-white rounded-lg w-14 h-14 flex flex-col items-center justify-center shadow-sm mr-4 border border-amber-100">
                  <span className="text-sm font-bold text-amber-600">22</span>
                  <span className="text-xs text-amber-600">May</span>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Parent-Teacher Meeting</h3>
                  <p className="text-sm text-gray-600">02:00 PM - All Classrooms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 