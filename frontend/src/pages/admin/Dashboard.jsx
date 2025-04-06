import { useState, useEffect } from 'react';
import { FaUsers, FaBook, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChartBar, FaEllipsisV } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Sample data with more refined color palette
    const stats = [
        { id: 1, title: 'Total Students', value: '2,500', icon: FaUsers, color: 'from-blue-500 to-blue-600' },
        { id: 2, title: 'Total Exams', value: '48', icon: FaBook, color: 'from-indigo-500 to-indigo-600' },
        { id: 3, title: 'Upcoming Exams', value: '12', icon: FaCalendarAlt, color: 'from-purple-500 to-purple-600' },
        { id: 4, title: 'Recent Activity', value: '24', icon: FaClock, color: 'from-gray-500 to-gray-600' }
    ];

    const examData = [
        { subject: 'Mathematics', students: 120 },
        { subject: 'Physics', students: 98 },
        { subject: 'Chemistry', students: 86 },
        { subject: 'Biology', students: 99 },
        { subject: 'English', students: 85 },
    ];

    const recentExams = [
        { id: 1, subject: 'Mathematics', date: '2024-04-10', time: '09:00 AM', venue: 'Hall A' },
        { id: 2, subject: 'Physics', date: '2024-04-12', time: '10:30 AM', venue: 'Lab 101' },
        { id: 3, subject: 'Chemistry', date: '2024-04-15', time: '02:00 PM', venue: 'Hall B' },
    ];

    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(currentDate);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header with welcome message */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back, Admin!</h1>
                    <p className="text-gray-500">{formattedDate}</p>
                </div>

            </motion.div>

            {/* Stats Grid with refined styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-full bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-emerald-500 text-sm font-medium">+12% </span>
                            <span className="text-gray-400 text-sm ml-1">from last month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts and Recent Activity with refined styling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaChartBar className="text-indigo-500" />
                            Exam Statistics
                        </h2>
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                            <FaEllipsisV size={16} />
                        </button>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={examData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="subject" stroke="#666" axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                    }}
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                                />
                                <Bar
                                    dataKey="students"
                                    fill="url(#colorGradient)"
                                    radius={[8, 8, 0, 0]}
                                    barSize={40}
                                />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4338CA" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#6366F1" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Upcoming Exams with refined styling */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-500" />
                            Upcoming Exams
                        </h2>
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                            <FaEllipsisV size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentExams.map((exam, index) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
                                transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                                className="p-4 rounded-xl bg-white hover:bg-indigo-50 transition-all duration-300 border border-gray-100"
                            >
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <FaBook className="text-indigo-500 w-4 h-4" />
                                    {exam.subject}
                                </h3>
                                <div className="mt-3 space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaCalendarAlt className="w-3.5 h-3.5 text-indigo-500" />
                                        {exam.date}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaClock className="w-3.5 h-3.5 text-indigo-500" />
                                        {exam.time}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaMapMarkerAlt className="w-3.5 h-3.5 text-indigo-500" />
                                        {exam.venue}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoaded ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: 0.9 }}
                            className="w-full mt-4 py-2.5 text-center text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
                        >
                            View All Exams
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
