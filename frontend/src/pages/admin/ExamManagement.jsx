import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaDownload } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from 'axios';
import Dashboard from '../../components/admin/Dashboard';

// === BACKEND SERVICES ===
const API_URL = 'http://localhost:5000/api/exams';

const examService = {
    getAllExams: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    createExam: async (examData) => {
        const response = await axios.post(API_URL, examData);
        return response.data;
    },
    updateExam: async (id, examData) => {
        const response = await axios.put(`${API_URL}/${id}`, examData);
        return response.data;
    },
    deleteExam: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

const ExamManagement = () => {
    const today = new Date().toISOString().split('T')[0];

    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        subject: '', date: '', time: '', venue: '', duration: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, examId: null });

    // === INPUT VALIDATIONS ===
    const handleSubjectKeyDown = (e) => {
        if (!/^[a-zA-Z0-9 ]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    const handleVenueKeyDown = (e) => {
        if (!/^[a-zA-Z0-9 -.]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    const handleDurationKeyDown = (e) => {
        if (!/^[0-9hrmHRM ]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
        }
    };

    const validateDuration = (value) => {
        const pattern = /^(\d+\s*(hour|hr|h|minute|min|m)s?\s*)+$/i;
        return pattern.test(value);
    };

    // === FETCH EXAMS ON MOUNT ===
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await examService.getAllExams();
                setExams(data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };
        fetchExams();
    }, []);

    // === HANDLE FORM SUBMIT ===
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentExam) {
                const updated = await examService.updateExam(currentExam._id, formData);
                setExams(exams.map(exam => exam._id === currentExam._id ? updated : exam));
            } else {
                const created = await examService.createExam(formData);
                setExams([...exams, created]);
            }
            setShowModal(false);
            setCurrentExam(null);
            setFormData({ subject: '', date: '', time: '', venue: '', duration: '' });
        } catch (err) {
            console.error("Error saving exam:", err);
        }
    };

    const handleEdit = (exam) => {
        setCurrentExam(exam);
        setFormData(exam);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setDeleteConfirm({ show: true, examId: id });
    };

    const confirmDelete = async () => {
        try {
            await examService.deleteExam(deleteConfirm.examId);
            setExams(exams.filter(exam => exam._id !== deleteConfirm.examId));
            setDeleteConfirm({ show: false, examId: null });
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    };

    // === DOWNLOAD PDF ===
    const downloadTimetable = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Exam Timetable", 14, 16);
        const headers = ['Subject', 'Date', 'Time', 'Venue', 'Duration'];
        const body = exams.map(e => [e.subject, e.date, e.time, e.venue, e.duration]);
        autoTable(doc, {
            head: [headers],
            body,
            startY: 25,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 3
            }
        });
        doc.save(`exam-timetable-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const filteredExams = exams.filter(exam =>
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Exam Management</h2>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setCurrentExam(null);
                                setFormData({ subject: '', date: '', time: '', venue: '', duration: '' });
                                setShowModal(true);
                            }}
                            className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            <FaPlus />New Exam
                        </button>
                        <button
                            onClick={downloadTimetable}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            <FaDownload />Timetable
                        </button>
                    </div>
                </div>
            </div>

            <Dashboard exams={exams} />

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Venue</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredExams.map((exam) => (
                                <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{exam.subject}</td>
                                    <td className="px-6 py-4">{exam.date}</td>
                                    <td className="px-6 py-4">{exam.time}</td>
                                    <td className="px-6 py-4">{exam.venue}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-7">
                                            <button
                                                onClick={() => handleEdit(exam)}
                                                className="text-blue-900 cursor-pointer transition-colors"
                                            >
                                                <FaEdit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id)}
                                                className="text-red-900 cursor-pointer transition-colors"
                                            >
                                                <FaTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {currentExam ? 'Edit Exam' : 'Add New Exam'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    onKeyDown={handleSubjectKeyDown}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    maxLength={50}
                                    required
                                    placeholder="Enter subject name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    min={today}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    onKeyDown={handleVenueKeyDown}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    maxLength={100}
                                    required
                                    placeholder="Enter venue location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData({ ...formData, duration: value });
                                    }}
                                    onKeyDown={handleDurationKeyDown}
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${!formData.duration || validateDuration(formData.duration)
                                            ? 'border-gray-300'
                                            : 'border-red-500'}`}
                                    maxLength={50}
                                    required
                                    placeholder="e.g., 2 hours 30 minutes"
                                />
                                <span className="text-xs text-gray-500 mt-1 block">
                                    Enter duration in hours and/or minutes (e.g., "2 hours", "30 minutes", "1 hour 30 minutes")
                                </span>
                                {formData.duration && !validateDuration(formData.duration) && (
                                    <span className="text-xs text-red-500 mt-1 block">
                                        Please enter a valid duration format
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer"
                                >
                                    {currentExam ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FaTrash className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this exam? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, examId: null })}
                                    className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 cursor-pointer"
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-900 text-white rounded-lg cursor-pointer"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;