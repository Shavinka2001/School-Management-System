import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'teacher'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
        // Admin login validation
        if (formData.username === 'imash' && formData.password === 'imash') {
          localStorage.setItem('userType', 'admin');
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/admin/teachers');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        // Teacher login
        const response = await axios.post('http://localhost:5000/api/teachers/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data) {
          localStorage.setItem('userType', 'teacher');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('teacherId', response.data._id);
          navigate('/teacher/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => {
                setLoginType('admin');
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className={`px-4 py-2 rounded-md ${
                loginType === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Admin Login
            </button>
            <button
              onClick={() => {
                setLoginType('teacher');
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className={`px-4 py-2 rounded-md ${
                loginType === 'teacher'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Teacher Login
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {loginType === 'admin' ? 'Admin Login' : 'Teacher Login'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === 'admin' ? (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 