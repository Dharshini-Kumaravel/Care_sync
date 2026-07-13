import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, DOCTORS, NURSES } from '../data/mockData';
import { 
  ArrowLeft, Heart, Thermometer, Wind, Droplets, Activity, Brain, 
  User, MapPin, Phone, Calendar, Clipboard, ShieldAlert, Sparkles, Plus, Check 
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Card, { CardHeader } from '../components/common/Card';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import './PatientDetail.css';

function getRiskVariant(r) { return r === 'Critical' ? 'critical' : r === 'High' ? 'high' : r === 'Medium' ? 'warning' : 'low'; }

function VitalBox({ icon: Icon, label, value, unit, color, normal }) {
  return (
    <div className="vital-box" style={{ borderTop: `3px solid ${color}` }}>
      <div className="vital-box__icon" style={{ color }}><Icon size={16} /></div>
      <div className="vital-box__label">{label}</div>
      <div className="vital-box__value" style={{ color }}>{value}<span className="vital-box__unit">{unit}</span></div>
      <div className="vital-box__normal">Normal: {normal}</div>
    </div>
  );
}

function RiskGauge({ score }) {
  const color = score < 30 ? '#EF4444' : score < 60 ? '#F59E0B' : '#22C55E';
  const label = score < 30 ? 'Critical' : score < 60 ? 'Moderate Risk' : 'Stable';
  return (
    <div className="risk-gauge">
      <svg viewBox="0 0 200 110" className="risk-gauge__svg">
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 283} 283`} />
        <text x="100" y="90" textAnchor="middle" fontSize="28" fontWeight="800" fill={color}>{score}</text>
        <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#94A3B8">PSI Score</text>
      </svg>
      <div className="risk-gauge__label" style={{ color }}>{label}</div>
    </div>
  );
}

export default function PatientDetail() {
  const { id } = useParams();
  const { patients, alerts } = useSimulation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const patient = patients.find(p => p.id === id);
  if (!patient) return <div className="patient-detail__not-found">Patient not found. <button onClick={() => navigate('/patients')}>Go back</button></div>;

  const role = user?.role || 'Admin';
  const isAdmin = role === 'Admin';
  const isDoctor = role === 'Doctor';
  const isNurse = role === 'Nurse';

  // Role-based tabs selection
  const tabs = isDoctor
    ? ['Overview', 'Vitals', 'Risk Analysis', 'Predictions', 'Timeline', 'Alerts', 'Doctor Notes', 'Activity']
    : isNurse
      ? ['Overview', 'Vitals', 'Observations', 'Alerts', 'Timeline']
      : ['Overview', 'Vitals', 'Risk Analysis', 'Predictions', 'Timeline', 'Alerts', 'Doctor Notes', 'Observations', 'Activity'];

  const [activeTab, setActiveTab] = useState('Overview');

  // Input states for Vitals updates (Nurses/Admins)
  const [newHR, setNewHR] = useState(patient.vitals.heartRate);
  const [newSpO2, setNewSpO2] = useState(patient.vitals.spo2);
  const [newSystolic, setNewSystolic] = useState(patient.vitals.systolic);
  const [newDiastolic, setNewDiastolic] = useState(patient.vitals.diastolic);
  const [newTemp, setNewTemp] = useState(patient.vitals.temperature);
  const [newResp, setNewResp] = useState(patient.vitals.respiration);
  const [vitalsSaved, setVitalsSaved] = useState(false);

  // Input states for Observations (Nurses/Admins)
  const [obsCondition, setObsCondition] = useState('Stable');
  const [obsMedicine, setObsMedicine] = useState('');
  const [obsPain, setObsPain] = useState('None (0/10)');
  const [obsSymptoms, setObsSymptoms] = useState('');
  const [obsRemarks, setObsRemarks] = useState('');
  const [observationsList, setObservationsList] = useState([
    { nurse: 'Anitha Rajan', condition: 'Stable', medicine: 'Acetaminophen 500mg', pain: 'Mild (2/10)', symptoms: 'Slight headache', remarks: 'Patient resting comfortably. Vitals stable.', time: new Date().toISOString() }
  ]);

  // Input states for Doctor Notes (Doctors/Admins)
  const [docNotesType, setDocNotesType] = useState('Prescription Notes');
  const [docNotesTitle, setDocNotesTitle] = useState('');
  const [docNotesText, setDocNotesText] = useState('');
  const [diagnosisVal, setDiagnosisVal] = useState(patient.diagnosis);
  const [doctorNotesList, setDoctorNotesList] = useState([
    { author: 'Dr. Priya Nair', type: 'Medical Notes', title: 'Cardiology Review', content: `Patient shows stable signs. Diagnosis confirmed: ${patient.diagnosis}. Continue regular vitals monitoring.`, time: new Date(Date.now() - 3600000).toISOString() }
  ]);

  const [isAttendingClaimed, setIsAttendingClaimed] = useState(
    patient.status === 'Attended' || patient.status === 'Attended & Under Care' || patient.status === 'Doctor Attending'
  );
  const [clinicalUpdateText, setClinicalUpdateText] = useState('');
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const handleClaimCase = () => {
    setIsAttendingClaimed(true);
    patient.status = 'Doctor Attending';
  };

  const handleSubmitAssessment = (e) => {
    e.preventDefault();
    if (!clinicalUpdateText) return;
    const newNoteObj = {
      author: user?.name || 'Doctor',
      type: 'Clinical Assessment',
      title: 'Immediate Critical Care Intervention Plan',
      content: clinicalUpdateText,
      time: new Date().toISOString()
    };
    setDoctorNotesList(prev => [newNoteObj, ...prev]);
    patient.status = 'Attended';
    setAssessmentSubmitted(true);
    setClinicalUpdateText('');
  };

  const dept = DEPARTMENTS.find(d => d.id === patient.dept);
  const doctor = DOCTORS.find(d => d.id === patient.doctor);
  const nurse = NURSES.find(n => n.id === patient.nurse);
  const patientAlerts = alerts.filter(a => a.patientId === patient.id);

  const { vitals, vitalsHistory } = patient;

  const handleUpdateVitals = (e) => {
    e.preventDefault();
    patient.vitals.heartRate = parseInt(newHR);
    patient.vitals.spo2 = parseInt(newSpO2);
    patient.vitals.systolic = parseInt(newSystolic);
    patient.vitals.diastolic = parseInt(newDiastolic);
    patient.vitals.temperature = parseFloat(newTemp);
    patient.vitals.respiration = parseInt(newResp);
    setVitalsSaved(true);
    setTimeout(() => setVitalsSaved(false), 2000);
  };

  const handleAddObservation = (e) => {
    e.preventDefault();
    if (!obsRemarks) return;
    const newObsObj = {
      nurse: user?.name || 'Nurse',
      condition: obsCondition,
      medicine: obsMedicine || 'None',
      pain: obsPain,
      symptoms: obsSymptoms || 'None reported',
      remarks: obsRemarks,
      time: new Date().toISOString()
    };
    setObservationsList(prev => [newObsObj, ...prev]);
    setObsRemarks('');
    setObsMedicine('');
    setObsSymptoms('');
  };

  const handleAddDoctorNote = (e) => {
    e.preventDefault();
    if (!docNotesTitle || !docNotesText) return;
    const newNoteObj = {
      author: user?.name || 'Doctor',
      type: docNotesType,
      title: docNotesTitle,
      content: docNotesText,
      time: new Date().toISOString()
    };
    setDoctorNotesList(prev => [newNoteObj, ...prev]);
    patient.diagnosis = diagnosisVal; // update in-memory patient diagnosis
    setDocNotesTitle('');
    setDocNotesText('');
  };

  return (
    <div className="patient-detail animate-fade-in-up">
      {/* Back */}
      <button className="patient-detail__back" onClick={() => navigate('/patients')}>
        <ArrowLeft size={16} /> Back to Patients
      </button>

      {/* Hero */}
      <div className="patient-detail__hero">
        <div className="patient-detail__hero-left">
          <div className="patient-detail__avatar" style={{ background: `${dept?.color}20`, color: dept?.color }}>
            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="patient-detail__hero-info">
            <div className="patient-detail__name">{patient.name}</div>
            <div className="patient-detail__meta">
              <span>{patient.id}</span>
              <span>·</span>
              <span>{patient.age} years · {patient.gender}</span>
              <span>·</span>
              <span>{patient.bloodGroup}</span>
            </div>
            <div className="patient-detail__tags">
              <Badge variant={getRiskVariant(patient.risk)} dot={patient.risk === 'Critical'} pulse={patient.risk === 'Critical'} size="md">{patient.risk} Risk</Badge>
              <span className="patient-detail__dept-tag" style={{ background: `${dept?.color}15`, color: dept?.color }}>{dept?.name}</span>
              <span className="patient-detail__bed-tag">Bed {patient.bed}</span>
            </div>
          </div>
        </div>
        <div className="patient-detail__hero-stats">
          <div className="patient-detail__hero-stat">
            <div className="patient-detail__hero-stat-val">{patient.psi}</div>
            <div className="patient-detail__hero-stat-label">PSI Score</div>
          </div>
          <div className="patient-detail__hero-stat">
            <div className="patient-detail__hero-stat-val">{patient.vitals.heartRate}</div>
            <div className="patient-detail__hero-stat-label">Heart Rate</div>
          </div>
          <div className="patient-detail__hero-stat">
            <div className="patient-detail__hero-stat-val">{patient.vitals.spo2}%</div>
            <div className="patient-detail__hero-stat-label">SpO₂</div>
          </div>
          <div className="patient-detail__hero-stat">
            <div className="patient-detail__hero-stat-val">{patient.vitals.temperature}°</div>
            <div className="patient-detail__hero-stat-label">Temp (°C)</div>
          </div>
        </div>
      </div>

      {/* Critical Patient Doctor Attending Banner */}
      {patient.risk === 'Critical' && (user?.role === 'Doctor' || user?.role === 'Admin') && (
        <div className="clinical-claim-banner animate-scale-in" style={{ marginBottom: '24px' }}>
          {!isAttendingClaimed ? (
            <div className="clinical-claim-banner__unclaimed" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-critical-light)', border: '1.5px solid var(--color-critical)', borderRadius: '16px', padding: '16px 20px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.75rem' }}>🚨</span>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-critical)' }}>Unattended Critical Case</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>AI models flagged acute deterioration. No doctor has claimed responsibility for this patient.</p>
                </div>
              </div>
              <button 
                onClick={handleClaimCase}
                style={{ background: 'var(--color-critical)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(231, 111, 81, 0.2)' }}
              >
                Claim Case & Attend
              </button>
            </div>
          ) : (
            <div className="clinical-claim-banner__claimed" style={{ background: 'var(--color-primary-light)', border: '1.5px solid var(--color-border)', borderRadius: '16px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', color: 'var(--color-success)', fontWeight: 800 }}>✓</span>
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>Case Claimed By You</h5>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Please log an immediate physiological assessment update for the medical records.</p>
                </div>
              </div>
              {patient.status === 'Doctor Attending' ? (
                <form onSubmit={handleSubmitAssessment} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea 
                    placeholder="Enter immediate clinical intervention (e.g. Administered IV saline, titrated O2 mask to 5L/min, scheduled bedside Echo)..."
                    value={clinicalUpdateText}
                    onChange={e => setClinicalUpdateText(e.target.value)}
                    required
                    style={{ width: '100%', minHeight: '60px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.78rem', color: 'var(--color-text)', background: 'var(--color-surface)', outline: 'none', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                  />
                  <button 
                    type="submit" 
                    style={{ alignSelf: 'flex-end', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Submit Clinical Update
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: '8px', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.78rem' }}>
                  ✓ Immediate intervention logged. Patient status updated to: Attended & Under Care.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="patient-detail__tabs">
        {tabs.map(tab => (
          <button key={tab} className={`patient-detail__tab ${activeTab === tab ? 'patient-detail__tab--active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="patient-detail__content">
        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="patient-detail__overview">
            <div className="patient-detail__overview-grid">
              {/* Patient Info */}
              <div className="patient-detail__info-card">
                <h4>Patient Information</h4>
                <div className="patient-detail__info-list">
                  <div className="patient-detail__info-row"><User size={14} /><span>Diagnosis</span><strong>{patient.diagnosis}</strong></div>
                  <div className="patient-detail__info-row"><Calendar size={14} /><span>Admitted</span><strong>{patient.admitDate}</strong></div>
                  <div className="patient-detail__info-row"><MapPin size={14} /><span>Ward</span><strong>{patient.ward} · {patient.floor}</strong></div>
                  <div className="patient-detail__info-row"><Phone size={14} /><span>Emergency</span><strong>{patient.emergency_contact}</strong></div>
                  <div className="patient-detail__info-row"><Activity size={14} /><span>Insurance</span><strong>{patient.insurance}</strong></div>
                </div>
              </div>

              {/* Care Team */}
              <div className="patient-detail__info-card">
                <h4>Care Team</h4>
                {doctor && (
                  <div className="patient-detail__care-member">
                    <div className="patient-detail__care-avatar" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                      {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="patient-detail__care-name">{doctor.name}</div>
                      <div className="patient-detail__care-role">{doctor.specialization} · {doctor.experience} yrs exp</div>
                    </div>
                    <Badge variant="info" size="sm">Doctor</Badge>
                  </div>
                )}
                {nurse && (
                  <div className="patient-detail__care-member">
                    <div className="patient-detail__care-avatar" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                      {nurse.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="patient-detail__care-name">{nurse.name}</div>
                      <div className="patient-detail__care-role">{nurse.dept.toUpperCase()} · {nurse.shift} Shift</div>
                    </div>
                    <Badge variant="success" size="sm">Nurse</Badge>
                  </div>
                )}
              </div>

              {/* Current Vitals Quick */}
              <div className="patient-detail__info-card">
                <h4>Current Vitals</h4>
                <div className="patient-detail__vitals-quick">
                  <div className="patient-detail__vq-item"><span>Heart Rate</span><strong style={{ color: '#EF4444' }}>{vitals.heartRate} bpm</strong></div>
                  <div className="patient-detail__vq-item"><span>SpO₂</span><strong style={{ color: '#2563EB' }}>{vitals.spo2}%</strong></div>
                  <div className="patient-detail__vq-item"><span>Blood Pressure</span><strong style={{ color: '#8B5CF6' }}>{vitals.systolic}/{vitals.diastolic}</strong></div>
                  <div className="patient-detail__vq-item"><span>Temperature</span><strong style={{ color: '#F59E0B' }}>{vitals.temperature}°C</strong></div>
                  <div className="patient-detail__vq-item"><span>Respiration</span><strong style={{ color: '#06B6D4' }}>{vitals.respiration}/min</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'Vitals' && (
          <div className="patient-detail__vitals">
            <div className="patient-detail__vitals-cards">
              <VitalBox icon={Heart} label="Heart Rate" value={vitals.heartRate} unit=" bpm" color="#EF4444" normal="60–100 bpm" />
              <VitalBox icon={Droplets} label="SpO₂" value={vitals.spo2} unit="%" color="#2563EB" normal="95–100%" />
              <VitalBox icon={Activity} label="Blood Pressure" value={`${vitals.systolic}/${vitals.diastolic}`} unit=" mmHg" color="#8B5CF6" normal="120/80" />
              <VitalBox icon={Thermometer} label="Temperature" value={vitals.temperature} unit="°C" color="#F59E0B" normal="36.5–37.5°C" />
              <VitalBox icon={Wind} label="Respiration" value={vitals.respiration} unit="/min" color="#06B6D4" normal="12–20/min" />
            </div>

            {/* Nurse and Admin Vitals Update Controls */}
            {(isNurse || isAdmin) && (
              <Card padding="md" style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', fontWeight: 700 }}>Record New Physiological Vitals</h4>
                <form className="vitals-update-form" onSubmit={handleUpdateVitals}>
                  <div className="vitals-input-grid">
                    <div className="vital-field">
                      <label>Heart Rate (bpm)</label>
                      <input type="number" value={newHR} onChange={e => setNewHR(e.target.value)} />
                    </div>
                    <div className="vital-field">
                      <label>SpO₂ Oxygen %</label>
                      <input type="number" value={newSpO2} onChange={e => setNewSpO2(e.target.value)} />
                    </div>
                    <div className="vital-field">
                      <label>Systolic BP</label>
                      <input type="number" value={newSystolic} onChange={e => setNewSystolic(e.target.value)} />
                    </div>
                    <div className="vital-field">
                      <label>Diastolic BP</label>
                      <input type="number" value={newDiastolic} onChange={e => setNewDiastolic(e.target.value)} />
                    </div>
                    <div className="vital-field">
                      <label>Temp (°C)</label>
                      <input type="number" step="0.1" value={newTemp} onChange={e => setNewTemp(e.target.value)} />
                    </div>
                    <div className="vital-field">
                      <label>Respiration Rate</label>
                      <input type="number" value={newResp} onChange={e => setNewResp(e.target.value)} />
                    </div>
                  </div>
                  <div className="vitals-update-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button type="submit" className="patients-page__add-btn" style={{ padding: '8px 16px' }}>
                      Update Vitals
                    </button>
                    {vitalsSaved && <Badge variant="success"><Check size={12} /> Saved Successfully</Badge>}
                  </div>
                </form>
              </Card>
            )}

            <div className="patient-detail__vitals-charts">
              <div className="patient-detail__vitals-chart-card">
                <h5>Heart Rate Trend (24h)</h5>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={vitalsHistory} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                    <defs>
                      <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={3} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[40, 180]} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="heartRate" name="HR" stroke="#EF4444" strokeWidth={2} fill="url(#hrGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="patient-detail__vitals-chart-card">
                <h5>SpO₂ Trend (24h)</h5>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={vitalsHistory} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={3} />
                    <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[70, 100]} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="spo2" name="SpO₂" stroke="#2563EB" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'Risk Analysis' && (
          <div className="patient-detail__risk">
            <div className="patient-detail__risk-grid">
              <div className="patient-detail__risk-gauge-card">
                <h4>Patient Stability Index</h4>
                <RiskGauge score={patient.psi} />
                <div className="patient-detail__risk-summary">
                  <Badge variant={getRiskVariant(patient.risk)} size="lg">{patient.risk} Risk</Badge>
                  <p>AI Confidence: <strong>{patient.aiConfidence}%</strong></p>
                </div>
              </div>
              <div className="patient-detail__risk-reasons-card">
                <h4>Explainable AI Factors</h4>
                {patient.aiReasons.length === 0 && <p className="risk-no-factors">No critical factors detected. Patient appears stable.</p>}
                {patient.aiReasons.map((r, i) => (
                  <div key={i} className="patient-detail__risk-reason">
                    <div className={`risk-reason__severity severity--${r.severity.toLowerCase()}`}>{r.severity}</div>
                    <div className="risk-reason__body">
                      <div className="risk-reason__factor">{r.factor}</div>
                      <div className="risk-reason__value">{r.value}</div>
                    </div>
                    <div className="risk-reason__bar">
                      <div className="risk-reason__bar-fill" style={{
                        width: r.severity === 'Critical' ? '90%' : r.severity === 'High' ? '65%' : '40%',
                        background: r.severity === 'Critical' ? '#EF4444' : r.severity === 'High' ? '#EA580C' : '#F59E0B'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PSI Historical Trend Line Chart */}
            <Card padding="md" style={{ marginTop: '24px' }}>
              <CardHeader title="Patient Stability Index (PSI) Historical Trend" subtitle="Real-time monitoring history" icon={Activity} iconColor="#2563EB" />
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={patient.psiHistory} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="psiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="psi" name="PSI Score" stroke="#2563EB" strokeWidth={2} fill="url(#psiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'Predictions' && (
          <div className="patient-detail__predictions animate-fade-in-up">
            <div className="patient-detail__predictions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <Card padding="md">
                <CardHeader title="Clinical Deterioration Prognosis" subtitle="Deterioration metrics forecast" icon={Brain} iconColor="#8B5CF6" />
                <div className="prediction-gauge-holder" style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: patient.risk === 'Critical' ? '#EF4444' : '#22C55E' }}>
                    {Math.max(5, Math.min(99, 100 - patient.psi + (patient.id.charCodeAt(0) % 5)))}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Deterioration probability within next 12h</div>
                </div>
                <div className="prediction-factors-checklist" style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Prognostic Insights</div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>SpO2 trend projection suggests hypoxia stability at current O2 supply settings.</li>
                    <li>MAP levels stable. Heart Rate tracking normal circadian cycle.</li>
                    <li>Prognostic stability index (PSI) is predicted to improve if respiration remains under 20.</li>
                  </ul>
                </div>
              </Card>

              <Card padding="md">
                <CardHeader title="Recovery & Roster forecast" subtitle="Hospital discharge projection" icon={Sparkles} iconColor="#22C55E" />
                <div className="prediction-gauge-holder" style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22C55E' }}>
                    {Math.max(5, Math.min(99, patient.psi - (patient.id.charCodeAt(0) % 5)))}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Probability of discharge within 4 days</div>
                </div>
                <div className="prediction-factors-checklist" style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Roster & Bed recommendations</div>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Maintain patient monitoring stream for another 24 hours.</li>
                    <li>If stability holds, transfer to General Ward stepdown on Wednesday.</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Observations Tab (Nurses/Admins) */}
        {activeTab === 'Observations' && (
          <div className="patient-detail__observations animate-fade-in-up">
            {(isNurse || isAdmin) && (
              <Card padding="md" style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', fontWeight: 700 }}>Record Shift Roster Observation</h4>
                <form onSubmit={handleAddObservation} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="obs-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="obs-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Condition Status</label>
                      <select value={obsCondition} onChange={e => setObsCondition(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}>
                        <option>Stable</option>
                        <option>Under Observation</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div className="obs-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Pain Level Scale</label>
                      <select value={obsPain} onChange={e => setObsPain(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}>
                        <option>None (0/10)</option>
                        <option>Mild (1-3/10)</option>
                        <option>Moderate (4-6/10)</option>
                        <option>Severe (7-10/10)</option>
                      </select>
                    </div>
                    <div className="obs-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Medicine Dose Given</label>
                      <input type="text" placeholder="e.g. Paracetamol 500mg" value={obsMedicine} onChange={e => setObsMedicine(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }} />
                    </div>
                  </div>
                  <div className="obs-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Reported Active Symptoms</label>
                    <input type="text" placeholder="e.g. Mild headache, dizziness on sitting up" value={obsSymptoms} onChange={e => setObsSymptoms(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }} />
                  </div>
                  <div className="obs-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Observation Remarks</label>
                    <textarea rows={3} placeholder="Describe patient behaviour, pain details, physical state..." value={obsRemarks} onChange={e => setObsRemarks(e.target.value)} style={{ padding: '12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="patients-page__add-btn" style={{ padding: '8px 16px' }}>Save Observation</button>
                  </div>
                </form>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {observationsList.map((o, idx) => (
                <div key={idx} className="patient-detail__note-card">
                  <div className="patient-detail__note-header">
                    <strong>Nurse: {o.nurse}</strong>
                    <span>{new Date(o.time).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    <span>Condition: <strong>{o.condition}</strong></span>
                    <span>·</span>
                    <span>Pain: <strong>{o.pain}</strong></span>
                    <span>·</span>
                    <span>Medicine Given: <strong>{o.medicine}</strong></span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {o.remarks}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'Alerts' && (
          <div className="patient-detail__alerts">
            {patientAlerts.length === 0 && <div className="patient-detail__empty">No alerts for this patient.</div>}
            {patientAlerts.map(a => (
              <div key={a.id} className={`patient-alert-item alert-item--${a.severity}`}>
                <div className={`patient-alert-item__dot dot--${a.severity}`} />
                <div className="patient-alert-item__body">
                  <div className="patient-alert-item__type">{a.type}</div>
                  <div className="patient-alert-item__msg">{a.message}</div>
                  <div className="patient-alert-item__time">{new Date(a.timestamp).toLocaleString()}</div>
                </div>
                <Badge variant={a.severity === 'critical' ? 'critical' : a.severity === 'high' ? 'high' : 'warning'} size="sm">{a.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'Timeline' && (
          <div className="patient-detail__timeline">
            {[
              { time: patient.admitDate, event: 'Patient Admitted', note: `Admitted to ${dept?.name}`, color: '#2563EB' },
              { time: patient.admitDate, event: 'Initial Assessment', note: `Diagnosis: ${patient.diagnosis}`, color: '#22C55E' },
              { time: new Date(Date.now() - 86400000).toLocaleDateString(), event: 'Doctor Review', note: `Reviewed by ${doctor?.name}`, color: '#8B5CF6' },
              { time: new Date().toLocaleDateString(), event: 'Vitals Monitored', note: `SpO₂: ${vitals.spo2}% · HR: ${vitals.heartRate} bpm`, color: '#F59E0B' },
            ].map((e, i) => (
              <div key={i} className="patient-timeline-item">
                <div className="patient-timeline-item__dot" style={{ background: e.color }} />
                <div className="patient-timeline-item__line" />
                <div className="patient-timeline-item__content">
                  <div className="patient-timeline-item__time">{e.time}</div>
                  <div className="patient-timeline-item__event">{e.event}</div>
                  <div className="patient-timeline-item__note">{e.note}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Doctor Notes Tab (Doctors/Admins) */}
        {activeTab === 'Doctor Notes' && (
          <div className="patient-detail__notes animate-fade-in-up">
            {(isDoctor || isAdmin) && (
              <Card padding="md" style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', fontWeight: 700 }}>Record Doctor Review & Notes</h4>
                <form onSubmit={handleAddDoctorNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="doctor-note-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="modal-field">
                      <label>Note Classification Type</label>
                      <select value={docNotesType} onChange={e => setDocNotesType(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }}>
                        <option>Prescription Notes</option>
                        <option>Medical Notes</option>
                        <option>Treatment Notes</option>
                      </select>
                    </div>
                    <div className="modal-field">
                      <label>Update Clinical Diagnosis</label>
                      <input type="text" value={diagnosisVal} onChange={e => setDiagnosisVal(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }} />
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>Review Subject / Title</label>
                    <input type="text" placeholder="e.g. ST segment elevation follow-up" value={docNotesTitle} onChange={e => setDocNotesTitle(e.target.value)} style={{ height: '40px', padding: '0 12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none' }} />
                  </div>
                  <div className="modal-field">
                    <label>Detailed Clinical Notes / Instructions</label>
                    <textarea rows={3} placeholder="Prescribe dosages, request physical reviews, or outline treatment checklist..." value={docNotesText} onChange={e => setDocNotesText(e.target.value)} style={{ padding: '12px', border: '1.5px solid var(--color-border)', borderRadius: '12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="patients-page__add-btn" style={{ padding: '8px 16px' }}>Save Clinical Note</button>
                  </div>
                </form>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {doctorNotesList.map((n, idx) => (
                <div key={idx} className="patient-detail__note-card">
                  <div className="patient-detail__note-header">
                    <strong>{n.author}</strong>
                    <span>{new Date(n.time).toLocaleString()}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Badge variant={n.type === 'Prescription Notes' ? 'critical' : n.type === 'Medical Notes' ? 'primary' : 'success'} size="sm">
                      {n.type}
                    </Badge>
                  </div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{n.title}</h5>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab (Doctors/Admins) */}
        {activeTab === 'Activity' && (
          <div className="patient-detail__activity animate-fade-in-up">
            <div className="activity-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { time: '2026-07-13T10:15:00Z', title: 'Diagnosis Updated', desc: `Clinical diagnosis modified to: ${patient.diagnosis}`, icon: Clipboard, color: '#8B5CF6' },
                { time: '2026-07-13T09:30:00Z', title: 'Vitals Stream Checked', desc: `Oxygen levels recorded at ${vitals.spo2}%.`, icon: Activity, color: '#2563EB' },
                { time: '2026-07-13T08:12:00Z', title: 'Roster Review logged', desc: 'Shift checklist reviewed by ward duty nurse.', icon: Calendar, color: '#22C55E' }
              ].map((act, i) => (
                <div key={i} className="patient-detail__care-member" style={{ borderBottom: 'none', padding: '8px 0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="activity-icon-holder" style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${act.color}15`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <act.icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text)' }}>{act.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{act.desc} · {new Date(act.time).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
