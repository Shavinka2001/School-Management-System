import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiUser, FiMail, FiCalendar, FiBook, FiAward } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import Swal from 'sweetalert2';

function StudentProfile() {
    const { user, updateUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    // Dummy student data
    const dummyStudentData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.com',
        phone: '+1 234 567 8900',
        address: '123 Education Street, Learning City',
        studentId: 'STU2023001',
        enrollmentDate: '2023-09-01',
        currentClasses: ['Mathematics', 'Physics', 'Chemistry', 'English'],
        academicProgress: {
            gpa: 3.8,
            attendance: '95%',
            completedAssignments: 45,
            pendingAssignments: 5
        }
    };

    useEffect(() => {
        if (user) {
            setEditData({
                firstName: user.firstName || dummyStudentData.firstName,
                lastName: user.lastName || dummyStudentData.lastName,
                email: user.email || dummyStudentData.email,
                phone: user.phone || dummyStudentData.phone,
                address: user.address || dummyStudentData.address
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveProfile = async () => {
        try {
            const result = await updateUser(editData);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been updated successfully!',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsEditing(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: result.error || 'Failed to update profile. Please try again.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating your profile.'
            });
        }
    };

    const startEditing = () => {
        setEditData({
            firstName: user?.firstName || dummyStudentData.firstName,
            lastName: user?.lastName || dummyStudentData.lastName,
            email: user?.email || dummyStudentData.email,
            phone: user?.phone || dummyStudentData.phone,
            address: user?.address || dummyStudentData.address
        });
        setIsEditing(true);
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-blue-200 h-48 relative">
                        <div className="absolute -bottom-16 left-6">
                            <div className="relative">
                                <FaUserCircle className="h-32 w-32 text-gray-400 border-4 border-white rounded-full shadow-2xl" />
                                <button
                                    onClick={startEditing}
                                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                                >
                                    <FiEdit className="text-black" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-6 pb-6">
                        {!isEditing ? (
                            <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {user?.firstName || dummyStudentData.firstName} {user?.lastName || dummyStudentData.lastName}
                                        </h1>
                                        <div className="flex items-center mt-2 text-gray-600">
                                            <FiMail className="mr-2" />
                                            <p>{user?.email || dummyStudentData.email}</p>
                                        </div>
                                        <div className="flex items-center mt-1 text-gray-600">
                                            <FiUser className="mr-2" />
                                            <p>{user?.phone || dummyStudentData.phone}</p>
                                        </div>
                                        <p className="mt-1 text-gray-600">{user?.address || dummyStudentData.address}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => navigate('/student/exams')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center cursor-pointer hover:bg-blue-700"
                                        >
                                            <FiCalendar className="mr-2" />
                                            View Exams
                                        </button>
                                        <button
                                            onClick={() => navigate('/student/assignments')}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center cursor-pointer hover:bg-blue-700"
                                        >
                                            <FiAward className="mr-2" />
                                            View Assignments
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            disabled
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={editData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveProfile}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Academic Information Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Academic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <FiBook className="text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold">Current Classes</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {dummyStudentData.currentClasses.map((className, index) => (
                                            <li key={index} className="text-gray-600">{className}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <FiAward className="text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold">Academic Progress</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">GPA: {dummyStudentData.academicProgress.gpa}</p>
                                        <p className="text-gray-600">Attendance: {dummyStudentData.academicProgress.attendance}</p>
                                        <p className="text-gray-600">Completed Assignments: {dummyStudentData.academicProgress.completedAssignments}</p>
                                        <p className="text-gray-600">Pending Assignments: {dummyStudentData.academicProgress.pendingAssignments}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfile; 