const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getTeacherStats,
  generateReport
} = require('../controllers/assignmentController');

// Optional: Add authentication middleware
// const { protect, teacher } = require('../middleware/authMiddleware');

// Routes
router.get('/', getAssignments);
router.get('/stats', getTeacherStats);
router.get('/report', generateReport);
router.get('/:id', getAssignment);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router; 