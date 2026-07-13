import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationPanel from '../notifications/NotificationPanel';
import ToastContainer from '../notifications/ToastContainer';
import { useSimulation } from '../../context/SimulationContext';
import Badge from '../common/Badge';
import { AlertTriangle, BellRing, Heart } from 'lucide-react';
import './AppLayout.css';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { criticalRosterPopup, setCriticalRosterPopup, acceptAlert } = useSimulation();

  const handleAttend = () => {
    if (criticalRosterPopup) {
      acceptAlert(criticalRosterPopup.id);
      setCriticalRosterPopup(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className={`app-layout__main ${collapsed ? 'app-layout__main--collapsed' : ''}`}>
        <Topbar sidebarCollapsed={collapsed} />
        <main className="app-layout__content">
          {children}
        </main>
      </div>
      <NotificationPanel />
      <ToastContainer />

      {/* Nurse Specialized Emergency Roster Popup */}
      {criticalRosterPopup && (
        <div className="modal-overlay modal-overlay--emergency">
          <div className="modal-box modal-box--emergency animate-scale-in">
            <div className="emergency-header">
              <div className="emergency-header__icon">
                <BellRing size={28} className="animate-pulse" />
              </div>
              <div>
                <Badge variant="critical" pulse size="lg">CRITICAL ROSTER PATIENT</Badge>
                <h3 className="emergency-title">Physiological Deterioration Flagged</h3>
              </div>
            </div>
            <div className="modal-box__body emergency-body">
              <div className="emergency-alert-card">
                <div className="emergency-patient-info">
                  <span className="ep-name">{criticalRosterPopup.patientName}</span>
                  <span className="ep-bed">Bed: {criticalRosterPopup.bed}</span>
                </div>
                <div className="emergency-alert-details">
                  <div className="ea-row">
                    <Heart size={16} color="var(--color-critical)" />
                    <strong>Condition: {criticalRosterPopup.type}</strong>
                  </div>
                  <p className="ea-msg">{criticalRosterPopup.message}</p>
                </div>
              </div>
            </div>
            <div className="modal-box__footer emergency-footer">
              <button 
                className="modal-btn modal-btn--cancel" 
                onClick={() => setCriticalRosterPopup(null)}
              >
                Mute Alert
              </button>
              <button 
                className="modal-btn modal-btn--save emergency-attend-btn" 
                onClick={handleAttend}
              >
                Accept & Attend Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
