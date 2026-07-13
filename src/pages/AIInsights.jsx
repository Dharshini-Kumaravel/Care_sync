import { useSimulation } from '../context/SimulationContext';
import Card, { CardHeader } from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Brain, TrendingUp, AlertTriangle, ShieldAlert, Sparkles, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AIInsights.css';

export default function AIInsights() {
  const { patients } = useSimulation();
  const navigate = useNavigate();

  // Filter department patients (e.g. ICU or Cardiology, simulating doctor's ward)
  // Sort them by highest risk (lowest PSI) to show the AI priorities
  const highRiskPatients = [...patients]
    .filter(p => p.risk === 'Critical' || p.risk === 'High')
    .sort((a, b) => a.psi - b.psi)
    .slice(0, 5);

  return (
    <div className="ai-insights-page animate-fade-in-up">
      <div className="ai-insights-page__header">
        <div>
          <h1 className="page-title">AI Diagnostics Command Centre</h1>
          <p className="page-subtitle">Monitored predictive analytics, patient deterioration forecasts, and diagnostic recommendations</p>
        </div>
        <Badge variant="primary" dot pulse>CareSync AI Engine v2.4</Badge>
      </div>

      {/* Grid of Key AI Indicators */}
      <div className="ai-indicators-grid">
        <Card padding="md" className="ai-indicator-card">
          <CardHeader title="Pre-Emptive Deterioration Risk" subtitle="monitored alerts" icon={Brain} iconColor="#8B5CF6" />
          <div className="ai-indicator-val" style={{ color: '#8B5CF6' }}>
            {patients.filter(p => p.risk === 'Critical').length}
            <span className="ai-indicator-unit"> active cases</span>
          </div>
          <p className="ai-indicator-desc">Monitored patients displaying high probability of acute physiology deterioration.</p>
        </Card>

        <Card padding="md" className="ai-indicator-card">
          <CardHeader title="Clinical Advisory Coverage" subtitle="department roster recommendation" icon={Activity} iconColor="#EF4444" />
          <div className="ai-indicator-val" style={{ color: '#EF4444' }}>99.2%</div>
          <p className="ai-indicator-desc">Monitored beds actively streamed through ML clinical inference pipeline.</p>
        </Card>

        <Card padding="md" className="ai-indicator-card">
          <CardHeader title="Neural Calibration Health" subtitle="inference confidence" icon={Sparkles} iconColor="#22C55E" />
          <div className="ai-indicator-val" style={{ color: '#22C55E' }}>94.6%</div>
          <p className="ai-indicator-desc">Validation rate verified against EHR dataset standards (HL7/FHIR).</p>
        </Card>
      </div>

      <div className="ai-insights-charts">
        {/* Deterioration Forecast Priority List */}
        <Card padding="none" className="ai-chart-card">
          <div className="doctor-dash__card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Deterioration Priority List</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Prospective clinical risk tracking</p>
            </div>
          </div>
          <div className="ai-deterioration-list" style={{ padding: '8px 0' }}>
            {highRiskPatients.map(p => {
              const sepsisRisk = Math.max(45, Math.min(98, 100 - p.psi));
              return (
                <div key={p.id} className="ai-deterioration-row" onClick={() => navigate(`/patients/${p.id}`)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 24px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Bed {p.bed} · Diagnosis: {p.diagnosis}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444' }}>
                      {sepsisRisk}% Risk
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Forecast: Deterioration in 12h
                    </div>
                  </div>
                </div>
              );
            })}
            {highRiskPatients.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No high-risk patients monitored.
              </div>
            )}
          </div>
        </Card>

        {/* Explainable AI (XAI) Matrix */}
        <Card padding="md" className="ai-insights-panel">
          <CardHeader title="Explainable AI (XAI) Weight Matrix" subtitle="physiological risk drivers" icon={ShieldAlert} iconColor="#F59E0B" />
          <div className="xai-matrix">
            {[
              { factor: 'SpO2 Oxygen Saturation Drop', val: 'SpO2 < 92%', score: 85, weight: 'Primary trigger for hypoxia forecasting' },
              { factor: 'Arterial Pressure decline', val: 'MAP < 65 mmHg', score: 78, weight: 'Primary trigger for hypoperfusion crisis' },
              { factor: 'Tachycardia Spike (>110 bpm)', val: 'HR > 110 bpm', score: 62, weight: 'Elevated cardiac workload' },
              { factor: 'Hyperthermia Core Temp Spike', val: 'Temp > 38.5°C', score: 35, weight: 'Infectious response indicator' }
            ].map(f => (
              <div key={f.factor} className="xai-row" style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>{f.factor}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: f.score > 70 ? '#EF4444' : '#F59E0B' }}>{f.score}% weight</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {f.weight} ({f.val})
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
