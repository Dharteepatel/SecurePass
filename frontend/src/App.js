import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import VerifyOtpPage   from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage   from './pages/DashboardPage';
import ProfilePage     from './pages/ProfilePage';
import SettingsPage    from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f' }}>
      <div style={{ color:'#818cf8', fontSize:'16px' }}>Loading SecurePass...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="/verify-email"    element={<GuestRoute><VerifyOtpPage /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
              <Route path="/"                element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile"         element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings"        element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*"               element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
