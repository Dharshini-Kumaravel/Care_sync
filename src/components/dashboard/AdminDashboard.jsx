import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import KPICard from '../common/KPICard';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertTriangle, BedDouble, Activity, TrendingUp, Clock, Heart, Stethoscope, UserCheck, CheckCircle } from 'lucide-react';
import { DEPARTMENTS, ANALYTICS_DATA, BED_DATA, DOCTORS, NURSES } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';


function getRiskVariant(r) {
  return r === 'Critical' ? 'critical' : r === 'High' ? 'high' : r === 'Medium' ? 'warning' : 'low';
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const DEPT_COLORS = DEPARTMENTS.reduce((acc, d) => ({ ...acc, [d.id]: d.color }), {});

export default function AdminDashboard() {
  const { user } = useAuth();
  const { patients, alerts, stats } = useSimulation();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[1] || user?.name?.split(' ')[0] || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const recentAlerts = alerts.slice(0, 5);
  const recentAdmissions = [...patients].sort((a, b) => new Date(b.admitDate) - new Date(a.admitDate)).slice(0, 5);

  // Beds
  const totalBeds = BED_DATA.reduce((s, d) => s + d.total, 0);
  const availableBeds = BED_DATA.reduce((s, d) => s + d.available, 0);
  const occupiedBeds = BED_DATA.reduce((s, d) => s + d.occupied, 0);

  // Staff
  const totalDoctors = DOCTORS.length;
  const totalNurses = NURSES.length;

  // Department health score (avg PSI across all)
  const avgPSI = patients.length ? Math.round(patients.reduce((s, p) => s + p.psi, 0) / patients.length) : 0;

  // Dept distribution for pie
  const deptCounts = DEPARTMENTS.map(d => ({
    name: d.name,
    value: patients.filter(p => p.dept === d.id).length,
    color: d.color,
  }));

  // Trend data (last 7 days simulated)
  const trendData = ANALYTICS_DATA.criticalTrend.slice(-7);

  // Bed occupancy per dept
  const bedData = BED_DATA.slice(0, 5);

  // Avg response time
  const avgResponse = '4.2 min';

  const severityVariant = (s) => s === 'critical' ? 'critical' : s === 'high' ? 'high' : s === 'warning' ? 'warning' : 'info';

  return (
    <div className="admin-dash">
      {/* Header */}
      <div className="admin-dash__header">
        <div>
          <h1>{greeting}, Dr. {firstName} 👋</h1>
          <p className="admin-dash__subtitle">Here's your hospital overview for today</p>
        </div>
        <div className="admin-dash__date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="admin-dash__kpi-row">
        <KPICard title="Total Patients" value={stats.totalPatients} icon={Users} iconColor="#2563EB" trend={3} subtitle="Active admissions" className="delay-1" />
        <KPICard title="Critical Patients" value={stats.criticalPatients} icon={Heart} iconColor="#EF4444" trend={-2} subtitle="Require immediate care" className="delay-2" />
        <KPICard title="Total Doctors" value={totalDoctors} icon={Stethoscope} iconColor="#8B5CF6" subtitle="Active medical staff" className="delay-3" />
        <KPICard title="Total Nurses" value={totalNurses} icon={UserCheck} iconColor="#06B6D4" subtitle="On shift staff" className="delay-4" />
      </div>

      {/* KPI Row 2 */}
      <div className="admin-dash__kpi-row">
        <KPICard title="Available Beds" value={availableBeds} icon={BedDouble} iconColor="#22C55E" subtitle={`of ${totalBeds} total`} className="delay-2" />
        <KPICard title="Occupied Beds" value={occupiedBeds} icon={BedDouble} iconColor="#EF4444" subtitle={`${Math.round((occupiedBeds/totalBeds)*100)}% occupancy`} className="delay-3" />
        <KPICard title="Active Alerts" value={stats.activeAlerts} icon={AlertTriangle} iconColor="#F59E0B" trend={1} subtitle="Pending response" className="delay-4" />
        <KPICard title="Dept Health Score" value={avgPSI} icon={Activity} iconColor="#22C55E" subtitle="Avg patient stability index" className="delay-5" />
      </div>

      {/* Charts Row */}
      <div className="admin-dash__charts-row">
        {/* Critical Trend */}
        <Card className="admin-dash__chart-card" padding="md">
          <CardHeader title="Critical Trend" subtitle="Last 7 days" icon={TrendingUp} iconColor="#EF4444" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} fill="url(#critGrad)" />
              <Area type="monotone" dataKey="high" stroke="#F59E0B" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="admin-dash__chart-card" padding="md">
          <CardHeader title="Department Health" subtitle="Patient distribution" icon={Activity} iconColor="#2563EB" />
          <div className="admin-dash__dept-chart">
            <ResponsiveContainer width="45%" height={160}>
              <PieChart>
                <Pie data={deptCounts} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {deptCounts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="admin-dash__dept-legend">
              {deptCounts.map(d => (
                <div key={d.name} className="admin-dash__dept-item">
                  <div className="admin-dash__dept-dot" style={{ background: d.color }} />
                  <span className="admin-dash__dept-name">{d.name}</span>
                  <span className="admin-dash__dept-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Bed Occupancy */}
        <Card className="admin-dash__chart-card" padding="md">
          <CardHeader title="Bed Occupancy" subtitle="By department" icon={BedDouble} iconColor="#22C55E" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bedData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="occupied" name="Occupied" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="admin-dash__bottom-row">
        {/* Recent Alerts */}
        <Card padding="none" className="admin-dash__alerts-card">
          <div className="admin-dash__section-header">
            <div>
              <h4>Recent Alerts</h4>
              <p>Last 5 critical events</p>
            </div>
            <button className="admin-dash__view-all" onClick={() => navigate('/alerts')}>View all</button>
          </div>
          <div className="admin-dash__alert-list">
            {recentAlerts.map(a => (
              <div key={a.id} className="admin-dash__alert-item">
                <div className={`admin-dash__alert-dot alert-dot--${a.severity}`} />
                <div className="admin-dash__alert-body">
                  <div className="admin-dash__alert-type">{a.type}</div>
                  <div className="admin-dash__alert-patient">{a.patientName}</div>
                </div>
                <div className="admin-dash__alert-right">
                  <Badge variant={severityVariant(a.severity)} size="sm">{a.status}</Badge>
                  <div className="admin-dash__alert-time">{timeAgo(a.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Admissions */}
        <Card padding="none" className="admin-dash__admissions-card">
          <div className="admin-dash__section-header">
            <div>
              <h4>Recent Admissions</h4>
              <p>Latest patient entries</p>
            </div>
            <button className="admin-dash__view-all" onClick={() => navigate('/patients')}>View all</button>
          </div>
          <div className="admin-dash__admission-list">
            {recentAdmissions.map(p => {
              const dept = DEPARTMENTS.find(d => d.id === p.dept);
              return (
                <div key={p.id} className="admin-dash__admission-item" onClick={() => navigate(`/patients/${p.id}`)}>
                  <div className="admin-dash__admission-avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="admin-dash__admission-info">
                    <div className="admin-dash__admission-name">{p.name}</div>
                    <div className="admin-dash__admission-meta">{p.id} · {dept?.name} · Bed {p.bed}</div>
                  </div>
                  <Badge variant={getRiskVariant(p.risk)} size="sm">{p.risk}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
