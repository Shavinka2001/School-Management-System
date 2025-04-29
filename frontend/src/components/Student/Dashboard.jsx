// src/components/Student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import StudentStats from './StudentStats';
import UpcomingAssignments from './UpcomingAssignments';
import RecentAnnouncements from './RecentAnnouncements';
import CourseProgress from './CourseProgress';
import AttendanceChart from './AttendanceChart';
import Calendar from '../shared/Calendar';

const Dashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data from your backend
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/student/dashboard');
        const data = await response.json();
        setStudentData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {studentData?.name || 'Student'}</h1>
            <p className="text-gray-600">Here's what's happening with your academic progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StudentStats stats={studentData?.stats} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <CourseProgress courses={studentData?.courses} />
            </div>
            <div className="bg-white rounded-lg shadow">
              <AttendanceChart attendance={studentData?.attendance} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <UpcomingAssignments assignments={studentData?.assignments} />
            </div>
            <div className="bg-white rounded-lg shadow">
              <RecentAnnouncements announcements={studentData?.announcements} />
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow">
            <Calendar events={studentData?.events} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;