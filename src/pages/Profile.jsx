import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import Card, { CardHeader } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { User, Mail, Shield, ShieldCheck, Calendar, Activity, Clock, Building2 } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const { patients } = useSimulation();

  // Find some relevant stats based on role
  const assignedCount = user?.role === 'Nurse' 
    ? patients.filter(p => p.nurse === user.id).length
    : user?.role === 'Doctor'
      ? patients.filter(p => p.doctor === user.id).length
      : patients.length;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="profile-page animate-fade-in-up">
      <div className="profile-page__header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Personal credentials and active roster parameters</p>
        </div>
        <Badge variant={user?.role === 'Admin' ? 'primary' : user?.role === 'Doctor' ? 'warning' : 'success'} dot pulse>
          Session Active
        </Badge>
      </div>

      <div className="profile-layout">
        {/* User Card */}
        <Card padding="md" className="profile-card">
          <div className="profile-card__avatar">
            {initials}
          </div>
          <h2 className="profile-card__name">{user?.name}</h2>
          <p className="profile-card__role">{user?.role} Portal</p>
          <div className="profile-card__divider" />
          <div className="profile-card__meta">
            <div className="profile-meta-row">
              <Mail size={15} />
              <span>{user?.email}</span>
            </div>
            <div className="profile-meta-row">
              <Shield size={15} />
              <span>ID: {user?.id}</span>
            </div>
            {user?.status && (
              <div className="profile-meta-row">
                <Clock size={15} />
                <span>Duty Status: <strong>{user.status}</strong></span>
              </div>
            )}
          </div>
        </Card>

        {/* Details Card */}
        <Card padding="md" className="profile-details">
          <CardHeader title="Clinical Profile Details" subtitle="Active clinical settings" icon={ShieldCheck} iconColor="var(--color-primary)" />
          <div className="profile-details__grid">
            <div className="profile-detail-item">
              <span className="p-label">Monitored Ward Coverage</span>
              <strong className="p-val">{user?.role === 'Admin' ? 'All Wards' : 'Cardiology / ICU Wards'}</strong>
            </div>
            <div className="profile-detail-item">
              <span className="p-label">Active Roster Patients</span>
              <strong className="p-val">{assignedCount} Patients</strong>
            </div>
            <div className="profile-detail-item">
              <span className="p-label">Roster Shift Type</span>
              <strong className="p-val">{user?.role === 'Nurse' ? 'Morning ICU Shift' : 'General Day Roster'}</strong>
            </div>
            <div className="profile-detail-item">
              <span className="p-label">Session Authentication</span>
              <strong className="p-val">MFA Secured (HIPAA Compliant)</strong>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-primary-light)', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Building2 size={20} color="var(--color-primary)" />
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Registered Clinic Site: <strong>AIIMS Command Site-4</strong>. Clinical logs are cryptographically hashed and appended to the hospital audit stream.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
