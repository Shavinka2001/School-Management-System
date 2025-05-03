import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PollSidebar from '../components/PollSidebar';

const API_URL = 'http://localhost:5000/api';

function ClassPolls() {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [isTeacher, setIsTeacher] = useState(true); // In a real app, this would come from auth
  const [editingPoll, setEditingPoll] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pollStats, setPollStats] = useState({ total: 0, teacher: 0, lesson: 0 });
  
  // Form state for creating a new poll
  const [newPoll, setNewPoll] = useState({
    question: '',
    type: 'teacher'
  });

  useEffect(() => {
    fetchData();
  }, [classId]);

  useEffect(() => {
    if (polls.length > 0) {
      // Calculate poll statistics
      const teacherPolls = polls.filter(poll => poll.type === 'teacher').length;
      const lessonPolls = polls.filter(poll => poll.type === 'lesson').length;
      setPollStats({
        total: polls.length,
        teacher: teacherPolls,
        lesson: lessonPolls
      });
    }
  }, [polls]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch class information
      const classResponse = await axios.get(`${API_URL}/classes/${classId}`);
      setClassInfo(classResponse.data);
      
      // Fetch polls for this class
      const pollsResponse = await axios.get(`${API_URL}/polls/class/${classId}`);
      setPolls(pollsResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      setLoading(false);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    if (!newPoll.question.trim()) {
      alert('Please enter a valid question');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/polls`, {
        ...newPoll,
        classId
      });
      
      // Add the new poll to the existing polls
      setPolls([...polls, response.data]);
      
      // Reset the form
      setNewPoll({
        question: '',
        type: 'teacher'
      });
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll. Please try again.');
    }
  };

  const handleEditPoll = (poll) => {
    setEditingPoll({
      id: poll._id,
      question: poll.question,
      type: poll.type
    });
    setShowEditModal(true);
  };

  const handleUpdatePoll = async (e) => {
    e.preventDefault();
    
    if (!editingPoll.question.trim()) {
      alert('Please enter a valid question');
      return;
    }
    
    try {
      const response = await axios.patch(`${API_URL}/polls/${editingPoll.id}`, {
        question: editingPoll.question,
        type: editingPoll.type
      });
      
      // Update the poll in the state
      setPolls(polls.map(p => p._id === editingPoll.id ? response.data : p));
      
      // Close the modal
      setShowEditModal(false);
      setEditingPoll(null);
    } catch (err) {
      console.error('Error updating poll:', err);
      setError('Failed to update poll. Please try again.');
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPoll({
      ...editingPoll,
      [name]: value
    });
  };

  const handleVote = async (pollId, rating) => {
    if (!studentId) {
      alert('Please enter your student ID to vote');
      return;
    }

    try {
      await axios.post(`${API_URL}/polls/${pollId}/vote`, {
        rating,
        studentId
      });
      
      // Refresh polls to show updated results
      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message || 'You have already voted on this poll');
      } else {
        console.error('Error voting:', err);
        setError('Failed to submit vote. Please try again.');
      }
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/polls/${pollId}`);
      
      // Remove the deleted poll from state
      setPolls(polls.filter(poll => poll._id !== pollId));
    } catch (err) {
      console.error('Error deleting poll:', err);
      setError('Failed to delete poll. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPoll({
      ...newPoll,
      [name]: value
    });
  };

  const toggleUserView = () => {
    setIsTeacher(!isTeacher);
  };

  // Calculate percentage for the rating bar
  const calculatePercentage = (poll, rating) => {
    const total = Object.values(poll.ratings).reduce((sum, count) => sum + parseInt(count || 0), 0);
    if (total === 0) return 0;
    return ((poll.ratings[rating] || 0) / total) * 100;
  };

  // Calculate average rating
  const calculateAverage = (poll) => {
    const total = Object.values(poll.ratings).reduce((sum, count) => sum + parseInt(count || 0), 0);
    if (total === 0) return 0;
    
    const weightedSum = 
      (1 * (poll.ratings[1] || 0)) +
      (2 * (poll.ratings[2] || 0)) +
      (3 * (poll.ratings[3] || 0)) +
      (4 * (poll.ratings[4] || 0)) +
      (5 * (poll.ratings[5] || 0));
    
    return (weightedSum / total).toFixed(1);
  };

  // Get color based on rating
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-teal-500';
    if (rating >= 2.5) return 'bg-yellow-500';
    if (rating >= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {halfStar && (
          <span className="relative">
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="absolute inset-0 w-5 h-5 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Content Area */}
          <div className="lg:flex-1">
            {/* Header */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {classInfo ? `${classInfo.subject} - Feedback Polls` : 'Class Polls'}
                  </h1>
                  {classInfo && (
                    <p className="mt-1 text-sm text-gray-600">
                      Teacher: {classInfo.teacherName} | Section: {classInfo.section}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={toggleUserView}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Switch to {isTeacher ? 'Student' : 'Teacher'} View
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Poll Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="text-4xl font-bold">{pollStats.total}</div>
                  <div className="text-sm">Total Polls</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="text-4xl font-bold">{pollStats.teacher}</div>
                  <div className="text-sm">Teacher Feedback Polls</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                  <div className="text-4xl font-bold">{pollStats.lesson}</div>
                  <div className="text-sm">Lesson Feedback Polls</div>
                </div>
              </div>
            </div>

            {/* Student ID input (in a real app, this would be handled by authentication) */}
            {!isTeacher && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="mb-4">
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    Enter your Student ID to vote
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your Student ID"
                  />
                </div>
              </div>
            )}

            {/* Create Poll Form (only visible to teachers/admin) */}
            {isTeacher && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Poll</h2>
                <form onSubmit={handleCreatePoll}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                        Question
                      </label>
                      <input
                        type="text"
                        id="question"
                        name="question"
                        value={newPoll.question}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="How would you rate the teacher's explanations?"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Poll Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={newPoll.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="teacher">Teacher Feedback</option>
                        <option value="lesson">Lesson Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Poll
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Poll List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.length > 0 ? (
                polls.map((poll) => (
                  <div key={poll._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{poll.question}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${poll.type === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {poll.type === 'teacher' ? 'Teacher Feedback' : 'Lesson Feedback'}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(poll.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {isTeacher && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPoll(poll)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePoll(poll._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Average Rating with Stars */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="text-3xl font-bold text-gray-900 mr-2">
                            {calculateAverage(poll)}
                          </div>
                          <StarRating rating={parseFloat(calculateAverage(poll))} />
                        </div>
                        <div className="text-sm text-gray-500">
                          ({Object.values(poll.ratings).reduce((sum, count) => sum + parseInt(count || 0), 0)} votes)
                        </div>
                      </div>

                      {/* Rating Bars */}
                      <div className="space-y-2 mb-6">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <div className="min-w-[30px] text-sm font-medium text-gray-700">{rating}</div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                              <div
                                className={`h-full ${rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${calculatePercentage(poll, rating)}%` }}
                              ></div>
                            </div>
                            <div className="min-w-[30px] text-right text-sm text-gray-600">
                              {poll.ratings[rating] || 0}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Voting Buttons (only for students) */}
                      {!isTeacher && (
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Rate this:</h4>
                          <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => handleVote(poll._id, rating)}
                                className={`flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  rating === 1 ? 'bg-red-100 hover:bg-red-200 text-red-800' :
                                  rating === 2 ? 'bg-orange-100 hover:bg-orange-200 text-orange-800' :
                                  rating === 3 ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' :
                                  rating === 4 ? 'bg-green-100 hover:bg-green-200 text-green-800' :
                                  'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                }`}
                                title={
                                  rating === 1 ? 'Poor' :
                                  rating === 2 ? 'Fair' :
                                  rating === 3 ? 'Average' :
                                  rating === 4 ? 'Good' :
                                  'Excellent'
                                }
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white shadow-md rounded-lg p-6">
                  <p className="text-gray-600 text-center">
                    No polls have been created for this class yet.
                    {isTeacher && ' Use the form above to create your first poll.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              <PollSidebar activeClassId={classId} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Poll Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Poll</h3>
                  <form onSubmit={handleUpdatePoll}>
                    <div className="mb-4">
                      <label htmlFor="edit-question" className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        id="edit-question"
                        name="question"
                        value={editingPoll?.question || ''}
                        onChange={handleEditInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Poll Type
                      </label>
                      <select
                        id="edit-type"
                        name="type"
                        value={editingPoll?.type || 'teacher'}
                        onChange={handleEditInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="teacher">Teacher Feedback</option>
                        <option value="lesson">Lesson Feedback</option>
                      </select>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingPoll(null);
                        }}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassPolls; 