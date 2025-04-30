import axios from 'axios';

const API_URL = 'http://localhost:5000/api/exams';

const examService = {
    getAllExams: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch exams');
        }
    },

    createExam: async (examData) => {
        try {
            const response = await axios.post(API_URL, examData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create exam');
        }
    },

    updateExam: async (id, examData) => {
        if (!id) throw new Error('Exam ID is required');
        try {
            const response = await axios.put(`${API_URL}/${id}`, examData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update exam');
        }
    },

    deleteExam: async (id) => {
        if (!id) throw new Error('Exam ID is required');
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete exam');
        }
    }
};

export default examService;