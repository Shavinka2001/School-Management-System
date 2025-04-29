// src/components/Student/CourseProgress.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CourseProgressCard = ({ course }) => {
  const progressPercent = course.completed / course.total * 100;
  
  return (
    <div className="border-b border-gray-200 last:border-0 p-4 hover:bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{course.name}</h4>
        <span className="text-sm text-gray-500">{course.instructor}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{course.completed}/{course.total} completed</span>
        <span className="font-medium">{progressPercent.toFixed(0)}%</span>
      </div>
    </div>
  );
};

const CourseProgress = ({ courses = [] }) => {
  // Prepare data for chart
  const chartData = courses.map(course => ({
    name: course.name.length > 15 ? `${course.name.substring(0, 15)}...` : course.name,
    progress: (course.completed / course.total * 100).toFixed(0)
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Course Progress</h2>
        <a href="/student/courses" className="text-blue-600 text-sm hover:underline">View Courses</a>
      </div>
      
      {courses.length > 0 ? (
        <>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Progress']}
                />
                <Bar dataKey="progress" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="divide-y divide-gray-200">
            {courses.slice(0, 3).map((course, index) => (
              <CourseProgressCard key={index} course={course} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No courses enrolled</p>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;