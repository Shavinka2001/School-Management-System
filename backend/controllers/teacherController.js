const Teacher = require('../models/Teacher');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'teachers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all teachers with search functionality
exports.getTeachers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Get single teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !subject || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    let photo = '';
    if (req.file) {
      photo = `/uploads/teachers/${req.file.filename}`;
    }

    const teacher = new Teacher({
      name,
      email,
      phone,
      subject,
      password,
      photo
    });

    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    // If there was a file uploaded but teacher creation failed, delete the file
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(400).json({ 
      message: 'Error creating teacher', 
      error: error.message,
      details: error.errors
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, password } = req.body;
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.phone = phone || teacher.phone;
    teacher.subject = subject || teacher.subject;
    if (password) {
      teacher.password = password;
    }

    // Update photo if new one is uploaded
    if (req.file) {
      // Delete old photo if exists
      if (teacher.photo) {
        const oldPhotoPath = path.join(__dirname, '..', teacher.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      teacher.photo = `/uploads/teachers/${req.file.filename}`;
    }

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    // If there was a file uploaded but update failed, delete the file
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(400).json({ 
      message: 'Error updating teacher', 
      error: error.message,
      details: error.errors
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete photo if exists
    if (teacher.photo) {
      const photoPath = path.join(__dirname, '..', teacher.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Teacher.deleteOne({ _id: req.params.id });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ 
      message: 'Error deleting teacher', 
      error: error.message 
    });
  }
};

// Teacher login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Validate required fields
    if (!email || !password) {
      console.log('Missing fields:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    console.log('Found teacher:', teacher ? 'Yes' : 'No');

    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password (in a real app, you would hash the password)
    if (teacher.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return teacher data (excluding password)
    const { password: _, ...teacherData } = teacher.toObject();
    console.log('Login successful for:', teacherData.name);
    res.json(teacherData);
  } catch (error) {
    console.error('Error during teacher login:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
};

// Export upload middleware
exports.upload = upload; 