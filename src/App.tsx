import { lazy, Suspense } from 'react';
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
import HelpCenter from '@/pages/HelpSenter';
const Login = lazy(() => import('@/pages/Login'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const Students = lazy(() => import('@/pages/admin/Students'));
const Teachers = lazy(() => import('@/pages/admin/Teachers'));
const Courses = lazy(() => import('@/pages/admin/Courses'));
const Groups = lazy(() => import('@/pages/admin/Groups'));
const Payments = lazy(() => import('@/pages/admin/Payments'));
const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'));
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const Rooms = lazy(() => import('@/pages/admin/Rooms'));
const Attendance = lazy(() => import('@/pages/teacher/Attendance'));
const Profile = lazy(() => import('@/pages/Profile'));
const Notifications = lazy(() => import('@/pages/Notification'));
const Library = lazy(() => import('@/pages/Library'));
const Exams = lazy(() => import('@/pages/Exams'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

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
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>}>
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
    </Suspense>
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