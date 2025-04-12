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
    const { subject, grade } = req.query;
    const query = {};
    
    if (subject) {
      query.subject = new RegExp(subject, 'i');
    }
    if (grade) {
      query.grade = grade;
    }
    
    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=assignments-report-${subject || 'all'}-grade${grade || 'all'}.pdf`);
    
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Assignments Report', { align: 'center' });
    doc.moveDown();
    
    // Add filter information
    if (subject || grade) {
      doc.fontSize(14).text('Filter Criteria:', { align: 'center' });
      if (subject) {
        doc.fontSize(12).text(`Subject: ${subject}`, { align: 'center' });
      }
      if (grade) {
        doc.fontSize(12).text(`Grade: ${grade}`, { align: 'center' });
      }
      doc.moveDown();
    }

    if (assignments.length === 0) {
      doc.fontSize(12).text('No assignments found for the selected criteria.');
    } else {
      doc.fontSize(12).text(`Total Assignments: ${assignments.length}`);
      doc.moveDown();
      
      assignments.forEach(assignment => {
        doc.fontSize(12)
          .text(`Title: ${assignment.title}`)
          .text(`Subject: ${assignment.subject}`)
          .text(`Grade: ${assignment.grade}`)
          .text(`Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}`)
          .text(`Status: ${assignment.status}`)
          .text(`Total Marks: ${assignment.totalMarks}`)
          .moveDown();
      });
    }

    doc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

module.exports = {
  getAssignments,
  getTeacherStats,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  generateReport
}; 