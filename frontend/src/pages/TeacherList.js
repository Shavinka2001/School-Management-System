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
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Teacher List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {editTeacher && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Edit Teacher</h3>
          <div>
            <input
              type="text"
              name="name"
              value={editTeacher.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={editTeacher.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="subject"
              value={editTeacher.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="phone"
              value={editTeacher.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition duration-200"
            >
              Update
            </button>
            <button
              onClick={() => setEditTeacher(null)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No teachers found
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="border p-2">{teacher.name}</td>
                <td className="border p-2">{teacher.email}</td>
                <td className="border p-2">{teacher.subject}</td>
                <td className="border p-2">{teacher.phone}</td>
                <td className="border p-2">
                  {teacher.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleStatus(teacher._id)}
                    className={`px-2 py-1 rounded text-white ${
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
  );
};

export default TeacherList;