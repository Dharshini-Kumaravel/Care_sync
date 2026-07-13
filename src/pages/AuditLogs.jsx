import { useState } from 'react';
import Card, { CardHeader } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { ScrollText, Search, ShieldAlert } from 'lucide-react';
import './AuditLogs.css';

const INITIAL_LOGS = [
  { id: 'LOG001', user: 'Dr. Priya Nair', role: 'Doctor', action: 'Update Diagnosis', time: '2026-07-13T10:15:00Z', prevValue: 'Acute MI', newValue: 'Myocardial Infarction with complications' },
  { id: 'LOG002', user: 'Anitha Rajan', role: 'Nurse', action: 'Record Observation', time: '2026-07-13T10:12:00Z', prevValue: 'Pain: None', newValue: 'Pain level 4 (mild abdominal)' },
  { id: 'LOG003', user: 'Dr. Admin Kumar', role: 'Admin', action: 'Assign Doctor', time: '2026-07-13T09:45:00Z', prevValue: 'Unassigned', newValue: 'Dr. Rajesh Sharma' },
  { id: 'LOG004', user: 'Anitha Rajan', role: 'Nurse', action: 'Update Vitals', time: '2026-07-13T09:30:00Z', prevValue: 'SpO2: 94%', newValue: 'SpO2: 89% (Alert Triggered)' },
  { id: 'LOG005', user: 'Dr. Priya Nair', role: 'Doctor', action: 'Add Medical Note', time: '2026-07-13T08:50:00Z', prevValue: '-', newValue: 'Prescribed 5mg Metoprolol' },
  { id: 'LOG006', user: 'Dr. Admin Kumar', role: 'Admin', action: 'Transfer Patient Bed', time: '2026-07-13T08:12:00Z', prevValue: 'Bed ICU-15', newValue: 'Bed CARD-03' },
  { id: 'LOG007', user: 'Shalini Mehta', role: 'Nurse', action: 'Resolve Alert', time: '2026-07-13T07:30:00Z', prevValue: 'SpO2 Alert Active', newValue: 'Vitals stabilized, oxygen mask adjusted' }
];

export default function AuditLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => 
    l.user.toLowerCase().includes(search.toLowerCase()) || 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="audit-logs-page animate-fade-in-up">
      <div className="audit-logs-page__header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Security log of all user activities and clinical data alterations</p>
        </div>
        <Badge variant="neutral" dot pulse>Secure Environment</Badge>
      </div>

      <div className="audit-logs-page__search-bar">
        <div className="audit-logs-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by user name, action type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card padding="none">
        <table className="audit-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Previous Value</th>
              <th>New Value</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id}>
                <td className="audit-id">{l.id}</td>
                <td>
                  <div className="audit-user-cell">
                    <span className="audit-user-name">{l.user}</span>
                    <span className="audit-user-role">{l.role}</span>
                  </div>
                </td>
                <td>
                  <span className={`action-badge action-${l.action.toLowerCase().replace(/\s/g, '-')}`}>
                    {l.action}
                  </span>
                </td>
                <td className="audit-prev">{l.prevValue}</td>
                <td className="audit-new">{l.newValue}</td>
                <td className="audit-time">{new Date(l.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="audit-empty">
            <ShieldAlert size={40} color="var(--color-text-muted)" />
            <p>No audit entries found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
