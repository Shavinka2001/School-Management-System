import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes';

// Valid sections are A, B, C, D
const VALID_SECTIONS = ['A', 'B', 'C', 'D'];
// Valid grades are 1 through 13
const MAX_GRADE = 13;

function ClassManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    teacherName: '',
    subject: '',
    numberOfStudents: '',
    section: '',
    isActive: true,
  });

  // Validates section format (e.g., "10-A", "5-C", etc.)
  const validateSection = (section) => {
    // Pattern: digit(s) followed by hyphen followed by a single letter
    const sectionPattern = /^(\d+)-([A-Z])$/;
    const match = section.match(sectionPattern);
    
    if (!match) {
      return 'Section must be in format "Grade-Section" (e.g., "10-A")';
    }
    
    const grade = parseInt(match[1], 10);
    const sectionLetter = match[2];
    
    if (grade < 1 || grade > MAX_GRADE) {
      return `Grade must be between 1 and ${MAX_GRADE}`;
    }
    
    if (!VALID_SECTIONS.includes(sectionLetter)) {
      return `Section must be one of: ${VALID_SECTIONS.join(', ')}`;
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Add validation for student count
    if (name === 'numberOfStudents') {
      const numValue = parseInt(value, 10);
      if (numValue > 50) {
        setError('Maximum number of students allowed is 50');
        return;
      } else {
        setError('');
      }
    }
    
    // Add validation for section
    if (name === 'section' && value) {
      const sectionError = validateSection(value);
      if (sectionError) {
        setError(sectionError);
        // Still update the form data to show the user's input
        setFormData({
          ...formData,
          [name]: value,
        });
        return;
      } else {
        setError('');
      }
    }
    
    setFormData({
      ...formData,
      [name]: name === 'IsActive' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation checks before submitting
    const numStudents = parseInt(formData.numberOfStudents, 10);
    if (numStudents > 50) {
      setError('Maximum number of students allowed is 50');
      return;
    }
    
    // Validate section format
    const sectionError = validateSection(formData.section);
    if (sectionError) {
      setError(sectionError);
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({
        teacherName: '',
        subject: '',
        numberOfStudents: '',
        section: '',
        isActive: true,
      });
      setLoading(false);
      navigate('/class-list');
    } catch (error) {
      console.error('Error creating class:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50 rounded-bl-full z-0"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                  Create New Class
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Add a new class to your Smart School management system
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => navigate('/class-list')}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                  Back to Class List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Header */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Class Information</h2>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Teacher Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter teacher's full name"
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter subject name"
                      className="pl-10 block w-full border border-gray-300 rounded-lg py-3 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Students <span className="text-xs text-gray-500">(Max: 50)</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name="numberOfStudents"
                      value={formData.numberOfStudents}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter student count (1-50)"
                      min="1"
                      max="50"
                      className={`pl-10 block w-full border ${error && error.includes('students') ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg py-3 transition-colors duration-200`}
                    />
                  </div>
                  {error && error.includes('students') && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Section <span className="text-xs text-gray-500">(Grade 1-13, Sections A-D)</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      required
                      placeholder="Format: Grade-Section (e.g., 10-A)"
                      className={`pl-10 block w-full border ${error && !error.includes('students') ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg py-3 transition-colors duration-200`}
                    />
                  </div>
                  {error && !error.includes('students') && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Valid format: Grade (1-13) followed by section letter (A-D), e.g., "10-A", "7-C"
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center">
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      id="isActive" 
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                    />
                    <label 
                      htmlFor="isActive" 
                      className={`toggle-label block overflow-hidden h-6 rounded-full ${formData.isActive ? 'bg-indigo-500' : 'bg-gray-300'} cursor-pointer`}
                    ></label>
                  </div>
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Status
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Active classes will be available for polls and management</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/class-list')}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || error}
                    className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Class
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Class Management</h3>
            <p className="text-gray-600">Create, edit, and organize classes. Track student enrollment and manage teacher assignments.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Poll System</h3>
            <p className="text-gray-600">Create polls to gather student feedback. Collect data about teacher performance and lesson quality.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reporting</h3>
            <p className="text-gray-600">Generate comprehensive reports. Export data to CSV for further analysis.</p>
          </div>
        </div>
      </div>
      
      {/* Style for toggle */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #6366f1;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #6366f1;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e5e7eb;
          transition: all 0.3s;
        }
        .toggle-label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}

export default ClassManagement; 