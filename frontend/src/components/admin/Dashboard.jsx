// === ADD THESE IMPORTS AT THE TOP ===
import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FaCalendarAlt, FaClipboardList, FaUsers } from 'react-icons/fa';

// === DASHBOARD COMPONENT ===
const Dashboard = ({ exams }) => {
    // Calculate metrics
    const totalExams = exams.length;
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;
    const completedExams = totalExams - upcomingExams;

    // Participation data (you'll need to add this field to your exam model)
    const participationData = exams.map(exam => ({
        subject: exam.subject,
        participation: exam.participants || 0 // Add participants field to your exam schema
    }));

    // Exam status data for pie chart
    const statusData = [
        { name: 'Upcoming', value: upcomingExams },
        { name: 'Completed', value: completedExams }
    ];

    // Color scheme
    const COLORS = ['#FF6B6B', '#4ECDC4'];

    return (
        <div className="mb-12 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Exam Analytics</h3>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 p-6 rounded-lg flex items-center">
                    <FaClipboardList className="text-indigo-600 text-3xl mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Total Exams</p>
                        <p className="text-2xl font-bold text-gray-800">{totalExams}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg flex items-center">
                    <FaCalendarAlt className="text-blue-600 text-3xl mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Upcoming Exams</p>
                        <p className="text-2xl font-bold text-gray-800">{upcomingExams}</p>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg flex items-center">
                    <FaUsers className="text-green-600 text-3xl mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Avg Participation</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {exams.length ?
                                Math.round(exams.reduce((a, b) => a + (b.participants || 0), 0) / exams.length) : 0}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4">Exam Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold mb-4">Participation Rate</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={participationData}>
                            <Bar dataKey="participation" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

