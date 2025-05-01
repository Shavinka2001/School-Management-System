const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['teacher', 'lesson'],
    required: true
  },
  // Store ratings from 1-5
  ratings: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  },
  // Keep track of students who voted to prevent duplicate votes
  voters: [{
    type: String,  // Student ID or unique identifier
  }],
  // Timestamp for when the poll was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for calculating average rating
pollSchema.virtual('averageRating').get(function() {
  const ratings = this.ratings;
  const totalVotes = Object.values(ratings).reduce((sum, count) => sum + count, 0);
  
  if (totalVotes === 0) return 0;
  
  const weightedSum = 
    (1 * ratings[1]) + 
    (2 * ratings[2]) + 
    (3 * ratings[3]) + 
    (4 * ratings[4]) + 
    (5 * ratings[5]);
  
  return (weightedSum / totalVotes).toFixed(1);
});

// Virtual for calculating total votes
pollSchema.virtual('totalVotes').get(function() {
  return Object.values(this.ratings).reduce((sum, count) => sum + count, 0);
});

module.exports = mongoose.model('Poll', pollSchema); 