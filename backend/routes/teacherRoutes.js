const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  login,
  upload
} = require('../controllers/teacherController');

// Routes
router.get('/', getTeachers);
router.get('/:id', getTeacher);
router.post('/', upload.single('photo'), createTeacher);
router.put('/:id', upload.single('photo'), updateTeacher);
router.delete('/:id', deleteTeacher);
router.post('/login', login);

module.exports = router; 