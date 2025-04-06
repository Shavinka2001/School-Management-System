import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/admin/Layout';
import ExamManagement from './pages/admin/ExamManagement';
import Dashboard from './pages/admin/Dashboard';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exams" element={<ExamManagement />} />
          <Route path="/schedule" element={<div>Schedule</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;