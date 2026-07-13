import { DOCTORS, DEPARTMENTS } from '../data/mockData';
import { useSimulation } from '../context/SimulationContext';
import './Doctors.css';

export default function Doctors() {
  const { patients } = useSimulation();

  return (
    <div className="doctors-page">
      <div className="doctors-page__header">
        <h1 className="page-title">Medical Staff</h1>
        <p className="page-subtitle">{DOCTORS.length} doctors across {DEPARTMENTS.length} departments</p>
      </div>
      <div className="doctors-grid">
        {DOCTORS.map(d => {
          const dept = DEPARTMENTS.find(dep => dep.id === d.dept);
          const docPatients = patients.filter(p => p.doctor === d.id);
          const criticals = docPatients.filter(p => p.risk === 'Critical').length;
          return (
            <div key={d.id} className="doctor-card">
              <div className="doctor-card__header">
                <div className="doctor-card__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                  {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="doctor-card__dept-badge" style={{ background: `${dept?.color}15`, color: dept?.color }}>
                  {dept?.name}
                </div>
              </div>
              <div className="doctor-card__name">{d.name}</div>
              <div className="doctor-card__spec">{d.specialization}</div>
              <div className="doctor-card__divider" />
              <div className="doctor-card__stats">
                <div className="doctor-card__stat">
                  <div className="doctor-card__stat-val">{docPatients.length}</div>
                  <div className="doctor-card__stat-label">Patients</div>
                </div>
                <div className="doctor-card__stat">
                  <div className="doctor-card__stat-val" style={{ color: criticals > 0 ? '#EF4444' : '#22C55E' }}>{criticals}</div>
                  <div className="doctor-card__stat-label">Critical</div>
                </div>
                <div className="doctor-card__stat">
                  <div className="doctor-card__stat-val">{d.experience}y</div>
                  <div className="doctor-card__stat-label">Experience</div>
                </div>
              </div>
              <div className="doctor-card__id">{d.id}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
