import { useState } from 'react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { FileText, Plus, Search, Check, Trash2, Clipboard } from 'lucide-react';
import './Notes.css';

const INITIAL_NOTES = [
  { id: 'N001', type: 'Prescription Notes', patient: 'Deepak Pillai (P004)', title: 'Hypertension Management', content: 'Metoprolol Succinate 25mg daily. Monitor blood pressure morning/evening. Restrict sodium intake to 1500mg/day.', author: 'Dr. Priya Nair', date: '2026-07-13T10:15:00Z' },
  { id: 'N002', type: 'Medical Notes', patient: 'Deepak Pillai (P004)', title: 'Initial Cardiology Consultation', content: 'Patient presenting with recurring angina and mild exertion fatigue. ECG shows minor ST segment abnormalities. Scheduled stress test next Tuesday.', author: 'Dr. Priya Nair', date: '2026-07-12T14:30:00Z' },
  { id: 'N003', type: 'Treatment Notes', patient: 'Sita Sharma (P018)', title: 'Post-Arthroplasty Routine', content: 'Physical therapy protocol A thrice weekly. Incision clean with no erythema or active drainage. Remove staples on Friday.', author: 'Dr. Vikram Mehta', date: '2026-07-11T09:15:00Z' }
];

export default function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({ type: 'Prescription Notes', patient: '', title: '', content: '' });

  const filtered = notes.filter(n => {
    if (activeFilter !== 'All' && n.type !== activeFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.patient.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!newNote.patient || !newNote.title || !newNote.content) return;
    const item = {
      id: `N${String(notes.length + 1).padStart(3, '0')}`,
      type: newNote.type,
      patient: newNote.patient,
      title: newNote.title,
      content: newNote.content,
      author: 'Dr. Priya Nair',
      date: new Date().toISOString()
    };
    setNotes(prev => [item, ...prev]);
    setShowAddModal(false);
    setNewNote({ type: 'Prescription Notes', patient: '', title: '', content: '' });
  };

  return (
    <div className="notes-page animate-fade-in-up">
      <div className="notes-page__header">
        <div>
          <h1 className="page-title">Clinical Notes</h1>
          <p className="page-subtitle">Prescription, Medical, and Treatment records archive</p>
        </div>
        <button className="patients-page__add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> New Clinical Note
        </button>
      </div>

      {/* Filters and search */}
      <div className="notes-page__filters">
        <div className="notes-filters-row">
          {['All', 'Prescription Notes', 'Medical Notes', 'Treatment Notes'].map(filter => (
            <button 
              key={filter} 
              className={`note-filter-btn ${activeFilter === filter ? 'note-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="audit-logs-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by patient name, title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Clinical Notes Grid */}
      <div className="notes-grid-layout">
        {filtered.map(n => (
          <Card key={n.id} padding="md" className="clinical-note-card">
            <div className="clinical-note-card__header">
              <span className={`note-type-tag note-type-${n.type.toLowerCase().replace(/\s/g, '-')}`}>
                {n.type}
              </span>
              <span className="note-card-date">{new Date(n.date).toLocaleDateString()}</span>
            </div>
            <div className="note-card-patient">
              <Clipboard size={14} />
              <span>{n.patient}</span>
            </div>
            <h4 className="note-card-title">{n.title}</h4>
            <p className="note-card-content">{n.content}</p>
            <div className="note-card-footer">
              <span className="note-card-author">Authored by: {n.author}</span>
              <button 
                className="note-delete"
                onClick={() => setNotes(prev => prev.filter(item => item.id !== n.id))}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="notes-empty">
            <FileText size={48} color="var(--color-text-muted)" />
            <p>No clinical notes found</p>
          </div>
        )}
      </div>

      {/* Add note Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-box__header">
              <h3>Create Clinical Note</h3>
              <button className="modal-box__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-box__body">
              <div className="modal-form-vertical">
                <div className="modal-field">
                  <label>Note Classification Type</label>
                  <select 
                    value={newNote.type} 
                    onChange={e => setNewNote(f => ({ ...f, type: e.target.value }))}
                    style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}
                  >
                    <option>Prescription Notes</option>
                    <option>Medical Notes</option>
                    <option>Treatment Notes</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Patient Reference Info (Name & Bed/ID)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sita Sharma (P018)" 
                    value={newNote.patient} 
                    onChange={e => setNewNote(f => ({ ...f, patient: e.target.value }))}
                  />
                </div>
                <div className="modal-field">
                  <label>Subject / Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Post-OP Recovery Checklist" 
                    value={newNote.title} 
                    onChange={e => setNewNote(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="modal-field">
                  <label>Notes & Detailed Diagnostics</label>
                  <textarea 
                    rows={4} 
                    placeholder="Enter observations, drug dosage information or recovery instructions..."
                    value={newNote.content} 
                    onChange={e => setNewNote(f => ({ ...f, content: e.target.value }))}
                    style={{ padding: '12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-box__footer">
              <button className="modal-btn modal-btn--cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn--save" onClick={handleCreate}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
