import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCourseCurriculum from './pages/admin/AdminCourseCurriculum';
import AdminVirtualClassrooms from './pages/admin/AdminVirtualClassrooms';
import AdminAIStudio from './pages/admin/AdminAIStudio';
import AdminAssessments from './pages/admin/AdminAssessments';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFinancials from './pages/admin/AdminFinancials';
import AdminInstructors from './pages/admin/AdminInstructors';
import AdminLibrary from './pages/admin/AdminLibrary';
import AdminCommunications from './pages/admin/AdminCommunications';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminOperations from './pages/admin/AdminOperations';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminSettings from './pages/admin/AdminSettings';
import AdminOrganization from './pages/admin/AdminOrganization';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Standard User Routes */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="organization" element={<AdminOrganization />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:id/curriculum" element={<AdminCourseCurriculum />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="live-classes" element={<AdminVirtualClassrooms />} />
          <Route path="ai-studio" element={<AdminAIStudio />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="financials" element={<AdminFinancials />} />
          <Route path="instructors" element={<AdminInstructors />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="communications" element={<AdminCommunications />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="operations" element={<AdminOperations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
