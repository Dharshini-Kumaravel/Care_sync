import { X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import './ToastContainer.css';

const ICONS = { critical: AlertTriangle, success: CheckCircle2, info: Info, warning: AlertTriangle, high: AlertTriangle };
const COLORS = { critical: '#EF4444', success: '#22C55E', info: '#1E6B7B', warning: '#FF9F1C', high: '#FF9F1C' };

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();
  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = ICONS[t.severity] || Info;
        const color = COLORS[t.severity] || '#64748B';
        const isCritical = t.severity === 'critical';
        const isWarning = t.severity === 'warning' || t.severity === 'high';
        const isSuccess = t.severity === 'success';
        const isInfo = t.severity === 'info';
        
        let typeClass = 'toast--info';
        if (isCritical) typeClass = 'toast--critical';
        else if (isWarning) typeClass = 'toast--warning';
        else if (isSuccess) typeClass = 'toast--success';

        return (
          <div key={t.id} className={`toast ${typeClass} animate-toast-in`}>
            <button className="toast__close" onClick={() => dismissToast(t.id)}><X size={12} /></button>
            <div className="toast__content">
              <div className="toast__header-row">
                <Icon size={14} color={color} className="toast__sev-icon" />
                <span className="toast__title">{t.title}</span>
              </div>
              <div className="toast__msg">{t.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
