import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400">
      {/* Navigation */}
      <header className="w-full p-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Smart School</Link>
        <nav className="flex items-center gap-8">
          <Link to="/" className="text-white hover:text-white/80">Home</Link>
          <Link to="/about" className="text-white hover:text-white/80">About Us</Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 bg-white text-indigo-600 rounded-md hover:bg-opacity-90 transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-6">Welcome to Smart School</h1>
        <p className="text-xl text-white mb-12 max-w-2xl">
          The future of education is here. Manage your school efficiently with our
          comprehensive management system.
        </p>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-8 py-3 bg-white text-indigo-600 rounded-md font-medium hover:bg-opacity-90 transition"
          >
            Get Started
          </Link>
          <Link 
            to="/about" 
            className="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">Key Features</h2>
          <p className="text-gray-600 text-center mb-12">Everything you need to manage your school effectively</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Class Management</h3>
              <p className="text-gray-600">Easily manage classes, schedules, and academic content</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Records</h3>
              <p className="text-gray-600">Keep detailed student records and track their progress</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track and analyze school performance with detailed reports</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 