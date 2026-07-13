import { useState, useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import Badge from '../components/common/Badge';
import { DEPARTMENTS, NURSES } from '../data/mockData';
import './Patients.css';

function getRiskVariant(r) { return r === 'Critical' ? 'critical' : r === 'High' ? 'high' : r === 'Medium' ? 'warning' : 'low'; }

export default function Patients() {
  const { patients } = useSimulation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [sortCol, setSortCol] = useState('psi');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const PER_PAGE = 15;

  const isAdmin = user?.role === 'Admin';
  const isDoctor = user?.role === 'Doctor';
  const isNurse = user?.role === 'Nurse';

  // Role-based patient list
  const roleFiltered = useMemo(() => {
    if (isDoctor) return patients.filter(p => p.dept === user?.dept);
    if (isNurse) {
      const nurse = NURSES.find(n => n.id === user?.id) || NURSES[0];
      return patients.filter(p => nurse.patients.includes(p.id));
    }
    return patients;
  }, [patients, user, isDoctor, isNurse]);

  const filtered = useMemo(() => {
    let list = [...roleFiltered];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
    if (filterRisk !== 'All') list = list.filter(p => p.risk === filterRisk);
    if (filterDept !== 'All') list = list.filter(p => p.dept === filterDept);
    list.sort((a, b) => {
      const av = a[sortCol] ?? 0; const bv = b[sortCol] ?? 0;
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [roleFiltered, search, filterRisk, filterDept, sortCol, sortDir]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span className="sort-icon sort-icon--inactive"><ChevronUp size={10} /></span>;
    return sortDir === 'asc' ? <ChevronUp size={12} color="var(--color-primary)" /> : <ChevronDown size={12} color="var(--color-primary)" />;
  };

  const pageTitle = isNurse ? 'Assigned Patients' : 'Patients';
  const pageSubtitle = isNurse
    ? `${filtered.length} patients assigned to you`
    : isDoctor
      ? `${filtered.length} patients in your department`
      : `${filtered.length} patients found`;

  return (
    <div className="patients-page">
      <div className="patients-page__header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
        {isAdmin && (
          <button className="patients-page__add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Patient
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="patients-page__filters">
        <div className="patients-page__search">
          <Search size={15} className="patients-search-icon" />
          <input
            placeholder="Search by name or patient ID…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select value={filterRisk} onChange={e => { setFilterRisk(e.target.value); setPage(1); }}>
          <option value="All">All Risk Levels</option>
          {['Critical', 'High', 'Medium', 'Low'].map(r => <option key={r}>{r}</option>)}
        </select>
        {isAdmin && (
          <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }}>
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}
      </div>

      {/* Role permission banner */}
      {isDoctor && (
        <div className="patients-page__role-banner patients-page__role-banner--doctor">
          👨‍⚕️ Doctor View — You can view patient details, add notes, and update diagnosis. Deletion is restricted.
        </div>
      )}
      {isNurse && (
        <div className="patients-page__role-banner patients-page__role-banner--nurse">
          👩‍⚕️ Nurse View — Showing only your assigned patients. You can record observations and update vitals.
        </div>
      )}

      {/* Table */}
      <div className="patients-table-card">
        <table className="patients-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('id')} className="sortable">Patient ID <SortIcon col="id" /></th>
              <th onClick={() => toggleSort('name')} className="sortable">Name <SortIcon col="name" /></th>
              <th onClick={() => toggleSort('age')} className="sortable">Age <SortIcon col="age" /></th>
              {!isNurse && <th>Department</th>}
              <th>Bed</th>
              <th onClick={() => toggleSort('risk')} className="sortable">Risk <SortIcon col="risk" /></th>
              <th onClick={() => toggleSort('psi')} className="sortable">PSI <SortIcon col="psi" /></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => {
              const dept = DEPARTMENTS.find(d => d.id === p.dept);
              return (
                <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
                  <td className="patients-table__id">{p.id}</td>
                  <td>
                    <div className="patients-table__name-cell">
                      <div className="patients-table__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="patients-table__name">{p.name}</div>
                        <div className="patients-table__diagnosis">{p.diagnosis}</div>
                      </div>
                    </div>
                  </td>
                  <td className="patients-table__age">{p.age}y · {p.gender[0]}</td>
                  {!isNurse && (
                    <td>
                      <span className="patients-table__dept" style={{ background: `${dept?.color}15`, color: dept?.color }}>
                        {dept?.name}
                      </span>
                    </td>
                  )}
                  <td className="patients-table__bed">{p.bed}</td>
                  <td><Badge variant={getRiskVariant(p.risk)} dot={p.risk === 'Critical'} pulse={p.risk === 'Critical'} size="sm">{p.risk}</Badge></td>
                  <td>
                    <div className="patients-table__psi">
                      <div className="patients-table__psi-bar">
                        <div className="patients-table__psi-fill" style={{ width: `${p.psi}%`, background: p.psi > 60 ? '#22C55E' : p.psi > 30 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span>{p.psi}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`patients-table__status status-pill--${p.status.toLowerCase().replace(/\s/g, '-')}`}>{p.status}</span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="patients-table__actions">
                      <button className="patients-table__action-btn" onClick={() => navigate(`/patients/${p.id}`)}>
                        <Eye size={13} /> View
                      </button>
                      {isAdmin && (
                        <>
                          <button className="patients-table__action-btn patients-table__action-btn--edit" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="patients-table__action-btn patients-table__action-btn--delete" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="patients-table__empty">
            <Eye size={40} color="var(--color-text-muted)" />
            <p>No patients found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="patients-table__pagination">
          <span className="patients-table__pag-info">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="patients-table__pag-btns">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return <button key={pg} className={pg === page ? 'pag-active' : ''} onClick={() => setPage(pg)}>{pg}</button>;
            })}
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal (Admin only) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-box__header">
              <h3>Add New Patient</h3>
              <button className="modal-box__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-box__body">
              <div className="modal-form-grid">
                {['Full Name', 'Age', 'Gender', 'Blood Group', 'Phone', 'Diagnosis', 'Department', 'Bed Number'].map(f => (
                  <div key={f} className="modal-field">
                    <label>{f}</label>
                    <input type="text" placeholder={`Enter ${f.toLowerCase()}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-box__footer">
              <button className="modal-btn modal-btn--cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn--save">Save Patient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
