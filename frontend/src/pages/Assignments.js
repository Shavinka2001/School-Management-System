import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../components/Navigation';
import { FaGamepad } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(false);
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
  const [gamifyModalOpen, setGamifyModalOpen] = useState(false);
  const [gamifyLoading, setGamifyLoading] = useState(false);
  const [gamifiedIdea, setGamifiedIdea] = useState(null);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [generatedGame, setGeneratedGame] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [allPuzzles, setAllPuzzles] = useState([]);

  const grades = ['10', '11', '12'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
  const statuses = ['pending', 'completed'];

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/assignments${selectedGrade !== 'all' ? `?grade=${selectedGrade}` : ''}`);
      setAssignments(response.data);
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

  const generateGameContent = (assignment) => {
    const { subject, title } = assignment;
    
    // Game templates based on subject
    const gameTemplates = {
      math: {
        type: "Math Challenge",
        description: `Test your math skills with this ${title} challenge!`,
        activities: [
          "Solve equations to unlock levels",
          "Complete math puzzles",
          "Race against time to solve problems"
        ]
      },
      science: {
        type: "Science Explorer",
        description: `Explore the world of ${title} through interactive experiments!`,
        activities: [
          "Virtual lab experiments",
          "Science quiz challenges",
          "Interactive simulations"
        ]
      },
      english: {
        type: "Word Adventure",
        description: `Embark on a literary journey with ${title}!`,
        activities: [
          "Story building challenges",
          "Vocabulary quests",
          "Creative writing missions"
        ]
      },
      history: {
        type: "Time Traveler",
        description: `Travel through time to explore ${title}!`,
        activities: [
          "Historical role-playing",
          "Timeline challenges",
          "Historical puzzle solving"
        ]
      }
    };

    // Get the appropriate template based on subject
    const template = gameTemplates[subject.toLowerCase()] || {
      type: "Learning Adventure",
      description: `Let's explore ${title} in a fun way!`,
      activities: [
        "Interactive quizzes",
        "Challenge missions",
        "Creative projects"
      ]
    };

    return {
      ...template,
      title,
      subject,
      createdAt: new Date().toISOString()
    };
  };

  const handleGamify = (assignment) => {
    setSelectedAssignment(assignment);
    setGameModalOpen(true);
  };

  const generatePuzzle = (assignment) => {
    if (!assignment) return null;
    
    const { subject, title, description, grade } = assignment;
    
    // Create more detailed puzzles based on the actual assignment subject
    const puzzles = {
      Mathematics: [
        {
          type: "Algebra Challenge",
          question: `In your ${title} assignment, solve for x: 2x + 5 = 15`,
          answer: "5",
          hint: "Subtract 5 from both sides first"
        },
        {
          type: "Geometry Puzzle",
          question: `Based on ${title}, if a square has a perimeter of 20 units, what is the length of one side?`,
          answer: "5",
          hint: "Divide the perimeter by 4"
        },
        {
          type: "Word Problem",
          question: `If your ${title} involves word problems, solve: If you have 3 times the number of apples as oranges, and you have 12 oranges, how many apples do you have?`,
          answer: "36",
          hint: "Multiply the number of oranges by 3"
        },
        {
          type: "Fractions Challenge",
          question: `In ${title}, what is 1/2 + 1/4?`,
          answer: "3/4",
          hint: "Find a common denominator"
        }
      ],
      Science: [
        {
          type: "Biology Quiz",
          question: `In your ${title} assignment, what is the process by which plants make their own food?`,
          answer: "photosynthesis",
          hint: "Starts with 'photo'"
        },
        {
          type: "Chemistry Challenge",
          question: `Based on ${title}, what is the chemical symbol for water?`,
          answer: "h2o",
          hint: "H and O with a number"
        },
        {
          type: "Physics Puzzle",
          question: `In ${title}, what is the formula for calculating speed?`,
          answer: "distance/time",
          hint: "Think about how you measure how fast something is moving"
        },
        {
          type: "Environmental Science",
          question: `In your ${title} assignment, what is the main gas that plants absorb from the atmosphere?`,
          answer: "carbon dioxide",
          hint: "Starts with 'carbon'"
        }
      ],
      English: [
        {
          type: "Grammar Challenge",
          question: `In your ${title} assignment, what is the past tense of the verb 'to be'?`,
          answer: "was",
          hint: "Used with singular subjects"
        },
        {
          type: "Vocabulary Quiz",
          question: `Based on ${title}, what is a synonym for 'happy'?`,
          answer: "joyful",
          hint: "Starts with 'j'"
        },
        {
          type: "Literature Puzzle",
          question: `In ${title}, what is the main character in a story called?`,
          answer: "protagonist",
          hint: "Starts with 'pro'"
        },
        {
          type: "Writing Challenge",
          question: `In your ${title} assignment, what is the first sentence of a paragraph called?`,
          answer: "topic sentence",
          hint: "It introduces the main idea"
        }
      ],
      History: [
        {
          type: "Timeline Quiz",
          question: `In your ${title} assignment, when did the American Revolution begin?`,
          answer: "1775",
          hint: "Between 1770 and 1780"
        },
        {
          type: "Geography Challenge",
          question: `Based on ${title}, what is the capital of France?`,
          answer: "paris",
          hint: "Starts with 'P'"
        },
        {
          type: "Culture Puzzle",
          question: `In ${title}, what ancient civilization built the pyramids?`,
          answer: "egyptians",
          hint: "From North Africa"
        },
        {
          type: "Historical Figures",
          question: `In your ${title} assignment, who was the first President of the United States?`,
          answer: "george washington",
          hint: "First name starts with 'G'"
        }
      ],
      Geography: [
        {
          type: "Map Challenge",
          question: `In your ${title} assignment, what is the largest continent in the world?`,
          answer: "asia",
          hint: "Starts with 'A'"
        },
        {
          type: "Climate Quiz",
          question: `Based on ${title}, what is the imaginary line that divides the Earth into Northern and Southern Hemispheres?`,
          answer: "equator",
          hint: "Starts with 'e'"
        },
        {
          type: "Landforms Puzzle",
          question: `In ${title}, what is the highest mountain in the world?`,
          answer: "mount everest",
          hint: "Located in the Himalayas"
        },
        {
          type: "Population Challenge",
          question: `In your ${title} assignment, what is the most populous country in the world?`,
          answer: "china",
          hint: "Starts with 'C'"
        }
      ]
    };

    // Get puzzles for the specific subject from the assignment
    const subjectPuzzles = puzzles[subject] || [
      {
        type: "General Quiz",
        question: `What is the main topic of your ${title} assignment?`,
        answer: description.split(' ').slice(0, 3).join(' '),
        hint: "Look at the assignment description"
      }
    ];

    return subjectPuzzles;
  };

  const checkAnswer = () => {
    const isAnswerCorrect = puzzleAnswer.toLowerCase() === currentPuzzle.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setGameProgress(prev => Math.min(prev + 20, 100));
      toast.success('Correct answer! 🎉');
      
      // Move to next puzzle if available
      const nextIndex = currentPuzzleIndex + 1;
      if (nextIndex < allPuzzles.length) {
        setCurrentPuzzleIndex(nextIndex);
        setCurrentPuzzle(allPuzzles[nextIndex]);
      }
    } else {
      toast.error('Try again! 💡');
    }
    setPuzzleAnswer('');
  };

  const startGame = () => {
    if (!selectedAssignment) return;
    
    setGameStarted(true);
    setGameProgress(0);
    setCurrentPuzzleIndex(0);
    const puzzles = generatePuzzle(selectedAssignment);
    setAllPuzzles(puzzles);
    setCurrentPuzzle(puzzles[0]);
    setPuzzleAnswer('');
    setIsCorrect(null);
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
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

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

        {loading && !showForm ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(assignment => (
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
                        onClick={() => handleGamify(assignment)}
                        className="text-blue-500 hover:text-blue-600"
                        disabled={gamifyLoading}
                        title="Generate Game"
                      >
                        <FaGamepad className="text-xl" />
                      </button>
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

        {/* Game Modal */}
        {gameModalOpen && (
          <GameModal
            isOpen={gameModalOpen}
            onClose={() => {
              setGameModalOpen(false);
              setGameStarted(false);
              setGameProgress(0);
              setShowReward(false);
              setCurrentPuzzle(null);
              setPuzzleAnswer('');
              setIsCorrect(null);
              setSelectedAssignment(null);
            }}
            assignment={selectedAssignment}
            onStartGame={startGame}
            gameStarted={gameStarted}
            currentPuzzle={currentPuzzle}
            puzzleAnswer={puzzleAnswer}
            setPuzzleAnswer={setPuzzleAnswer}
            checkAnswer={checkAnswer}
            isCorrect={isCorrect}
            gameProgress={gameProgress}
          />
        )}
      </div>
    </div>
  );
};

const GameModal = ({ isOpen, onClose, assignment, onStartGame, gameStarted, currentPuzzle, puzzleAnswer, setPuzzleAnswer, checkAnswer, isCorrect, gameProgress }) => {
  if (!isOpen) return null;

  const getReward = () => {
    const rewards = [
      "🌟 Achievement Badge: Master Explorer",
      "🎯 Bonus Points: +100 XP",
      "📚 Unlocked: Advanced Level Content",
      "🏆 Certificate of Completion",
      "🎨 Creative Project Showcase",
      "🎮 Special Game Access",
      "📝 Extra Credit Points",
      "🎪 Virtual Field Trip",
      "🎭 Role-Playing Adventure",
      "🎲 Bonus Game Level"
    ];
    return rewards[Math.floor(Math.random() * rewards.length)];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-2xl font-bold mb-4">Puzzle Game</h3>
        <div className="mb-6">
          {assignment && (
            <>
              <p className="text-gray-600 mb-2">Assignment: {assignment.title}</p>
              <p className="text-gray-600 mb-2">Subject: {assignment.subject}</p>
            </>
          )}
          
          {gameStarted ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Game Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${gameProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{gameProgress}% Complete</p>
              </div>
              
              {currentPuzzle && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">{currentPuzzle.type}</h4>
                  <p className="text-lg mb-4">{currentPuzzle.question}</p>
                  
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      value={puzzleAnswer}
                      onChange={(e) => setPuzzleAnswer(e.target.value)}
                      placeholder="Your answer..."
                      className="flex-1 border rounded px-4 py-2"
                    />
                    <button
                      onClick={checkAnswer}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                  
                  {isCorrect === false && (
                    <p className="text-yellow-600">Hint: {currentPuzzle.hint}</p>
                  )}
                </div>
              )}

              {gameProgress === 100 && (
                <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-yellow-800">🎉 Congratulations!</h4>
                  <p className="text-lg mt-2">You've completed the game!</p>
                  <p className="text-xl font-bold mt-4">Your Reward: {getReward()}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Game Description:</h4>
              <p className="text-gray-600">Test your knowledge with subject-specific puzzles!</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
          {!gameStarted && (
            <button
              onClick={onStartGame}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments; 