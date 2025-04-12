import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../components/Navigation';
import { FaSearch, FaFilePdf, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '10',
    subject: '',
    dueDate: '',
    totalMarks: '',
    status: 'pending'
  });
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const grades = ['10', '11', '12'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
  const statuses = ['pending', 'completed'];

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/assignments${selectedGrade !== 'all' ? `?grade=${selectedGrade}` : ''}`);
      setAssignments(response.data);
      setFilteredAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    // Filter assignments based on search term
    const filtered = assignments.filter(assignment =>
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchTerm, assignments]);

  // Add effect to handle grade changes
  useEffect(() => {
    const filtered = assignments.filter(assignment => {
      const subjectMatch = searchTerm 
        ? assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const gradeMatch = selectedGrade !== 'all' 
        ? assignment.grade === selectedGrade 
        : true;
      return subjectMatch && gradeMatch;
    });
    setFilteredAssignments(filtered);
  }, [selectedGrade, assignments, searchTerm]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (!formData.totalMarks || formData.totalMarks <= 0) errors.totalMarks = 'Total marks must be greater than 0';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      if (editMode) {
        await axios.put(`http://localhost:5000/api/assignments/${selectedAssignment._id}`, formData);
        toast.success('Assignment updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/assignments', formData);
        toast.success('Assignment created successfully');
      }
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        grade: '10',
        subject: '',
        dueDate: '',
        totalMarks: '',
        status: 'pending'
      });
      setFormErrors({});
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      grade: assignment.grade,
      subject: assignment.subject,
      dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
      totalMarks: assignment.totalMarks,
      status: assignment.status
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/assignments/${id}`);
        toast.success('Assignment deleted successfully');
        fetchAssignments();
      } catch (error) {
        toast.error('Failed to delete assignment');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      grade: '10',
      subject: '',
      dueDate: '',
      totalMarks: '',
      status: 'pending'
    });
    setFormErrors({});
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const handleMarkComplete = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/assignments/${id}`, { status: 'completed' });
      toast.success('Assignment marked as complete');
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to mark assignment as complete');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    // Filter assignments based on subject and grade
    const filtered = assignments.filter(assignment => {
      const subjectMatch = searchValue 
        ? assignment.subject.toLowerCase().includes(searchValue.toLowerCase())
        : true;
      const gradeMatch = selectedGrade !== 'all' 
        ? assignment.grade === selectedGrade 
        : true;
      return subjectMatch && gradeMatch;
    });
    setFilteredAssignments(filtered);
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');

      // Use the current filtered assignments
      const assignmentsToReport = filteredAssignments;

      if (assignmentsToReport.length === 0) {
        toast.error('No assignments found for the selected criteria');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/assignments/report', {
        responseType: 'blob',
        params: {
          subject: searchTerm || undefined,
          grade: selectedGrade !== 'all' ? selectedGrade : undefined
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `assignments-report-${searchTerm || 'all'}-grade${selectedGrade !== 'all' ? selectedGrade : 'all'}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="mt-2 text-gray-600">Manage and create assignments for your students</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <FaFilePdf />
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !showForm ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map(assignment => (
              <div key={assignment._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    <div className="flex space-x-2">
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => handleMarkComplete(assignment._id)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                          title="Mark as complete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{assignment.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Grade:</span>
                      <span className="ml-2 font-medium">Grade {assignment.grade}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Subject:</span>
                      <span className="ml-2 font-medium">{assignment.subject}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className="ml-2 font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Marks:</span>
                      <span className="ml-2 font-medium">{assignment.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 font-medium ${
                        assignment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {assignment.status === 'completed' ? 'Completed' : 'Pending Review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode ? 'Edit Assignment' : 'Create Assignment'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter assignment title"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        formErrors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    {formErrors.subject && <p className="mt-1 text-sm text-red-500">{formErrors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {grades.map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        formErrors.dueDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.dueDate && <p className="mt-1 text-sm text-red-500">{formErrors.dueDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        formErrors.totalMarks ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter total marks"
                    />
                    {formErrors.totalMarks && <p className="mt-1 text-sm text-red-500">{formErrors.totalMarks}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'pending' ? 'Pending Review' : 'Completed'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter assignment description"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      editMode ? 'Update Assignment' : 'Create Assignment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments; 