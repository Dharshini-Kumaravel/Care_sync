import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import KPICard from '../common/KPICard';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';
import { Users, Heart, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './DoctorDashboard.css';

function getRiskVariant(r) {
  return r === 'Critical' ? 'critical' : r === 'High' ? 'high' : r === 'Medium' ? 'warning' : 'low';
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { patients, alerts } = useSimulation();
  const navigate = useNavigate();

  const doctor = DOCTORS.find(d => d.id === user?.id) || DOCTORS[0];
  const dept = DEPARTMENTS.find(d => d.id === doctor.dept);
  const deptPatients = patients.filter(p => p.dept === doctor.dept);
  const criticals = deptPatients.filter(p => p.risk === 'Critical');
  const deptAlerts = alerts.filter(a => a.dept === doctor.dept && a.status !== 'Resolved');
  const avgPSI = deptPatients.length ? Math.round(deptPatients.reduce((s, p) => s + p.psi, 0) / deptPatients.length) : 0;

  const psiTrend = Array.from({ length: 10 }, (_, i) => ({ t: `T-${10 - i}`, psi: Math.max(20, Math.min(90, avgPSI + (Math.random() - 0.5) * 20)) }));

  const firstName = user?.name?.split(' ')[1] || 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="doctor-dash">
      <div className="doctor-dash__header">
        <div>
          <h1>{greeting}, {user?.name?.split(' ').slice(0, 2).join(' ')} 👨‍⚕️</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 3 }}>
            {dept?.name} Department · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="doctor-dash__dept-badge" style={{ background: `${dept?.color}15`, color: dept?.color }}>
          {dept?.name}
        </div>
      </div>

      <div className="doctor-dash__kpi-row">
        <KPICard title="Department Patients" value={deptPatients.length} icon={Users} iconColor="#2563EB" className="delay-1" />
        <KPICard title="Critical Patients" value={criticals.length} icon={Heart} iconColor="#EF4444" className="delay-2" />
        <KPICard title="Today's Alerts" value={deptAlerts.length} icon={AlertTriangle} iconColor="#F59E0B" className="delay-3" />
        <KPICard title="Average PSI" value={avgPSI} icon={Activity} iconColor="#22C55E" subtitle="Patient Stability Index" className="delay-4" />
      </div>

      <div className="doctor-dash__grid">
        {/* Patient Table */}
        <Card padding="none" className="doctor-dash__patient-card">
          <div className="doctor-dash__card-header">
            <div>
              <h4>My Patients</h4>
              <p>{deptPatients.length} active in {dept?.name}</p>
            </div>
            <button className="doctor-dash__view-all" onClick={() => navigate('/patients')}>View all</button>
          </div>
          <table className="doctor-dash__table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Bed</th>
                <th>Risk</th>
                <th>PSI</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deptPatients.slice(0, 8).map(p => (
                <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
                  <td>
                    <div className="doctor-dash__patient-name">{p.name}</div>
                    <div className="doctor-dash__patient-id">{p.id} · {p.age}y</div>
                  </td>
                  <td className="doctor-dash__bed">{p.bed}</td>
                  <td><Badge variant={getRiskVariant(p.risk)} size="sm">{p.risk}</Badge></td>
                  <td>
                    <div className="doctor-dash__psi-bar">
                      <div className="doctor-dash__psi-fill" style={{ width: `${p.psi}%`, background: p.psi > 60 ? '#22C55E' : p.psi > 30 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                    <span className="doctor-dash__psi-val">{p.psi}</span>
                  </td>
                  <td><span className={`doctor-dash__status status--${p.status.toLowerCase().replace(/\s/g, '-')}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Right column */}
        <div className="doctor-dash__right">
          {/* Live Alert Feed */}
          <Card padding="none" style={{ minHeight: '300px' }}>
            <div className="doctor-dash__card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Live Alert Feed</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Last 24h · auto-escalating</p>
              </div>
              <button 
                onClick={() => navigate('/alerts')} 
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Open
              </button>
            </div>
            <div className="live-alert-feed-list" style={{ maxHeight: '250px', overflowY: 'auto', padding: '8px 0' }}>
              {deptAlerts.slice(0, 5).map(a => {
                const isCritical = a.severity === 'critical';
                const isWarning = a.severity === 'warning' || a.severity === 'high';
                let variant = 'info';
                if (isCritical) variant = 'critical';
                else if (isWarning) variant = 'warning';
                
                return (
                  <div key={a.id} className="live-alert-feed-item" style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <Badge variant={variant} size="sm">{a.severity.toUpperCase()}</Badge>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>L0 · 2s ago</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {a.patientName} · Bed {a.bed || 'ICU-3'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {a.message}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      Assigned: {a.status === 'Accepted' ? 'Attending Nurse' : '—'}
                    </div>
                  </div>
                );
              })}
              {deptAlerts.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  No active alerts recorded.
                </div>
              )}
            </div>
          </Card>

          {/* Critical Ranking */}
          <Card padding="none">
            <div className="doctor-dash__card-header">
              <div><h4>Critical Cases</h4><p>Highest priority</p></div>
            </div>
            <div className="doctor-dash__critical-list">
              {criticals.slice(0, 5).map((p, i) => (
                <div key={p.id} className="doctor-dash__critical-item" onClick={() => navigate(`/patients/${p.id}`)}>
                  <div className={`doctor-dash__rank rank--${i < 3 ? 'top' : 'normal'}`}>{i + 1}</div>
                  <div className="doctor-dash__critical-info">
                    <div className="doctor-dash__critical-name">{p.name}</div>
                    <div className="doctor-dash__critical-meta">PSI {p.psi} · {p.diagnosis}</div>
                  </div>
                  <Badge variant="critical" dot pulse size="sm">Critical</Badge>
                </div>
              ))}
              {criticals.length === 0 && <div className="doctor-dash__empty">No critical patients 🎉</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
