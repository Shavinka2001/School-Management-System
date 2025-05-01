import { useState } from 'react';
import { FaBook, FaCalendarAlt, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function StudentAssignments() {
    const [filter, setFilter] = useState('all'); // all, pending, submitted
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);

    // Dummy assignments data
    const assignments = [
        {
            id: 1,
            title: 'Mathematics Homework',
            description: 'Complete exercises 1-10 from chapter 3',
            dueDate: '2024-03-15',
            submitted: false
        },
        {
            id: 2,
            title: 'Physics Lab Report',
            description: 'Write a report on the recent experiment',
            dueDate: '2024-03-18',
            submitted: true
        },
        {
            id: 3,
            title: 'Chemistry Project',
            description: 'Research paper on chemical reactions',
            dueDate: '2024-03-20',
            submitted: false
        },
        {
            id: 4,
            title: 'English Essay',
            description: 'Write an essay on modern literature',
            dueDate: '2024-03-22',
            submitted: true
        }
    ];

    const filteredAssignments = assignments.filter(assignment => {
        switch (filter) {
            case 'pending':
                return !assignment.submitted;
            case 'submitted':
                return assignment.submitted;
            default:
                return true;
        }
    });

    const handleFileChange = (e) => {
        setSubmissionFile(e.target.files[0]);
    };

    const handleSubmitAssignment = () => {
        if (!selectedAssignment || !submissionFile) return;
        
        // Simulate submission
        console.log('Submitting assignment:', selectedAssignment.id);
        console.log('File:', submissionFile.name);
        
        // Reset state
        setSelectedAssignment(null);
        setSubmissionFile(null);
    };

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Assignments
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'pending'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter('submitted')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'submitted'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Submitted
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    {filteredAssignments.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredAssignments.map((assignment) => (
                                <li key={assignment.id} className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <FaBook className="h-5 w-5 text-gray-400 mr-2" />
                                                <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <FaCalendarAlt className="mr-1" />
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </div>
                                                {assignment.submitted ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <FaCheckCircle className="mr-1" />
                                                        Submitted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <FaTimesCircle className="mr-1" />
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!assignment.submitted && (
                                            <button
                                                onClick={() => setSelectedAssignment(assignment)}
                                                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <FaBook className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? "You don't have any assignments."
                                    : filter === 'pending'
                                    ? "You don't have any pending assignments."
                                    : "You haven't submitted any assignments yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Assignment</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setSelectedAssignment(null);
                                    setSubmissionFile(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAssignment}
                                disabled={!submissionFile}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                    submissionFile
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-300 cursor-not-allowed'
                                }`}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentAssignments; 