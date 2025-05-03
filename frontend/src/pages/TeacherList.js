import { useState } from 'react';
import axios from 'axios';

const TeacherList = ({ teachers, setTeachers }) => {
  const [editTeacher, setEditTeacher] = useState(null);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
      setError('');
    } catch (error) {
      setError('Error deleting teacher.');
    }
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/teachers/${editTeacher._id}`,
        editTeacher
      );
      setTeachers(
        teachers.map((t) => (t._id === editTeacher._id ? res.data : t))
      );
      setEditTeacher(null);
      setError('');
    } catch (error) {
      setError('Error updating teacher. Please check the input fields.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/teachers/toggle-status/${id}`);
      setTeachers(
        teachers.map((t) => (t._id === id ? res.data : t))
      );
      setError('');
    } catch (error) {
      setError('Error toggling teacher status.');
    }
  };

  const handleChange = (e) => {
    setEditTeacher({ ...editTeacher, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher List</h2>
      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-md mb-6">{error}</p>
      )}
      {editTeacher && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Teacher</h3>
          <div className="grid gap-4">
            <input
              type="text"
              name="name"
              value={editTeacher.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="email"
              name="email"
              value={editTeacher.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              name="subject"
              value={editTeacher.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              name="phone"
              value={editTeacher.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update
              </button>
              <button
                onClick={() => setEditTeacher(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Subject</th>
              <th className="p-4 text-left font-semibold">Phone</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-t">{teacher.name}</td>
                  <td className="p-4 border-t">{teacher.email}</td>
                  <td className="p-4 border-t">{teacher.subject}</td>
                  <td className="p-4 border-t">{teacher.phone}</td>
                  <td className="p-4 border-t">
                    {teacher.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="p-4 border-t flex gap-2">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleStatus(teacher._id)}
                      className={`px-3 py-1 rounded-lg text-white ${
                        teacher.isActive
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } transition duration-200`}
                    >
                      {teacher.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;