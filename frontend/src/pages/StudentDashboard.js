import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navigation from '../components/Navigation';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [allPuzzles, setAllPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [selectedGrade]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/assignments${selectedGrade !== 'all' ? `?grade=${selectedGrade}` : ''}`);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const generatePuzzles = (assignment) => {
    const { title, subject, description } = assignment;
    
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

  const handleStartPuzzle = (assignment) => {
    setSelectedAssignment(assignment);
    setGameModalOpen(true);
  };

  const checkAnswer = () => {
    const isAnswerCorrect = puzzleAnswer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setGameProgress(prev => Math.min(prev + 25, 100));
      toast.success('Correct answer! 🎉');
      
      // Move to next puzzle if available
      const nextIndex = currentPuzzleIndex + 1;
      if (nextIndex < allPuzzles.length) {
        setCurrentPuzzleIndex(nextIndex);
        setCurrentPuzzle(allPuzzles[nextIndex]);
      } else if (gameProgress + 25 >= 100) {
        setShowReward(true);
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
    const puzzles = generatePuzzles(selectedAssignment);
    setAllPuzzles(puzzles);
    setCurrentPuzzle(puzzles[0]);
    setPuzzleAnswer('');
    setIsCorrect(null);
    setShowReward(false);
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and complete your assignments
          </p>
        </div>

        {/* Grade Filter */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedGrade === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-l-md`}
            >
              All Grades
            </button>
            {['10', '11', '12'].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedGrade === grade 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300 ${
                  grade === '12' ? 'rounded-r-md' : ''
                }`}
              >
                Grade {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading assignments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div key={assignment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{assignment.description}</p>
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-900">Grade:</span> {assignment.grade}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Subject:</span> {assignment.subject}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">Due:</span>{' '}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleStartPuzzle(assignment)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No assignments found for the selected grade.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Modal */}
      {gameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">Interactive Quiz</h3>
            <div className="mb-6">
              {selectedAssignment && (
                <>
                  <p className="text-gray-600 mb-2">Assignment: {selectedAssignment.title}</p>
                  <p className="text-gray-600 mb-2">Subject: {selectedAssignment.subject}</p>
                </>
              )}
              
              {gameStarted ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Quiz Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${gameProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{gameProgress}% Complete</p>
                  </div>
                  
                  {currentPuzzle && !showReward && (
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

                  {showReward && (
                    <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-yellow-800">🎉 Congratulations!</h4>
                      <p className="text-lg mt-2">You've completed all questions!</p>
                      <p className="text-xl font-bold mt-4">Your Reward: {getReward()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Quiz Description:</h4>
                  <p className="text-gray-600">Test your knowledge with subject-specific puzzles!</p>
                  <p className="text-gray-600 mt-2">Complete all questions to earn a special reward.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setGameModalOpen(false);
                  setGameStarted(false);
                  setGameProgress(0);
                  setShowReward(false);
                  setCurrentPuzzle(null);
                  setPuzzleAnswer('');
                  setIsCorrect(null);
                  setSelectedAssignment(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
              {!gameStarted && (
                <button
                  onClick={startGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Start Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 