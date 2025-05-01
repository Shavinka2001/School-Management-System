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

  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/teachers', teacher);
      setTeachers((prev) => [...prev, res.data]);
      setTeacher({ name: '', email: '', subject: '', phone: '' });
      setError('');
    } catch (error) {
      setError('Error adding teacher. Please check the input fields.');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <input
          type="text"
          name="name"
          value={teacher.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={teacher.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="subject"
          value={teacher.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="phone"
          value={teacher.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
        >
          Add Teacher
        </button>
      </div>
    </div>
  );
};

export default TeacherForm;