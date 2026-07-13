import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Clock, CheckCircle2, AlertCircle, Coffee, PowerOff } from 'lucide-react';
import './DutyStatus.css';

const STATUS_OPTS = [
  { id: 'Available', label: 'Available', desc: 'Active & ready to respond to incoming patient calls/alerts', icon: CheckCircle2, color: '#22C55E', variant: 'success' },
  { id: 'Busy', label: 'Busy', desc: 'Currently attending a patient or procedure. Backup alerts redirected.', icon: AlertCircle, color: '#EA580C', variant: 'high' },
  { id: 'Break', label: 'Break', desc: 'Temporary break. Duty coverage transferred to roster.', icon: Coffee, color: '#F59E0B', variant: 'warning' },
  { id: 'Offline', label: 'Offline', desc: 'Shift ended. Disconnected from live monitoring feed.', icon: PowerOff, color: '#64748B', variant: 'neutral' }
];

export default function DutyStatus() {
  const { user, updateStatus } = useAuth();
  const currentStatus = user?.status || 'Available';
  const setCurrentStatus = (status) => updateStatus(status);

  return (
    <div className="duty-status-page animate-fade-in-up">
      <div className="duty-status-page__header">
        <div>
          <h1 className="page-title">Shift Duty Status</h1>
          <p className="page-subtitle">Manage availability and alert routing parameters</p>
        </div>
        <Badge variant={STATUS_OPTS.find(s => s.id === currentStatus)?.variant} dot pulse>
          {currentStatus}
        </Badge>
      </div>

      <div className="duty-status-current">
        <div className="duty-status-current__card">
          <div className="duty-status-current__label">Current Shift State</div>
          <h2 className="duty-status-current__val">{currentStatus}</h2>
          <p className="duty-status-current__desc">
            {STATUS_OPTS.find(s => s.id === currentStatus)?.desc}
          </p>
        </div>
      </div>

      <h3 className="duty-status-grid-title">Update Your Status</h3>
      <div className="duty-status-grid">
        {STATUS_OPTS.map(opt => {
          const Icon = opt.icon;
          const isSelected = currentStatus === opt.id;
          return (
            <div 
              key={opt.id} 
              className={`duty-status-opt-card ${isSelected ? 'duty-status-opt-card--selected' : ''}`}
              onClick={() => setCurrentStatus(opt.id)}
              style={{ borderLeft: `4px solid ${opt.color}` }}
            >
              <div className="duty-status-opt-card__header">
                <div className="duty-status-opt-card__icon" style={{ color: opt.color }}>
                  <Icon size={20} />
                </div>
                <h4 className="duty-status-opt-card__title">{opt.label}</h4>
              </div>
              <p className="duty-status-opt-card__desc">{opt.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
