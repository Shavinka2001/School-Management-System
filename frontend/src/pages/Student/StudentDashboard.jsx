import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import {
    FaCalendarAlt,
    FaBook,
    FaClipboardList,
    FaGraduationCap,
    FaChartLine,
    FaUserGraduate
} from 'react-icons/fa';

function StudentDashboard() {
    const { user } = useUser();
    const [stats, setStats] = useState({
        upcomingExams: 0,
        pendingAssignments: 0,
        completedAssignments: 0,
        averageGrade: 0
    });

    // Dummy data for dashboard
    const dummyStats = {
        upcomingExams: 3,
        pendingAssignments: 5,
        completedAssignments: 45,
        averageGrade: 85,
        recentExams: [
            { id: 1, subject: 'Mathematics', date: '2024-03-15', status: 'Upcoming' },
            { id: 2, subject: 'Physics', date: '2024-03-20', status: 'Upcoming' },
            { id: 3, subject: 'Chemistry', date: '2024-03-25', status: 'Upcoming' }
        ],
        recentAssignments: [
            { id: 1, title: 'Math Homework', dueDate: '2024-03-10', status: 'Pending' },
            { id: 2, title: 'Physics Lab Report', dueDate: '2024-03-12', status: 'Pending' },
            { id: 3, title: 'Chemistry Project', dueDate: '2024-03-15', status: 'Pending' }
        ],
        academicProgress: {
            gpa: 3.8,
            attendance: '95%',
            completedCourses: 12,
            currentSemester: 'Spring 2024'
        }
    };

    useEffect(() => {
        // Simulate API call with dummy data
        setStats(dummyStats);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {user?.firstName || 'Student'}!
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Here's what's happening in your academic journey
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Student ID</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user?.studentId || 'STU2023001'}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {/* Upcoming Exams */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaClipboardList className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Upcoming Exams
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.upcomingExams}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Assignments */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaBook className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Pending Assignments
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.pendingAssignments}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Completed Assignments */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaGraduationCap className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Completed Assignments
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.completedAssignments}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Average Grade */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaChartLine className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Average Grade
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {stats.averageGrade}%
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Upcoming Exams */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium text-gray-900">Upcoming Exams</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {dummyStats.recentExams.map((exam) => (
                                    <li key={exam.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {exam.subject}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(exam.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                {exam.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pending Assignments */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium text-gray-900">Pending Assignments</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {dummyStats.recentAssignments.map((assignment) => (
                                    <li key={assignment.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FaBook className="h-5 w-5 text-gray-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {assignment.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {assignment.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Academic Progress */}
                <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900">Academic Progress</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex items-center">
                                    <FaUserGraduate className="h-6 w-6 text-blue-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">GPA</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            {dummyStats.academicProgress.gpa}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="h-6 w-6 text-green-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Attendance</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            {dummyStats.academicProgress.attendance}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaGraduationCap className="h-6 w-6 text-purple-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            {dummyStats.academicProgress.completedCourses}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaChartLine className="h-6 w-6 text-yellow-400" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500">Current Semester</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            {dummyStats.academicProgress.currentSemester}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard; 