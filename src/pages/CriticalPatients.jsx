import { useSimulation } from '../context/SimulationContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import { DEPARTMENTS } from '../data/mockData';
import { Activity } from 'lucide-react';
import './CriticalPatients.css';

export default function CriticalPatients() {
  const { patients } = useSimulation();
  const navigate = useNavigate();

  const critical = patients
    .filter(p => p.risk === 'Critical')
    .sort((a, b) => a.psi - b.psi);

  const high = patients.filter(p => p.risk === 'High').sort((a, b) => a.psi - b.psi);

  return (
    <div className="critical-page">
      <div className="critical-page__header">
        <div>
          <h1 className="page-title">Critical Patients</h1>
          <p className="page-subtitle">{critical.length} patients in critical state</p>
        </div>
        <div className="critical-page__live-badge">
          <span className="critical-page__live-dot" />
          Live Monitoring
        </div>
      </div>

      {/* Top 10 Leaderboard */}
      <div className="critical-leaderboard">
        <div className="critical-leaderboard__title">
          <Activity size={18} color="#EF4444" />
          Top {Math.min(10, critical.length)} Critical Rankings
        </div>
        <div className="critical-leaderboard__list">
          {critical.slice(0, 10).map((p, i) => {
            const dept = DEPARTMENTS.find(d => d.id === p.dept);
            return (
              <div key={p.id} className={`critical-rank-item ${i < 3 ? 'critical-rank-item--top' : ''}`} onClick={() => navigate(`/patients/${p.id}`)}>
                <div className={`critical-rank-item__rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n'}`}>
                  {i + 1}
                </div>
                <div className="critical-rank-item__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="critical-rank-item__info">
                  <div className="critical-rank-item__name">{p.name}</div>
                  <div className="critical-rank-item__meta">{p.id} · {p.age}y · {dept?.name}</div>
                </div>
                <div className="critical-rank-item__vitals">
                  <span>❤️ {p.vitals.heartRate}</span>
                  <span>O₂ {p.vitals.spo2}%</span>
                  <span>{p.vitals.temperature}°C</span>
                </div>
                <div className="critical-rank-item__psi">
                  <div className="critical-rank-item__psi-circle" style={{
                    background: `conic-gradient(#EF4444 ${p.psi * 3.6}deg, #FEE2E2 0deg)`
                  }}>
                    <div className="critical-rank-item__psi-inner">{p.psi}</div>
                  </div>
                  <span>PSI</span>
                </div>
                <Badge variant="critical" dot pulse size="sm">Critical</Badge>
              </div>
            );
          })}
          {critical.length === 0 && (
            <div className="critical-page__empty">
              <div style={{ fontSize: '3rem' }}>✅</div>
              <p>No critical patients at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* High Risk */}
      {high.length > 0 && (
        <div className="critical-high-section">
          <h3 className="critical-high-section__title">High Risk Patients ({high.length})</h3>
          <div className="critical-high-grid">
            {high.slice(0, 6).map(p => {
              const dept = DEPARTMENTS.find(d => d.id === p.dept);
              return (
                <div key={p.id} className="critical-high-card" onClick={() => navigate(`/patients/${p.id}`)}>
                  <div className="critical-high-card__header">
                    <div className="critical-high-card__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                      {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="critical-high-card__name">{p.name}</div>
                      <div className="critical-high-card__meta">{p.id} · {dept?.name}</div>
                    </div>
                    <Badge variant="high" size="sm">High</Badge>
                  </div>
                  <div className="critical-high-card__vitals">
                    <div><span>HR</span><strong>{p.vitals.heartRate}</strong></div>
                    <div><span>SpO₂</span><strong>{p.vitals.spo2}%</strong></div>
                    <div><span>PSI</span><strong>{p.psi}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
