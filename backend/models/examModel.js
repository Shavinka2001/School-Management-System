const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true,
        maxLength: 100
    },
    duration: {
        type: String,
        required: true,
        maxLength: 50
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);