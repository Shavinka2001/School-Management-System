import { useState } from 'react';
import { FaClipboardList, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

function StudentExams() {
    const [filter, setFilter] = useState('all'); // all, upcoming, completed

    // Dummy exams data
    const exams = [
        {
            id: 1,
            subject: 'Mathematics',
            title: 'Midterm Exam',
            date: '2024-03-15',
            time: '09:00',
            duration: '2 hours',
            location: 'Room 101',
            completed: false
        },
        {
            id: 2,
            subject: 'Physics',
            title: 'Final Exam',
            date: '2024-03-18',
            time: '13:00',
            duration: '3 hours',
            location: 'Room 203',
            completed: false
        },
        {
            id: 3,
            subject: 'Chemistry',
            title: 'Lab Test',
            date: '2024-03-20',
            time: '10:30',
            duration: '1.5 hours',
            location: 'Lab 3',
            completed: true
        },
        {
            id: 4,
            subject: 'English',
            title: 'Literature Test',
            date: '2024-03-22',
            time: '11:00',
            duration: '1 hour',
            location: 'Room 105',
            completed: true
        }
    ];

    const filteredExams = exams.filter(exam => {
        const examDate = new Date(exam.date);
        const today = new Date();
        
        switch (filter) {
            case 'upcoming':
                return !exam.completed && examDate >= today;
            case 'completed':
                return exam.completed || examDate < today;
            default:
                return true;
        }
    });

    const getExamStatus = (exam) => {
        if (exam.completed) {
            return {
                text: 'Completed',
                icon: <FaCheckCircle className="text-green-500" />,
                color: 'bg-green-100 text-green-800'
            };
        }
        
        const examDate = new Date(exam.date);
        const today = new Date();
        
        if (examDate < today) {
            return {
                text: 'Completed',
                icon: <FaCheckCircle className="text-green-500" />,
                color: 'bg-green-100 text-green-800'
            };
        }
        
        return {
            text: 'Upcoming',
            icon: <FaClock className="text-yellow-500" />,
            color: 'bg-yellow-100 text-yellow-800'
        };
    };

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Exams</h3>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Exams
                            </button>
                            <button
                                onClick={() => setFilter('upcoming')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'upcoming'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    filter === 'completed'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exams List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    {filteredExams.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredExams.map((exam) => {
                                const status = getExamStatus(exam);
                                return (
                                    <li key={exam.id} className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <FaClipboardList className="h-5 w-5 text-gray-400 mr-2" />
                                                    <h4 className="text-lg font-medium text-gray-900">{exam.subject} - {exam.title}</h4>
                                                </div>
                                                <div className="mt-2 flex items-center space-x-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FaCalendarAlt className="mr-1" />
                                                        {new Date(exam.date).toLocaleDateString()} at {exam.time}
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                        {exam.duration}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                        {exam.location}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                        {status.icon}
                                                        <span className="ml-1">{status.text}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? "You don't have any exams scheduled."
                                    : filter === 'upcoming'
                                    ? "You don't have any upcoming exams."
                                    : "You haven't completed any exams yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentExams; 