import { X, Bell, CheckCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './NotificationPanel.css';

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ICONS = {
  critical: AlertTriangle,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  critical: '#EF4444',
  success: '#22C55E',
  info: '#2563EB',
  warning: '#F59E0B',
};

export default function NotificationPanel() {
  const { notifications, panelOpen, setPanelOpen, markAllRead, markRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  if (!panelOpen) return null;

  const handleNotifClick = (n) => {
    markRead(n.id);
    setPanelOpen(false);
    if (n.patientId) {
      navigate(`/patients/${n.patientId}`);
    } else {
      navigate('/alerts');
    }
  };

  return (
    <>
      <div className="notif-overlay" onClick={() => setPanelOpen(false)} />
      <div className="notif-panel animate-slide-in-right">
        <div className="notif-panel__header">
          <div>
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="notif-panel__badge">{unreadCount} unread</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {unreadCount > 0 && (
              <button className="notif-panel__mark-all" onClick={markAllRead}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button className="notif-panel__close" onClick={() => setPanelOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="notif-panel__list">
          {notifications.length === 0 && (
            <div className="notif-panel__empty">
              <Bell size={32} color="var(--color-text-muted)" />
              <p>No notifications</p>
            </div>
          )}
          {notifications.map(n => {
            const Icon = ICONS[n.severity] || Info;
            const color = COLORS[n.severity] || '#64748B';
            return (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                onClick={() => handleNotifClick(n)}
                style={{ cursor: 'pointer' }}
              >
                <div className="notif-item__icon" style={{ background: `${color}15` }}>
                  <Icon size={14} color={color} />
                </div>
                <div className="notif-item__body">
                  <div className="notif-item__title">{n.title}</div>
                  <div className="notif-item__msg">{n.message}</div>
                  <div className="notif-item__time">{timeAgo(n.time)}</div>
                </div>
                {!n.read && <div className="notif-item__dot" />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
