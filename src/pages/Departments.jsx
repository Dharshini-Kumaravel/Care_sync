import { DEPARTMENTS, BED_DATA, DOCTORS } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';
import './Departments.css';

export default function Departments() {
  const { patients } = useSimulation();

  return (
    <div className="depts-page">
      <div className="depts-page__header">
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">{DEPARTMENTS.length} active departments</p>
      </div>
      <div className="depts-grid">
        {DEPARTMENTS.map(dept => {
          const deptPts = patients.filter(p => p.dept === dept.id);
          const criticals = deptPts.filter(p => p.risk === 'Critical').length;
          const beds = BED_DATA.find(b => b.dept === dept.id);
          const doctors = DOCTORS.filter(d => d.dept === dept.id);
          const avgPSI = deptPts.length ? Math.round(deptPts.reduce((s, p) => s + p.psi, 0) / deptPts.length) : 0;

          return (
            <div key={dept.id} className="dept-card" style={{ borderTop: `4px solid ${dept.color}` }}>
              <div className="dept-card__icon" style={{ background: `${dept.color}15` }}>
                <div className="dept-card__icon-dot" style={{ background: dept.color }} />
              </div>
              <h3 className="dept-card__name">{dept.name}</h3>

              <div className="dept-card__stats-row">
                <div className="dept-card__stat">
                  <div className="dept-card__stat-val">{deptPts.length}</div>
                  <div className="dept-card__stat-label">Patients</div>
                </div>
                <div className="dept-card__stat">
                  <div className="dept-card__stat-val" style={{ color: criticals > 0 ? '#EF4444' : '#22C55E' }}>{criticals}</div>
                  <div className="dept-card__stat-label">Critical</div>
                </div>
                <div className="dept-card__stat">
                  <div className="dept-card__stat-val">{beds?.available || 0}</div>
                  <div className="dept-card__stat-label">Avail. Beds</div>
                </div>
                <div className="dept-card__stat">
                  <div className="dept-card__stat-val">{doctors.length}</div>
                  <div className="dept-card__stat-label">Doctors</div>
                </div>
              </div>

              <div className="dept-card__divider" />

              <div className="dept-card__bed-bar-label">
                <span>Bed Occupancy</span>
                <span>{beds ? Math.round((beds.occupied / beds.total) * 100) : 0}%</span>
              </div>
              <div className="dept-card__bed-bar">
                <div className="dept-card__bed-bar-fill"
                  style={{ width: beds ? `${(beds.occupied / beds.total) * 100}%` : '0%', background: dept.color }} />
              </div>

              <div className="dept-card__psi-row">
                <span className="dept-card__psi-label">Avg PSI</span>
                <span className="dept-card__psi-val" style={{ color: dept.color }}>{avgPSI}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
