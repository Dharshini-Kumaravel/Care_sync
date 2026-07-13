import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';
import NurseDashboard from '../components/dashboard/NurseDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'Doctor') return <DoctorDashboard />;
  if (user?.role === 'Nurse') return <NurseDashboard />;
  return <AdminDashboard />;
}
