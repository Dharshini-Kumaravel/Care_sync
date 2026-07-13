import { useSimulation } from '../context/SimulationContext';
import { Play, Square, RefreshCw, Activity, Zap, Users, AlertTriangle } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const { isRunning, startSimulation, stopSimulation, resetSimulation, stats, tick } = useSimulation();

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Application preferences and simulation control</p>
      </div>

      {/* Simulation Mode */}
      <div className="settings-section">
        <h3 className="settings-section__title">Simulation Mode</h3>
        <div className="simulation-card">
          <div className="simulation-card__top">
            <div className="simulation-card__icon">
              <Activity size={28} color={isRunning ? '#22C55E' : '#2563EB'} />
            </div>
            <div>
              <h2 className="simulation-card__h">Hospital Simulation Engine</h2>
              <p className="simulation-card__sub">
                Generates live patient vitals, risk scores, and alerts in real-time. Simulates 100 patients across all departments.
              </p>
            </div>
            {isRunning && (
              <div className="simulation-card__live">
                <span className="simulation-card__live-dot" />
                LIVE · Tick {tick}
              </div>
            )}
          </div>

          <div className="simulation-card__stats">
            <div className="sim-stat"><Users size={16} /><span>{stats.totalPatients}</span><label>Patients</label></div>
            <div className="sim-stat"><Activity size={16} color="#EF4444" /><span style={{ color: '#EF4444' }}>{stats.criticalPatients}</span><label>Critical</label></div>
            <div className="sim-stat"><AlertTriangle size={16} color="#F59E0B" /><span style={{ color: '#F59E0B' }}>{stats.activeAlerts}</span><label>Active Alerts</label></div>
            <div className="sim-stat"><Zap size={16} color="#22C55E" /><span style={{ color: '#22C55E' }}>{stats.lowPatients}</span><label>Stable</label></div>
          </div>

          <div className="simulation-card__actions">
            {!isRunning ? (
              <button className="simulation-btn simulation-btn--start" onClick={startSimulation}>
                <Play size={18} fill="#fff" />
                START HOSPITAL SIMULATION
              </button>
            ) : (
              <button className="simulation-btn simulation-btn--stop" onClick={stopSimulation}>
                <Square size={16} fill="#fff" />
                STOP SIMULATION
              </button>
            )}
            <button className="simulation-btn simulation-btn--reset" onClick={resetSimulation}>
              <RefreshCw size={16} />
              Reset Data
            </button>
          </div>

          {isRunning && (
            <div className="simulation-card__notice">
              <div className="simulation-card__notice-dot" />
              Simulation active — patient vitals and risk scores update every 3 seconds
            </div>
          )}
        </div>
      </div>

      {/* App Settings */}
      <div className="settings-section">
        <h3 className="settings-section__title">Application Settings</h3>
        <div className="settings-rows">
          {[
            { label: 'Auto-refresh vitals', sub: 'Refresh vitals data automatically', val: true },
            { label: 'Sound alerts', sub: 'Play sound on critical alerts', val: false },
            { label: 'Email notifications', sub: 'Send email for critical events', val: true },
            { label: 'SMS notifications', sub: 'Send SMS for critical alerts', val: false },
          ].map(s => (
            <div key={s.label} className="settings-row">
              <div>
                <div className="settings-row__label">{s.label}</div>
                <div className="settings-row__sub">{s.sub}</div>
              </div>
              <div className={`settings-toggle ${s.val ? 'settings-toggle--on' : ''}`}>
                <div className="settings-toggle__knob" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h3 className="settings-section__title">About</h3>
        <div className="settings-about">
          <div className="settings-about__item"><span>Version</span><strong>2.1.0</strong></div>
          <div className="settings-about__item"><span>Platform</span><strong>CareSync AI Healthcare Suite</strong></div>
          <div className="settings-about__item"><span>License</span><strong>Enterprise Healthcare</strong></div>
          <div className="settings-about__item"><span>Compliance</span><strong>HIPAA · HL7 · ISO 27001</strong></div>
        </div>
      </div>
    </div>
  );
}
