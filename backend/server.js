const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logging

// Serve static files from uploads directory (lowercase)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug environment variables
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Port:', process.env.PORT || 5000);

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart School API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

