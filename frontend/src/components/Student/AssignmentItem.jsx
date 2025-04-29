// src/components/Student/UpcomingAssignments.jsx
import React from 'react';
import { Clock, Calendar } from 'lucide-react';

const AssignmentItem = ({ assignment }) => {
  // Calculate days remaining
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determine the status color
  let statusColor = "bg-green-100 text-green-800";
  if (diffDays <= 1) {
    statusColor = "bg-red-100 text-red-800";
  } else if (diffDays <= 3) {
    statusColor = "bg-orange-100 text-orange-800";
  }

  return (
    <div className="border-b border-gray-200 last:border-0 p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
          <p className="text-sm text-gray-600">{assignment.course}</p>
        </div>
        <span className={`text-xs rounded-full px-3 py-1 ${statusColor}`}>
          {diffDays <= 0 ? 'Due Today' : `${diffDays} days left`}
        </span>
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <Clock size={16} className="mr-1" />
        <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const UpcomingAssignments = ({ assignments = [] }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Assignments</h2>
        <a href="/student/assignments" className="text-blue-600 text-sm hover:underline">View All</a>
      </div>
      
      <div className="divide-y divide-gray-200">
        {assignments.length > 0 ? (
          assignments.slice(0, 5).map((assignment, index) => (
            <AssignmentItem key={index} assignment={assignment} />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
            <p>No upcoming assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAssignments;