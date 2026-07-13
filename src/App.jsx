import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';
import { NotificationProvider } from './context/NotificationContext';
import AppLayout from './components/layout/AppLayout';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Doctors from './pages/Doctors';
import Nurses from './pages/Nurses';
import Departments from './pages/Departments';
import CriticalPatients from './pages/CriticalPatients';
import Alerts from './pages/Alerts';
import BedManagement from './pages/BedManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import AIInsights from './pages/AIInsights';
import Notes from './pages/Notes';
import Observations from './pages/Observations';
import DutyStatus from './pages/DutyStatus';
import Profile from './pages/Profile';
import './styles/global.css';
import './styles/animations.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/assigned-patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/nurses" element={<Nurses />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/critical" element={<CriticalPatients />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/beds" element={<BedManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/observations" element={<Observations />} />
              <Route path="/duty-status" element={<DutyStatus />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SimulationProvider>
            <AppRoutes />
          </SimulationProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
