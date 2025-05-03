import { useState } from 'react';
import axios from 'axios';

const TeacherForm = ({ setTeachers }) => {
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    phone: false,
  });

  const validateForm = () => {
    if (!teacher.name.trim()) return 'Name is required.';
    if (!teacher.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Valid email is required.';
    if (!teacher.subject.trim()) return 'Subject is required.';
    if (!teacher.phone.match(/^\+?\d{10,15}$/)) return 'Valid phone number is required.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/teachers', teacher);
      setTeachers((prev) => [...prev, res.data]);
      setTeacher({ name: '', email: '', subject: '', phone: '' });
      setTouched({ name: false, email: false, subject: false, phone: false });
      setError('');
    } catch (error) {
      setError('Error adding teacher. Please check the input fields.');
    }
  };

  return (
    <div className="form-container bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto my-10 border border-gray-100">
      <style jsx>{`
        .form-container {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .error-message {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .button-hover {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .button-hover:hover {
          transform: translateY(-2px);
        }
      `}</style>
      <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Add New Teacher</h2>
      {error && (
        <p className="error-message text-red-600 bg-red-50 p-3 rounded-lg mb-6 text-sm text-center">{error}</p>
      )}
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={teacher.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`w-full p-3 border ${
              touched.name && !teacher.name.trim()
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm placeholder-gray-400`}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={teacher.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full p-3 border ${
              touched.email && !teacher.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm placeholder-gray-400`}
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={teacher.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className={`w-full p-3 border ${
              touched.subject && !teacher.subject.trim()
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm placeholder-gray-400`}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={teacher.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={`w-full p-3 border ${
              touched.phone && !teacher.phone.match(/^\+?\d{10,15}$/)
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm placeholder-gray-400`}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="button-hover w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium shadow-md"
        >
          Add Teacher
        </button>
      </div>
    </div>
  );
};

export default TeacherForm;