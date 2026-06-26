import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterInstitution from './pages/RegisterInstitution';
import ForgotPassword from './pages/ForgotPassword';
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
import AdminSessions from './pages/admin/AdminSessions';
import AdminDepartments from './pages/admin/AdminDepartments';
import LtiSettings from './pages/admin/LtiSettings';
import AdminSupport from './pages/admin/AdminSupport';
import AdminBulkImport from './pages/admin/AdminBulkImport';
import AdminLearningPaths from './pages/admin/AdminLearningPaths';
import AdminBranding from './pages/admin/AdminBranding';
import AdminWebhooks from './pages/admin/AdminWebhooks';
import PaymentSettings from './pages/admin/PaymentSettings';
import StudentPaymentsReview from './pages/admin/StudentPaymentsReview';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import DeepLinkSelector from './pages/lti/DeepLinkSelector';

// Super Admin Imports
import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import SuperAdminBilling from './pages/super-admin/SuperAdminBilling';
import SuperAdminPayments from './pages/super-admin/SuperAdminPayments';
import SuperAdminPlans from './pages/super-admin/SuperAdminPlans';

// Instructor Portal Imports
import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import InstructorStudents from './pages/instructor/InstructorStudents';
import InstructorEarnings from './pages/instructor/InstructorEarnings';
import CurriculumBuilder from './pages/instructor/CurriculumBuilder';
import Gradebook from './pages/instructor/Gradebook';
import QuestionBank from './pages/instructor/QuestionBank';
import LiveClasses from './pages/instructor/LiveClasses';
import InstructorAnnouncements from './pages/instructor/InstructorAnnouncements';

// Student Portal Imports
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CoursePlayer from './pages/student/CoursePlayer';
import StudentLive from './pages/student/StudentLive';
import StudentExplore from './pages/student/StudentExplore';
import StudentAchievements from './pages/student/StudentAchievements';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';
import StudentSupport from './pages/student/StudentSupport';
import StudentLeaderboard from './pages/student/StudentLeaderboard';
import StudentForums from './pages/student/StudentForums';
import StudentChat from './pages/student/StudentChat';
import StudentBilling from './pages/student/StudentBilling';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-institution" element={<RegisterInstitution />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Standard User Routes */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:id/curriculum" element={<AdminCourseCurriculum />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="live-classes" element={<AdminVirtualClassrooms />} />
          <Route path="ai-studio" element={<AdminAIStudio />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="financials" element={<AdminFinancials />} />
          <Route path="payment-settings" element={<PaymentSettings />} />
          <Route path="student-payments-review" element={<StudentPaymentsReview />} />
          <Route path="subscription-management" element={<SubscriptionManagement />} />
          <Route path="instructors" element={<AdminInstructors />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="communications" element={<AdminCommunications />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/import" element={<AdminBulkImport />} />
          <Route path="learning-paths" element={<AdminLearningPaths />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="organization" element={<AdminOrganization />} />
          <Route path="billing" element={<SuperAdminBilling />} />
          <Route path="payments" element={<SuperAdminPayments />} />
          <Route path="saas-plans" element={<SuperAdminPlans />} />
          <Route path="operations" element={<AdminOperations />} />
          <Route path="branding" element={<AdminBranding />} />
          <Route path="webhooks" element={<AdminWebhooks />} />
          <Route path="lti-integrations" element={<LtiSettings />} />
        </Route>

        {/* LTI Selector Route (No Layout - Loads in LMS iFrame) */}
        <Route path="/lti/selector" element={<DeepLinkSelector />} />

        {/* Instructor Portal Routes */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="courses/:id/curriculum" element={<CurriculumBuilder />} />
          <Route path="courses/:id/gradebook" element={<Gradebook />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="earnings" element={<InstructorEarnings />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="announcements" element={<InstructorAnnouncements />} />
        </Route>

        {/* Student Portal Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="catalog" element={<StudentExplore />} /> 
          <Route path="my-courses" element={<StudentDashboard />} /> 
          <Route path="live" element={<StudentLive />} />
          <Route path="achievements" element={<StudentAchievements />} />
          <Route path="leaderboard" element={<StudentLeaderboard />} />
          <Route path="forums" element={<StudentForums />} />
          <Route path="chat" element={<StudentChat />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="support" element={<StudentSupport />} />
          <Route path="billing" element={<StudentBilling />} />
        </Route>
        
        {/* Fullscreen Player Route */}
        <Route path="/student/player/:id" element={<CoursePlayer />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
