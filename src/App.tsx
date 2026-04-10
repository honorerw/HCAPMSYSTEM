import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Records from './pages/Records';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && user) {
    const redirectPath = user.role === 'admin' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      
      <Route path="/signup" element={
        <PublicRoute><Signup /></PublicRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="records" element={<Records />} />
      </Route>
      
      {/* Doctor Routes */}
      <Route path="/doctor-dashboard" element={
        <ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>
      } />
      
      {/* Patient Routes */}
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>
      } />
      
      {/* Shared routes accessible by all authenticated users - standalone without Layout */}
      <Route path="/patients" element={
        <ProtectedRoute allowedRoles={['admin', 'doctor']}><Patients /></ProtectedRoute>
      } />
      <Route path="/doctors" element={
        <ProtectedRoute allowedRoles={['admin', 'patient']}><Doctors /></ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}><Appointments /></ProtectedRoute>
      } />
      <Route path="/records" element={
        <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}><Records /></ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;