const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const teachersDir = path.join(uploadsDir, 'teachers');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(teachersDir)) {
  fs.mkdirSync(teachersDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/assignments', assignmentRoutes);
app.use('/api/teachers', teacherRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart School API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 