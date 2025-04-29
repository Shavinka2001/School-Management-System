import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/Student/StudentDashboard";
import Assignments from "./pages/Student/Assignments";
import Attendance from "./pages/Student/Attendance";
import Notifications from "./pages/Student/Notifications";
import Profile from "./pages/Student/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Assignments Page */}
        <Route path="/student/assignments" element={<Assignments />} />

        {/* Attendance Page */}
        <Route path="/student/attendance" element={<Attendance />} />

        {/* Notifications Page */}
        <Route path="/student/notifications" element={<Notifications />} />

        {/* Profile Page */}
        <Route path="/student/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;