import { useState } from 'react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ClipboardList, Plus, Search, Check, AlertCircle } from 'lucide-react';
import './Observations.css';

const INITIAL_OBSERVATIONS = [
  { id: 'O001', patient: 'Mohan Kumar (P013)', condition: 'Stable', medicine: 'Acetaminophen 500mg', pain: 'Mild (2/10)', symptoms: 'Slight headache', remarks: 'Vitals stable. Patient resting comfortably.', nurse: 'Anitha Rajan', date: '2026-07-13T10:12:00Z' },
  { id: 'O002', patient: 'Deepak Pillai (P004)', condition: 'Under Observation', medicine: 'Metoprolol 25mg', pain: 'Moderate (4/10)', symptoms: 'Chest tightening', remarks: 'Informed doctor. ECG trace normal.', nurse: 'Anitha Rajan', date: '2026-07-13T09:30:00Z' },
  { id: 'O003', patient: 'Arun Nair (P001)', condition: 'Critical', medicine: 'IV Saline + Norepinephrine', pain: 'Severe (8/10)', symptoms: 'Shortness of breath', remarks: 'Oxygen therapy adjusted to 4L/min. Doctor in attendance.', nurse: 'Anitha Rajan', date: '2026-07-13T08:15:00Z' }
];

export default function Observations() {
  const [obs, setObs] = useState(INITIAL_OBSERVATIONS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newObs, setNewObs] = useState({ patient: '', condition: 'Stable', medicine: '', pain: 'None (0/10)', symptoms: '', remarks: '' });

  const filtered = obs.filter(o => 
    o.patient.toLowerCase().includes(search.toLowerCase()) || 
    o.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newObs.patient || !newObs.remarks) return;
    const item = {
      id: `O${String(obs.length + 1).padStart(3, '0')}`,
      patient: newObs.patient,
      condition: newObs.condition,
      medicine: newObs.medicine || 'None',
      pain: newObs.pain,
      symptoms: newObs.symptoms || 'None reported',
      remarks: newObs.remarks,
      nurse: 'Anitha Rajan',
      date: new Date().toISOString()
    };
    setObs(prev => [item, ...prev]);
    setShowAddModal(false);
    setNewObs({ patient: '', condition: 'Stable', medicine: '', pain: 'None (0/10)', symptoms: '', remarks: '' });
  };

  const getCondVariant = (c) => {
    if (c === 'Critical') return 'critical';
    if (c === 'Under Observation') return 'warning';
    return 'success';
  };

  return (
    <div className="observations-page animate-fade-in-up">
      <div className="observations-page__header">
        <div>
          <h1 className="page-title">Observations & Shifts</h1>
          <p className="page-subtitle">Shift record observations, pain level assessment, and symptoms checklist</p>
        </div>
        <button className="patients-page__add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> New Shift Observation
        </button>
      </div>

      <div className="observations-page__filters">
        <div className="audit-logs-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by patient name, symptom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="observations-list">
        {filtered.map(o => (
          <Card key={o.id} padding="md" className="obs-card">
            <div className="obs-card__header">
              <span className="obs-card__patient-name">{o.patient}</span>
              <Badge variant={getCondVariant(o.condition)} size="sm">{o.condition}</Badge>
            </div>
            <div className="obs-details-grid">
              <div><span>Administered Medicine</span><strong>{o.medicine}</strong></div>
              <div><span>Pain Assessment</span><strong>{o.pain}</strong></div>
              <div><span>Active Symptoms</span><strong>{o.symptoms}</strong></div>
              <div><span>Recorded Time</span><strong>{new Date(o.date).toLocaleTimeString()}</strong></div>
            </div>
            <div className="obs-remarks-section">
              <span className="obs-remarks-label">Clinical Remarks</span>
              <p className="obs-remarks-text">{o.remarks}</p>
            </div>
            <div className="obs-card-footer">
              <span>Logged by Nurse: {o.nurse}</span>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="obs-empty">
            <ClipboardList size={48} color="var(--color-text-muted)" />
            <p>No shift observations found</p>
          </div>
        )}
      </div>

      {/* Add Observation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-box__header">
              <h3>Record Shift Observation</h3>
              <button className="modal-box__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-box__body">
              <div className="modal-form-vertical">
                <div className="modal-field">
                  <label>Patient Reference</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mohan Kumar (P013)" 
                    value={newObs.patient} 
                    onChange={e => setNewObs(f => ({ ...f, patient: e.target.value }))}
                  />
                </div>
                <div className="modal-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="modal-field">
                    <label>Condition Status</label>
                    <select 
                      value={newObs.condition} 
                      onChange={e => setNewObs(f => ({ ...f, condition: e.target.value }))}
                      style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}
                    >
                      <option>Stable</option>
                      <option>Under Observation</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div className="modal-field">
                    <label>Pain Scale Score</label>
                    <select 
                      value={newObs.pain} 
                      onChange={e => setNewObs(f => ({ ...f, pain: e.target.value }))}
                      style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}
                    >
                      <option>None (0/10)</option>
                      <option>Mild (1-3/10)</option>
                      <option>Moderate (4-6/10)</option>
                      <option>Severe (7-10/10)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-field">
                  <label>Administered Medicine / Dose</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acetaminophen 500mg or Metoprolol 25mg" 
                    value={newObs.medicine} 
                    onChange={e => setNewObs(f => ({ ...f, medicine: e.target.value }))}
                  />
                </div>
                <div className="modal-field">
                  <label>Symptoms Reported</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dizziness, nausea, mild fever" 
                    value={newObs.symptoms} 
                    onChange={e => setNewObs(f => ({ ...f, symptoms: e.target.value }))}
                  />
                </div>
                <div className="modal-field">
                  <label>Shift Remarks & Assessment</label>
                  <textarea 
                    rows={3} 
                    placeholder="Detailed condition description or next actions..."
                    value={newObs.remarks} 
                    onChange={e => setNewObs(f => ({ ...f, remarks: e.target.value }))}
                    style={{ padding: '12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-box__footer">
              <button className="modal-btn modal-btn--cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn--save" onClick={handleCreate}>Save Observation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
