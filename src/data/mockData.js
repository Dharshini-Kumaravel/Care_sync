// ─── Mock Data for CareSync AI ───────────────────────────────────────────────

export const DEPARTMENTS = [
  { id: 'icu', name: 'ICU', color: '#EF4444', icon: 'Heart' },
  { id: 'emergency', name: 'Emergency', color: '#F59E0B', icon: 'Zap' },
  { id: 'cardiology', name: 'Cardiology', color: '#EC4899', icon: 'Activity' },
  { id: 'neurology', name: 'Neurology', color: '#8B5CF6', icon: 'Brain' },
  { id: 'orthopedics', name: 'Orthopedics', color: '#06B6D4', icon: 'Bone' },
  { id: 'pediatrics', name: 'Pediatrics', color: '#10B981', icon: 'Baby' },
  { id: 'general', name: 'General Ward', color: '#6366F1', icon: 'Building2' },
];

export const DOCTORS = [
  { id: 'D001', name: 'Dr. Rajesh Sharma', dept: 'icu', specialization: 'Critical Care', avatar: null, patients: 8, experience: 14 },
  { id: 'D002', name: 'Dr. Priya Nair', dept: 'cardiology', specialization: 'Interventional Cardiology', avatar: null, patients: 12, experience: 11 },
  { id: 'D003', name: 'Dr. Amit Verma', dept: 'neurology', specialization: 'Neurointervention', avatar: null, patients: 9, experience: 16 },
  { id: 'D004', name: 'Dr. Sunita Rao', dept: 'emergency', specialization: 'Emergency Medicine', avatar: null, patients: 15, experience: 8 },
  { id: 'D005', name: 'Dr. Vikram Mehta', dept: 'orthopedics', specialization: 'Joint Replacement', avatar: null, patients: 11, experience: 13 },
  { id: 'D006', name: 'Dr. Kavitha Iyer', dept: 'pediatrics', specialization: 'Pediatric Critical Care', avatar: null, patients: 7, experience: 10 },
  { id: 'D007', name: 'Dr. Arjun Singh', dept: 'general', specialization: 'Internal Medicine', avatar: null, patients: 18, experience: 7 },
  { id: 'D008', name: 'Dr. Meena Krishnan', dept: 'icu', specialization: 'Pulmonology', avatar: null, patients: 6, experience: 12 },
  { id: 'D009', name: 'Dr. Rohit Gupta', dept: 'cardiology', specialization: 'Cardiac Surgery', avatar: null, patients: 10, experience: 15 },
  { id: 'D010', name: 'Dr. Deepa Pillai', dept: 'neurology', specialization: 'Epileptology', avatar: null, patients: 8, experience: 9 },
];

export const NURSES = [
  { id: 'N001', name: 'Anitha Rajan', dept: 'icu', shift: 'Morning', patients: ['P001', 'P002', 'P003'], status: 'On Duty' },
  { id: 'N002', name: 'Shalini Mehta', dept: 'icu', shift: 'Evening', patients: ['P004', 'P005'], status: 'On Duty' },
  { id: 'N003', name: 'Rekha Sharma', dept: 'cardiology', shift: 'Morning', patients: ['P010', 'P011', 'P012'], status: 'On Duty' },
  { id: 'N004', name: 'Preethi Nair', dept: 'emergency', shift: 'Night', patients: ['P020', 'P021'], status: 'Off Duty' },
  { id: 'N005', name: 'Lakshmi Devi', dept: 'general', shift: 'Morning', patients: ['P030', 'P031', 'P032'], status: 'On Duty' },
];

const firstNames = ['Arun','Bala','Chandra','Deepak','Eswar','Farida','Geetha','Hari','Indira','Jaya','Kiran','Lalitha','Mohan','Nisha','Om','Parvathi','Raghu','Sita','Tamil','Uma','Venkat','Wajid','Xavier','Yashoda','Zubair','Anbu','Bhanu','Chitra','Devi','Elango','Fathima','Gopal','Hema','Irfan','Jayanthi','Krishnan','Latha','Mani','Nandha','Oviya','Prabhu','Ramu','Selvi','Thilaga','Usha','Vishal','Wasim','Yasmin','Bharath','Suresh'];
const lastNames = ['Kumar','Sharma','Pillai','Nair','Reddy','Iyer','Singh','Gupta','Patel','Verma','Mehta','Shah','Rao','Krishnan','Menon','Naidu','Bose','Chopra','Jain','Mishra','Sinha','Pandey','Tiwari','Dubey','Ghosh','Mukherjee','Banerjee','Das','Chatterjee','Bhat'];

function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateVitals(risk) {
  const isHigh = risk === 'Critical' || risk === 'High';
  return {
    heartRate: isHigh ? randBetween(100, 140) : randBetween(60, 99),
    spo2: isHigh ? randBetween(82, 93) : randBetween(94, 100),
    systolic: isHigh ? randBetween(85, 100) : randBetween(110, 140),
    diastolic: isHigh ? randBetween(50, 65) : randBetween(70, 90),
    temperature: isHigh ? (Math.random() > 0.5 ? randBetween(388, 403) / 10 : randBetween(350, 360) / 10) : randBetween(366, 377) / 10,
    respiration: isHigh ? randBetween(22, 30) : randBetween(12, 20),
  };
}

function generatePSI(risk) {
  if (risk === 'Critical') return randBetween(5, 25);
  if (risk === 'High') return randBetween(26, 50);
  if (risk === 'Medium') return randBetween(51, 75);
  return randBetween(76, 100);
}

const RISK_LEVELS = ['Critical', 'Critical', 'High', 'High', 'Medium', 'Medium', 'Medium', 'Low', 'Low', 'Low'];
const STATUSES = ['Admitted', 'Under Observation', 'Stable', 'Critical', 'Recovering', 'Discharged'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DEPT_IDS = DEPARTMENTS.map(d => d.id);

export const generatePatients = (count = 100) => {
  const deptDoctors = {};
  DOCTORS.forEach(d => {
    if (!deptDoctors[d.dept]) deptDoctors[d.dept] = [];
    deptDoctors[d.dept].push(d.id);
  });

  return Array.from({ length: count }, (_, i) => {
    const risk = randFrom(RISK_LEVELS);
    const dept = randFrom(DEPT_IDS);
    const vitals = generateVitals(risk);
    const docId = deptDoctors[dept] ? randFrom(deptDoctors[dept]) : 'D001';
    const nurse = randFrom(NURSES);
    const daysAgo = randBetween(1, 30);
    const admitDate = new Date(Date.now() - daysAgo * 86400000);

    return {
      id: `P${String(i + 1).padStart(3, '0')}`,
      name: `${randFrom(firstNames)} ${randFrom(lastNames)}`,
      age: randBetween(18, 85),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      bloodGroup: randFrom(BLOOD_GROUPS),
      dept,
      bed: `${dept.toUpperCase().slice(0, 3)}-${randBetween(1, 40)}`,
      ward: `Ward ${randBetween(1, 8)}`,
      floor: `Floor ${randBetween(1, 5)}`,
      risk,
      psi: generatePSI(risk),
      status: risk === 'Critical' ? 'Critical' : risk === 'High' ? 'Under Observation' : randFrom(STATUSES),
      vitals,
      doctor: docId,
      nurse: nurse.id,
      admitDate: admitDate.toISOString().split('T')[0],
      diagnosis: randFrom(['Cardiac Arrest', 'Acute MI', 'Stroke', 'Pneumonia', 'Sepsis', 'Trauma', 'Post-op Recovery', 'Diabetic Ketoacidosis', 'COPD Exacerbation', 'Renal Failure', 'Liver Cirrhosis', 'Polytrauma', 'Hypertensive Crisis', 'Meningitis', 'Appendicitis']),
      phone: `+91 ${randBetween(7000000000, 9999999999)}`,
      emergency_contact: `+91 ${randBetween(7000000000, 9999999999)}`,
      insurance: Math.random() > 0.4 ? 'Yes' : 'No',
      vitalsHistory: generateVitalsHistory(risk),
      psiHistory: generatePsiHistory(risk),
      aiReasons: generateAIReasons(vitals, risk),
      aiConfidence: randBetween(72, 98),
    };
  });
};

function generatePsiHistory(risk) {
  return Array.from({ length: 24 }, (_, i) => {
    const t = new Date(Date.now() - (24 - i) * 3600000);
    return { psi: generatePSI(risk), time: `${t.getHours()}:00` };
  });
}

function generateVitalsHistory(risk) {
  return Array.from({ length: 24 }, (_, i) => {
    const v = generateVitals(risk);
    const t = new Date(Date.now() - (24 - i) * 3600000);
    return { ...v, time: `${t.getHours()}:00`, timestamp: t.getTime() };
  });
}

function generateAIReasons(vitals, risk) {
  const reasons = [];
  if (vitals.spo2 < 92) reasons.push({ factor: 'Low Oxygen Saturation', severity: 'Critical', value: `SpO₂ ${vitals.spo2}%` });
  if (vitals.heartRate > 110) reasons.push({ factor: 'Tachycardia Detected', severity: 'High', value: `HR ${vitals.heartRate} bpm` });
  if (vitals.heartRate < 50) reasons.push({ factor: 'Bradycardia Risk', severity: 'Critical', value: `HR ${vitals.heartRate} bpm` });
  if (vitals.temperature > 38.5) reasons.push({ factor: 'High Fever', severity: 'Warning', value: `Temp ${vitals.temperature}°C` });
  if (vitals.systolic < 90) reasons.push({ factor: 'Hypotension', severity: 'Critical', value: `BP ${vitals.systolic}/${vitals.diastolic}` });
  if (vitals.respiration > 24) reasons.push({ factor: 'Rapid Breathing', severity: 'High', value: `RR ${vitals.respiration}/min` });
  if (risk === 'Critical' && reasons.length < 2) reasons.push({ factor: 'Rapid Deterioration Trend', severity: 'Critical', value: 'PSI declining' });
  if (risk === 'High' && reasons.length < 1) reasons.push({ factor: 'Elevated Risk Score', severity: 'High', value: 'Monitoring required' });
  return reasons;
}

export const INITIAL_PATIENTS = generatePatients(100);

export const generateAlerts = (patients) => {
  const alerts = [];
  const alertTypes = [
    { type: 'Critical Vitals', severity: 'critical' },
    { type: 'SpO₂ Drop', severity: 'critical' },
    { type: 'Blood Pressure Alert', severity: 'high' },
    { type: 'Tachycardia', severity: 'high' },
    { type: 'Temperature Spike', severity: 'warning' },
    { type: 'Missed Medication', severity: 'warning' },
    { type: 'Bed Change Request', severity: 'info' },
    { type: 'Lab Results Ready', severity: 'info' },
    { type: 'Nurse Call', severity: 'low' },
    { type: 'Doctor Consultation Needed', severity: 'high' },
  ];
  const statuses = ['Created', 'Seen', 'Accepted', 'Resolved'];
  let id = 1;
  patients.slice(0, 30).forEach(p => {
    const numAlerts = randBetween(1, 3);
    for (let i = 0; i < numAlerts; i++) {
      const alertType = randFrom(alertTypes);
      const minsAgo = randBetween(2, 480);
      alerts.push({
        id: `ALT${String(id++).padStart(3, '0')}`,
        patientId: p.id,
        patientName: p.name,
        dept: p.dept,
        type: alertType.type,
        severity: alertType.severity,
        status: randFrom(statuses),
        message: `${alertType.type} detected for ${p.name} in ${DEPARTMENTS.find(d => d.id === p.dept)?.name}`,
        timestamp: new Date(Date.now() - minsAgo * 60000).toISOString(),
        acknowledgedBy: Math.random() > 0.5 ? randFrom(NURSES).name : null,
      });
    }
  });
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const INITIAL_ALERTS = generateAlerts(INITIAL_PATIENTS);

export const BED_DATA = DEPARTMENTS.map(dept => {
  const total = randBetween(20, 50);
  const occupied = randBetween(10, total - 2);
  const reserved = randBetween(1, 4);
  return {
    dept: dept.id,
    name: dept.name,
    color: dept.color,
    total,
    occupied,
    reserved,
    available: total - occupied - reserved,
  };
});

export const ANALYTICS_DATA = {
  criticalTrend: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    critical: randBetween(5, 20),
    high: randBetween(15, 35),
    medium: randBetween(20, 45),
    low: randBetween(10, 25),
  })),
  responseTime: Array.from({ length: 7 }, (_, i) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return { day: days[i], icu: randBetween(2, 6), emergency: randBetween(3, 8), general: randBetween(5, 12) };
  }),
  deptRisk: DEPARTMENTS.map(d => ({
    dept: d.name,
    risk: randBetween(20, 90),
    color: d.color,
  })),
  recoveryTrend: Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    recovered: randBetween(3, 12),
    admitted: randBetween(5, 15),
  })),
};
