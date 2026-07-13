import { BED_DATA, DEPARTMENTS } from '../data/mockData';
import './BedManagement.css';

export default function BedManagement() {
  const totalBeds = BED_DATA.reduce((s, d) => s + d.total, 0);
  const occupied = BED_DATA.reduce((s, d) => s + d.occupied, 0);
  const available = BED_DATA.reduce((s, d) => s + d.available, 0);
  const reserved = BED_DATA.reduce((s, d) => s + d.reserved, 0);
  const occupancyPct = Math.round((occupied / totalBeds) * 100);

  return (
    <div className="beds-page">
      <div className="beds-page__header">
        <div>
          <h1 className="page-title">Bed Management</h1>
          <p className="page-subtitle">Hospital bed occupancy across all departments</p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="beds-overview">
        <div className="beds-overview__main">
          <div className="beds-overview__big-number">{occupancyPct}%</div>
          <div className="beds-overview__big-label">Overall Occupancy</div>
          <div className="beds-overview__bar-wrap">
            <div className="beds-overview__bar">
              <div className="beds-overview__bar-fill beds-overview__bar-fill--occ" style={{ width: `${(occupied / totalBeds) * 100}%` }} />
              <div className="beds-overview__bar-fill beds-overview__bar-fill--res" style={{ width: `${(reserved / totalBeds) * 100}%` }} />
            </div>
          </div>
          <div className="beds-overview__legend">
            <div><span style={{ background: '#2563EB' }} />Occupied ({occupied})</div>
            <div><span style={{ background: '#F59E0B' }} />Reserved ({reserved})</div>
            <div><span style={{ background: '#22C55E' }} />Available ({available})</div>
          </div>
        </div>
        <div className="beds-overview__stats">
          {[
            { label: 'Total Beds', val: totalBeds, color: '#2563EB' },
            { label: 'Occupied', val: occupied, color: '#EF4444' },
            { label: 'Available', val: available, color: '#22C55E' },
            { label: 'Reserved', val: reserved, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className="beds-overview__stat">
              <div className="beds-overview__stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="beds-overview__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Cards */}
      <h3 className="beds-page__section-title">Department Breakdown</h3>
      <div className="beds-dept-grid">
        {BED_DATA.map(d => {
          const dept = DEPARTMENTS.find(dep => dep.id === d.dept);
          const occPct = Math.round((d.occupied / d.total) * 100);
          return (
            <div key={d.dept} className="beds-dept-card">
              <div className="beds-dept-card__header">
                <div className="beds-dept-card__icon" style={{ background: `${d.color}20` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                </div>
                <div>
                  <div className="beds-dept-card__name">{d.name}</div>
                  <div className="beds-dept-card__total">{d.total} total beds</div>
                </div>
                <div className="beds-dept-card__pct" style={{ color: d.color }}>{occPct}%</div>
              </div>

              <div className="beds-dept-card__bar">
                <div className="beds-dept-card__bar-fill" style={{ width: `${occPct}%`, background: d.color }} />
              </div>

              <div className="beds-dept-card__stats">
                <div className="beds-dept-card__stat">
                  <div className="beds-dept-card__stat-dot" style={{ background: '#EF4444' }} />
                  <span>Occupied</span>
                  <strong>{d.occupied}</strong>
                </div>
                <div className="beds-dept-card__stat">
                  <div className="beds-dept-card__stat-dot" style={{ background: '#22C55E' }} />
                  <span>Available</span>
                  <strong>{d.available}</strong>
                </div>
                <div className="beds-dept-card__stat">
                  <div className="beds-dept-card__stat-dot" style={{ background: '#F59E0B' }} />
                  <span>Reserved</span>
                  <strong>{d.reserved}</strong>
                </div>
              </div>

              {/* Bed visual grid */}
              <div className="beds-dept-card__bed-grid">
                {Array.from({ length: Math.min(d.total, 20) }, (_, i) => (
                  <div key={i} className={`bed-cell ${i < d.occupied ? 'bed-cell--occupied' : i < d.occupied + d.reserved ? 'bed-cell--reserved' : 'bed-cell--available'}`} />
                ))}
                {d.total > 20 && <span className="beds-dept-card__more">+{d.total - 20} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
