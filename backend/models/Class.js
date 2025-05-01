const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  numberOfStudents: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema); 