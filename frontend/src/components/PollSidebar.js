import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function PollSidebar({ activeClassId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState(null);

  useEffect(() => {
    fetchClasses();
    if (activeClassId) {
      fetchClassDetails(activeClassId);
    }
  }, [activeClassId]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/classes`);
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchClassDetails = async (classId) => {
    try {
      const response = await axios.get(`${API_URL}/classes/${classId}`);
      setActiveClass(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const navigateToPolls = (classId) => {
    navigate(`/class-polls/${classId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
      <div className="p-4 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold">Class Polls</h2>
        {activeClass && (
          <p className="text-sm text-indigo-200 mt-1">
            Current: {activeClass.subject}
          </p>
        )}
      </div>
      
      <div className="p-4 border-b">
        <button
          onClick={() => navigate('/class-list')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
        >
          Back to Classes
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">All Classes</h3>
        {loading ? (
          <div className="text-center py-4">
            <svg className="animate-spin h-5 w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {classes.map((cls) => (
              <div
                key={cls._id}
                onClick={() => navigateToPolls(cls._id)}
                className={`p-3 rounded-md cursor-pointer transition-colors duration-150 ${
                  cls._id === activeClassId
                    ? 'bg-indigo-100 border-l-4 border-indigo-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <h4 className="font-medium text-gray-800">{cls.subject}</h4>
                <p className="text-sm text-gray-600">{cls.teacherName}</p>
                <p className="text-xs text-gray-500">Section: {cls.section}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {activeClass && (
        <div className="p-4 bg-gray-50 border-t">
          <h3 className="text-md font-medium text-gray-700 mb-2">Current Class Details</h3>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm"><span className="font-medium">Teacher:</span> {activeClass.teacherName}</p>
            <p className="text-sm"><span className="font-medium">Students:</span> {activeClass.numberOfStudents}</p>
            <p className="text-sm"><span className="font-medium">Section:</span> {activeClass.section}</p>
            <p className="text-sm"><span className="font-medium">Status:</span> 
              <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                activeClass.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {activeClass.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollSidebar; 