import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Students from '@/pages/admin/Students';
import Teachers from '@/pages/admin/Teachers';
import Courses from '@/pages/admin/Courses';
import Groups from '@/pages/admin/Groups';
import Payments from '@/pages/admin/Payments';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import Reports from '@/pages/admin/Reports';
import Rooms from '@/pages/admin/Rooms';
import Attendance from '@/pages/teacher/Attendance';
import Profile from '@/pages/Profile';
import Notifications from '@/pages/Notification';
import Library from '@/pages/Library';
import Exams from '@/pages/Exams';
import SettingsPage from '@/pages/Settings';
import HelpCenter from '@/pages/HelpSenter';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route element={<DashboardLayout role="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/courses" element={<Courses />} />
          <Route path="/admin/groups" element={<Groups />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/rooms" element={<Rooms />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
        <Route element={<DashboardLayout role="TEACHER" />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<Attendance />} />
        </Route>
        <Route element={<DashboardLayout role="STUDENT" />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/library" element={<Library />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App