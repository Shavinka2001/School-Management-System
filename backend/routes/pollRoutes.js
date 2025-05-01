const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get polls by class ID
router.get('/class/:classId', async (req, res) => {
  try {
    const polls = await Poll.find({ classId: req.params.classId });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new poll
router.post('/', async (req, res) => {
  const poll = new Poll({
    classId: req.body.classId,
    question: req.body.question,
    type: req.body.type
  });

  try {
    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vote on a poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { rating, studentId } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Validate student ID (optional: you can remove this if student authentication isn't implemented yet)
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    // Check if student has already voted
    if (poll.voters.includes(studentId)) {
      return res.status(400).json({ message: 'Student has already voted on this poll' });
    }
    
    // Update the poll with the new vote
    poll.ratings[rating] += 1;
    poll.voters.push(studentId);
    
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a poll
router.patch('/:id', async (req, res) => {
  try {
    const { question, type } = req.body;
    const updateData = {};
    
    if (question) updateData.question = question;
    if (type) updateData.type = type;
    
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    );
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a poll
router.delete('/:id', async (req, res) => {
  try {
    const result = await Poll.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    res.json({ message: 'Poll deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 