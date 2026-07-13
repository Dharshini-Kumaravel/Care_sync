import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { INITIAL_PATIENTS, INITIAL_ALERTS, generatePatients, generateAlerts } from '../data/mockData';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

const SimulationContext = createContext(null);

function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function SimulationProvider({ children }) {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [criticalRosterPopup, setCriticalRosterPopup] = useState(null);
  const intervalRef = useRef(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const updateVital = (v, isHigh) => ({
    heartRate: Math.max(40, Math.min(180, v.heartRate + randBetween(-5, 5))),
    spo2: Math.max(75, Math.min(100, v.spo2 + (isHigh ? randBetween(-3, 1) : randBetween(-1, 2)))),
    systolic: Math.max(60, Math.min(200, v.systolic + randBetween(-4, 4))),
    diastolic: Math.max(40, Math.min(120, v.diastolic + randBetween(-3, 3))),
    temperature: Math.max(34, Math.min(42, +(v.temperature + (Math.random() - 0.5) * 0.2).toFixed(1))),
    respiration: Math.max(8, Math.min(40, v.respiration + randBetween(-2, 2))),
  });

  const triggerEmergencyAlert = useCallback((currentPatients) => {
    const candidatePatients = currentPatients.filter(p => p.risk !== 'Low');
    if (candidatePatients.length === 0) return;
    const target = candidatePatients[Math.floor(Math.random() * candidatePatients.length)];

    const medicalAlerts = [
      { type: 'Ventricular Tachycardia', msg: `Critical Ventricular Tachycardia detected: HR at ${randBetween(140, 175)} bpm. Urgent cardiac review required.`, severity: 'critical' },
      { type: 'Severe Hypoxemia', msg: `SpO2 levels dropped to ${randBetween(80, 86)}% under supplemental oxygen. Check airway/mask interface.`, severity: 'critical' },
      { type: 'Hypotensive Crisis', msg: `Acute Hypotensive Crisis: Blood pressure dropped to ${randBetween(75, 88)}/${randBetween(45, 55)} mmHg. Risk of hypoperfusion.`, severity: 'critical' },
      { type: 'Bradypnea Crisis', msg: `Bradypnea & Respiratory Depression: Respiratory rate at ${randBetween(7, 9)} breaths/min. Monitor ventilatory status.`, severity: 'critical' },
      { type: 'Severe Sepsis Alert', msg: `Core temperature spiked to ${randBetween(398, 404)/10}°C with worsening tachycardia. Suspected systemic inflammatory response.`, severity: 'high' }
    ];

    const chosen = medicalAlerts[Math.floor(Math.random() * medicalAlerts.length)];

    const newAlert = {
      id: `ALT${Date.now()}`,
      patientId: target.id,
      patientName: target.name,
      dept: target.dept,
      type: chosen.type,
      severity: chosen.severity,
      status: 'Created',
      message: chosen.msg,
      timestamp: new Date().toISOString(),
      acknowledgedBy: null
    };

    setAlerts(prev => [newAlert, ...prev]);

    addNotification({
      title: `${chosen.severity === 'critical' ? 'Critical' : 'High'}: ${target.name}`,
      message: `${chosen.msg.replace('Critical ', '').replace('Acute ', '')} — Bed ${target.bed}`,
      severity: chosen.severity,
      patientId: target.id
    });

    // Check if patient belongs to logged in nurse to trigger screen modal popup
    if (user?.role === 'Nurse' && target.nurse === user.id && (chosen.severity === 'critical' || chosen.severity === 'high')) {
      setCriticalRosterPopup({
        id: newAlert.id,
        patientName: target.name,
        bed: target.bed,
        type: chosen.type,
        message: chosen.msg,
        severity: chosen.severity
      });
    }

    setPatients(prev => prev.map(p => {
      if (p.id === target.id) {
        const updatedVitals = { ...p.vitals };
        if (chosen.type === 'Ventricular Tachycardia') updatedVitals.heartRate = randBetween(140, 175);
        if (chosen.type === 'Severe Hypoxemia') updatedVitals.spo2 = randBetween(80, 86);
        if (chosen.type === 'Hypotensive Crisis') {
          updatedVitals.systolic = randBetween(75, 88);
          updatedVitals.diastolic = randBetween(45, 55);
        }
        if (chosen.type === 'Bradypnea Crisis') updatedVitals.respiration = randBetween(7, 9);
        if (chosen.type === 'Severe Sepsis Alert') updatedVitals.temperature = 40.1;

        return {
          ...p,
          risk: chosen.severity === 'critical' ? 'Critical' : 'High',
          psi: randBetween(10, 29),
          vitals: updatedVitals
        };
      }
      return p;
    }));
  }, [addNotification, user]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTick(t => {
        const nextTick = t + 1;
        
        setPatients(prev => prev.map(p => {
          const isHigh = p.risk === 'Critical' || p.risk === 'High';
          const newVitals = updateVital(p.vitals, isHigh);
          let newRisk = p.risk;
          const roll = Math.random();
          if (roll < 0.03) {
            const risks = ['Critical', 'High', 'Medium', 'Low'];
            const idx = risks.indexOf(p.risk);
            newRisk = idx > 0 ? risks[idx - 1] : p.risk;
          } else if (roll < 0.06) {
            const risks = ['Critical', 'High', 'Medium', 'Low'];
            const idx = risks.indexOf(p.risk);
            newRisk = idx < risks.length - 1 ? risks[idx + 1] : p.risk;
          }
          const newPsi = Math.max(5, Math.min(100, p.psi + randBetween(-3, 3)));
          const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return {
            ...p,
            vitals: newVitals,
            risk: newRisk,
            psi: newPsi,
            vitalsHistory: [...p.vitalsHistory.slice(-23), { ...newVitals, time: nowTime }],
            psiHistory: [...p.psiHistory.slice(-23), { psi: newPsi, time: nowTime }]
          };
        }));

        if (nextTick % 10 === 0) {
          setPatients(current => {
            triggerEmergencyAlert(current);
            return current;
          });
        }

        return nextTick;
      });
    }, 3000);
  }, [triggerEmergencyAlert]);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    const newPatients = generatePatients(100);
    setPatients(newPatients);
    setAlerts(generateAlerts(newPatients));
    setTick(0);
  }, [stopSimulation]);

  const resolveAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
    // Clear popup if resolved
    setCriticalRosterPopup(prev => prev?.id === alertId ? null : prev);
  }, []);

  const acceptAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Accepted' } : a));
  }, []);

  const criticalPatients = patients.filter(p => p.risk === 'Critical').sort((a, b) => a.psi - b.psi);
  const stats = {
    totalPatients: patients.length,
    criticalPatients: patients.filter(p => p.risk === 'Critical').length,
    highPatients: patients.filter(p => p.risk === 'High').length,
    mediumPatients: patients.filter(p => p.risk === 'Medium').length,
    lowPatients: patients.filter(p => p.risk === 'Low').length,
    activeAlerts: alerts.filter(a => a.status !== 'Resolved').length,
    resolvedAlerts: alerts.filter(a => a.status === 'Resolved').length,
  };

  return (
    <SimulationContext.Provider value={{
      patients, alerts, isRunning, tick, stats, criticalPatients,
      criticalRosterPopup, setCriticalRosterPopup,
      startSimulation, stopSimulation, resetSimulation, resolveAlert, acceptAlert,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
};
