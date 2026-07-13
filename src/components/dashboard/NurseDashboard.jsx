import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import KPICard from '../common/KPICard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Users, AlertTriangle, Clock, Activity } from 'lucide-react';
import { NURSES, DEPARTMENTS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import './NurseDashboard.css';

function getRiskVariant(r) { return r === 'Critical' ? 'critical' : r === 'High' ? 'high' : r === 'Medium' ? 'warning' : 'low'; }

const TASKS = [
  { id: 1, task: 'Administer morning medication – P003', done: true, time: '08:00' },
  { id: 2, task: 'Vitals check – ICU-Bed-7', done: true, time: '09:30' },
  { id: 3, task: 'Blood draw – Kiran Kumar', done: false, time: '11:00' },
  { id: 4, task: 'Dressing change – P001', done: false, time: '12:00' },
  { id: 5, task: 'Doctor rounds assist – ICU', done: false, time: '14:00' },
];

export default function NurseDashboard() {
  const { user } = useAuth();
  const { patients, alerts } = useSimulation();
  const navigate = useNavigate();

  const nurse = NURSES.find(n => n.id === user?.id) || NURSES[0];
  const assignedIds = nurse.patients;
  const assignedPatients = patients.filter(p => assignedIds.includes(p.id));
  const pendingAlerts = alerts.filter(a => assignedIds.includes(a.patientId) && a.status !== 'Resolved');
  const criticals = assignedPatients.filter(p => p.risk === 'Critical');
  const avgResponse = '3.8 min';

  return (
    <div className="nurse-dash">
      <div className="nurse-dash__header">
        <div>
          <h1>Hello, {nurse.name.split(' ')[0]} 👩‍⚕️</h1>
          <p className="nurse-dash__sub">{nurse.dept.toUpperCase()} · {nurse.shift} Shift · <span className={`nurse-dash__status-badge status--${(user?.status || nurse.status).toLowerCase().replace(' ', '-')}`}>{user?.status || nurse.status}</span></p>
        </div>
      </div>

      <div className="nurse-dash__kpi-row">
        <KPICard title="Assigned Patients" value={assignedPatients.length} icon={Users} iconColor="#2563EB" className="delay-1" />
        <KPICard title="Pending Alerts" value={pendingAlerts.length} icon={AlertTriangle} iconColor="#EF4444" className="delay-2" />
        <KPICard title="Duty Status" value={user?.status || nurse.status} icon={Clock} iconColor="#22C55E" animate={false} className="delay-3" />
        <KPICard title="Today's Tasks" value={`${TASKS.filter(t => t.done).length}/${TASKS.length}`} icon={Activity} iconColor="#F59E0B" animate={false} className="delay-4" />
      </div>

      <div className="nurse-dash__grid">
        {/* Patient queue */}
        <Card padding="none" className="nurse-dash__queue-card">
          <div className="nurse-dash__card-header">
            <div><h4>Patient Queue</h4><p>Your assigned patients</p></div>
          </div>
          <div className="nurse-dash__patient-list">
            {assignedPatients.map(p => {
              const dept = DEPARTMENTS.find(d => d.id === p.dept);
              return (
                <div key={p.id} className="nurse-dash__patient-item" onClick={() => navigate(`/patients/${p.id}`)}>
                  <div className="nurse-dash__patient-avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="nurse-dash__patient-info">
                    <div className="nurse-dash__patient-name">{p.name}</div>
                    <div className="nurse-dash__patient-meta">{p.id} · Bed {p.bed} · {p.diagnosis}</div>
                  </div>
                  <div className="nurse-dash__patient-vitals">
                    <span className="nurse-dash__vital">❤️ {p.vitals.heartRate}</span>
                    <span className="nurse-dash__vital">O₂ {p.vitals.spo2}%</span>
                  </div>
                  <Badge variant={getRiskVariant(p.risk)} size="sm">{p.risk}</Badge>
                </div>
              );
            })}
            {assignedPatients.length === 0 && <div className="nurse-dash__empty">No assigned patients</div>}
          </div>
        </Card>

        {/* Right */}
        <div className="nurse-dash__right">
          {/* Today's Tasks */}
          <Card padding="none">
            <div className="nurse-dash__card-header">
              <div><h4>Today's Tasks</h4><p>{TASKS.filter(t => t.done).length}/{TASKS.length} completed</p></div>
            </div>
            <div className="nurse-dash__task-list">
              {TASKS.map(t => (
                <div key={t.id} className={`nurse-dash__task ${t.done ? 'task--done' : ''}`}>
                  <div className={`nurse-dash__task-check ${t.done ? 'check--done' : ''}`}>
                    {t.done && '✓'}
                  </div>
                  <div className="nurse-dash__task-text">{t.task}</div>
                  <div className="nurse-dash__task-time">{t.time}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Alert Feed */}
          <Card padding="none" style={{ minHeight: '300px' }}>
            <div className="nurse-dash__card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              {pendingAlerts.slice(0, 5).map(a => {
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
              {pendingAlerts.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  No active alerts recorded.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
