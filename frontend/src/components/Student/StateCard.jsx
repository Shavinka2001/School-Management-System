// src/components/Student/StudentStats.jsx
import React from 'react';
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const StudentStats = ({ stats }) => {
  const defaultStats = {
    coursesEnrolled: 0,
    attendanceRate: "0%",
    assignmentsCompleted: 0,
    upcomingTests: 0
  };
  
  const data = stats || defaultStats;
  
  return (
    <>
      <StatCard 
        icon={BookOpen} 
        title="Courses" 
        value={data.coursesEnrolled} 
        color="bg-blue-500"
      />
      <StatCard 
        icon={Calendar} 
        title="Attendance" 
        value={data.attendanceRate} 
        color="bg-green-500"
      />
      <StatCard 
        icon={CheckCircle} 
        title="Completed" 
        value={data.assignmentsCompleted} 
        color="bg-purple-500"
      />
      <StatCard 
        icon={Clock} 
        title="Upcoming Tests" 
        value={data.upcomingTests} 
        color="bg-orange-500"
      />
    </>
  );
};

export default StudentStats;