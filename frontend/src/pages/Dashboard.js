import { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherForm from './TeacherForm';
import TeacherList from './TeacherList';
import { Link } from 'react-router-dom';  
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/teachers?search=${search}`);
        setTeachers(res.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, [search]);

  const activeTeachers = teachers.filter((teacher) => teacher.isActive).length;
  const inactiveTeachers = teachers.length - activeTeachers;

  // Static Chart Data
  const pieData = [
    { name: 'Active', value: activeTeachers },
    { name: 'Inactive', value: inactiveTeachers },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  const barData = [
    { name: 'Math', count: 8 },
    { name: 'Science', count: 5 },
    { name: 'English', count: 7 },
    { name: 'History', count: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold">Teacher Admin</h2>
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-4 rounded hover:bg-blue-600">Dashboard</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-blue-600">Teachers</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-blue-600">Reports</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-blue-600">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard Overview</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-gray-600">Admin</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700">Active Teachers</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">{activeTeachers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <h2 className="text-lg font-semibold text-gray-700">Inactive Teachers</h2>
            <p className="text-3xl font-bold text-red-500 mt-2">{inactiveTeachers}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Teacher Activity Status</h2>
            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Teachers by Subject</h2>
            <BarChart width={400} height={250} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Teacher Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <TeacherForm setTeachers={setTeachers} />
        </div>

        {/* Teacher List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <TeacherList teachers={teachers} setTeachers={setTeachers} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
