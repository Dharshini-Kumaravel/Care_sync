import { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import { Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import './Alerts.css';

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Alerts() {
  const { alerts, resolveAlert, acceptAlert } = useSimulation();
  const navigate = useNavigate();
  const [filterSev, setFilterSev] = useState('All');

  const filtered = alerts.filter(a => {
    if (filterSev !== 'All' && a.severity !== filterSev) return false;
    return true;
  });

  const counts = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    pending: alerts.filter(a => a.status !== 'Resolved').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length,
  };

  const pendingAlerts = filtered.filter(a => a.status === 'Created' || a.status === 'Seen');
  const acceptedAlerts = filtered.filter(a => a.status === 'Accepted');
  const resolvedAlerts = filtered.filter(a => a.status === 'Resolved');

  const renderAlertCard = (alert) => {
    const isPending = alert.status === 'Created' || alert.status === 'Seen';
    const isAccepted = alert.status === 'Accepted';
    const isResolved = alert.status === 'Resolved';
    
    let variant = 'info';
    if (alert.severity === 'critical') variant = 'critical';
    else if (alert.severity === 'high' || alert.severity === 'warning') variant = 'warning';

    return (
      <div key={alert.id} className={`alerts-board__card alerts-board__card--${alert.severity} animate-scale-in`}>
        <div className="alerts-board__card-header">
          <Badge variant={variant} size="sm">{alert.severity.toUpperCase()}</Badge>
          <span className="alerts-board__card-time">
            <Clock size={11} /> {timeAgo(alert.timestamp)}
          </span>
        </div>
        <div className="alerts-board__card-patient" onClick={() => navigate(`/patients/${alert.patientId}`)}>
          <strong>{alert.patientName}</strong> · Bed {alert.bed || 'ICU-15'}
        </div>
        <div className="alerts-board__card-message">{alert.message}</div>
        
        <div className="alerts-board__card-escalation">
          <div className="alerts-escalation-line">Nurse: — · Escalation L0</div>
          {isAccepted && (
            <div className="alerts-board__card-logs">
              <div>↳ Alert raised — assigned to nearest nurse</div>
              <div className="log--success">↳ Nurse accepted alert (Attending)</div>
            </div>
          )}
          {isResolved && (
            <div className="alerts-board__card-logs">
              <div>↳ Alert raised — assigned to nearest nurse</div>
              <div>↳ Nurse accepted alert (Attending)</div>
              <div className="log--success">↳ Completed Care (Resolved)</div>
            </div>
          )}
        </div>

        <div className="alerts-board__card-actions">
          {isPending && (
            <button className="alert-board-btn alert-board-btn--attend" onClick={() => acceptAlert(alert.id)}>
              Attend Patient
            </button>
          )}
          {!isResolved && (
            <button className="alert-board-btn alert-board-btn--resolve" onClick={() => resolveAlert(alert.id)}>
              Complete Care
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="alerts-page">
      <div className="alerts-page__header">
        <div>
          <h1 className="page-title">Alert Center</h1>
          <p className="page-subtitle">Real-time hospital alerts and response board</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="alerts-page__stats">
        {[
          { label: 'Total Alerts', value: counts.total, color: 'var(--color-primary)' },
          { label: 'Critical', value: counts.critical, color: 'var(--color-critical)' },
          { label: 'Pending', value: counts.pending, color: 'var(--color-warning)' },
          { label: 'Resolved', value: counts.resolved, color: 'var(--color-success)' },
        ].map(s => (
          <div key={s.label} className="alerts-page__stat-card">
            <div className="alerts-page__stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="alerts-page__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="alerts-page__filters" style={{ marginBottom: '24px' }}>
        <Filter size={15} color="var(--color-text-muted)" />
        <select value={filterSev} onChange={e => setFilterSev(e.target.value)}>
          <option value="All">All Severities</option>
          {['critical', 'high', 'warning', 'info', 'low'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="alerts-page__filter-count">{filtered.length} alerts loaded</span>
      </div>

      {/* Board Grid */}
      <div className="alerts-board">
        {/* Column 1: Pending */}
        <div className="alerts-board__col">
          <div className="alerts-board__col-header">
            <span className="alerts-board__col-dot alerts-board__col-dot--pending" />
            <h3 className="alerts-board__col-title">Pending</h3>
            <span className="alerts-board__col-badge">{pendingAlerts.length}</span>
          </div>
          <div className="alerts-board__col-list">
            {pendingAlerts.map(alert => renderAlertCard(alert))}
            {pendingAlerts.length === 0 && <div className="alerts-board__empty">Nothing here.</div>}
          </div>
        </div>

        {/* Column 2: Accepted */}
        <div className="alerts-board__col">
          <div className="alerts-board__col-header">
            <span className="alerts-board__col-dot alerts-board__col-dot--accepted" />
            <h3 className="alerts-board__col-title">Accepted (Attending)</h3>
            <span className="alerts-board__col-badge">{acceptedAlerts.length}</span>
          </div>
          <div className="alerts-board__col-list">
            {acceptedAlerts.map(alert => renderAlertCard(alert))}
            {acceptedAlerts.length === 0 && <div className="alerts-board__empty">Nothing here.</div>}
          </div>
        </div>

        {/* Column 3: Resolved */}
        <div className="alerts-board__col">
          <div className="alerts-board__col-header">
            <span className="alerts-board__col-dot alerts-board__col-dot--resolved" />
            <h3 className="alerts-board__col-title">Resolved</h3>
            <span className="alerts-board__col-badge">{resolvedAlerts.length}</span>
          </div>
          <div className="alerts-board__col-list">
            {resolvedAlerts.map(alert => renderAlertCard(alert))}
            {resolvedAlerts.length === 0 && <div className="alerts-board__empty">Nothing here.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
