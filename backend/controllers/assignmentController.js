const Assignment = require('../models/Assignment');
const PDFDocument = require('pdfkit');

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const { grade } = req.query;
    const query = grade && grade !== 'all' ? { grade } : {};
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher stats
exports.getTeacherStats = async (req, res) => {
  try {
    const totalAssignments = await Assignment.countDocuments();
    const completedAssignments = await Assignment.countDocuments({ status: 'completed' });
    const pendingReview = await Assignment.countDocuments({ status: 'pending' });

    res.json({
      totalAssignments,
      completed: completedAssignments,
      pendingReview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      // createdBy: req.user._id // Uncomment when authentication is implemented
    });
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Optional: Check if the teacher is the owner of the assignment
    // if (assignment.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to update this assignment' });
    // }

    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Optional: Check if the teacher is the owner of the assignment
    // if (assignment.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    // }

    await Assignment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate teacher report
exports.generateReport = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    
    // Create a PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=teacher-report.pdf');
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to the PDF
    doc.fontSize(20).text('Teacher Report', { align: 'center' });
    doc.moveDown();
    
    // Add stats section
    doc.fontSize(16).text('Statistics', { underline: true });
    doc.moveDown();
    
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    
    doc.fontSize(12).text(`Total Assignments: ${totalAssignments}`);
    doc.text(`Completed Assignments: ${completedAssignments}`);
    doc.text(`Pending Assignments: ${pendingAssignments}`);
    doc.moveDown();
    
    // Add assignments list
    doc.fontSize(16).text('Assignments List', { underline: true });
    doc.moveDown();
    
    assignments.forEach((assignment, index) => {
      doc.fontSize(12).text(`${index + 1}. ${assignment.title}`);
      doc.fontSize(10).text(`   Grade: ${assignment.grade}`);
      doc.text(`   Subject: ${assignment.subject}`);
      doc.text(`   Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}`);
      doc.text(`   Status: ${assignment.status === 'completed' ? 'Completed' : 'Pending Review'}`);
      doc.moveDown();
    });
    
    // Finalize the PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 