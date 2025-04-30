const Exam = require('../models/examModel');

// Get all exams
exports.getExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ date: 1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new exam
exports.createExam = async (req, res) => {
    try {
        const exam = new Exam(req.body);
        const savedExam = await exam.save();
        res.status(201).json(savedExam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update exam
exports.updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true 
        });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete exam
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};