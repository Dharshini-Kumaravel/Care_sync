import { NURSES, DEPARTMENTS } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';
import Badge from '../components/common/Badge';
import './Nurses.css';

export default function Nurses() {
  const { patients } = useSimulation();
  return (
    <div className="nurses-page">
      <div className="nurses-page__header">
        <h1 className="page-title">Nursing Staff</h1>
        <p className="page-subtitle">{NURSES.length} nurses on duty</p>
      </div>
      <div className="nurses-grid">
        {NURSES.map(n => {
          const dept = DEPARTMENTS.find(d => d.id === n.dept);
          const assignedPts = patients.filter(p => n.patients.includes(p.id));
          return (
            <div key={n.id} className="nurse-card">
              <div className="nurse-card__header">
                <div className="nurse-card__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                  {n.name.split(' ').map(x => x[0]).join('').slice(0, 2)}
                </div>
                <Badge variant={n.status === 'On Duty' ? 'success' : 'neutral'} size="sm">{n.status}</Badge>
              </div>
              <div className="nurse-card__name">{n.name}</div>
              <div className="nurse-card__meta">{dept?.name} · {n.shift} Shift</div>
              <div className="nurse-card__divider" />
              <div className="nurse-card__patients-label">Assigned Patients ({assignedPts.length})</div>
              <div className="nurse-card__patient-list">
                {assignedPts.map(p => (
                  <div key={p.id} className="nurse-card__patient-chip">
                    <span className={`nurse-card__risk-dot ${p.risk === 'Critical' ? 'risk-critical' : p.risk === 'High' ? 'risk-high' : 'risk-normal'}`} />
                    {p.name.split(' ')[0]}
                  </div>
                ))}
              </div>
              <div className="nurse-card__id">{n.id}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
