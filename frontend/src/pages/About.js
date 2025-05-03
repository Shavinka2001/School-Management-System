import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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

      {/* About Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">About Smart School</h1>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Smart School is dedicated to revolutionizing educational management through innovative technology. 
              Our platform empowers educational institutions to streamline administrative tasks, enhance 
              communication between teachers, students, and parents, and optimize the learning experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-600 mb-3">Comprehensive Management</h3>
                <p className="text-gray-600">
                  Our platform provides tools for class management, student tracking, attendance, and performance analytics,
                  all in one centralized system.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-600 mb-3">User-Friendly Interface</h3>
                <p className="text-gray-600">
                  Designed with simplicity in mind, our platform is intuitive and accessible for administrators,
                  teachers, and students alike.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-600 mb-3">Data Security</h3>
                <p className="text-gray-600">
                  We prioritize the security of your data with state-of-the-art encryption and privacy measures,
                  ensuring that sensitive information is always protected.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-600 mb-3">Continuous Innovation</h3>
                <p className="text-gray-600">
                  We're committed to continuously improving our platform based on feedback and emerging
                  educational needs.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/register" 
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
              >
                Join Smart School Today
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About; 