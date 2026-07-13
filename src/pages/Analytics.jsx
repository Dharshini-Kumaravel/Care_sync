import { ANALYTICS_DATA, DEPARTMENTS } from '../data/mockData';
import Card, { CardHeader } from '../components/common/Card';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Clock, BedDouble, Activity, Heart } from 'lucide-react';
import './Analytics.css';

export default function Analytics() {
  const { criticalTrend, responseTime, deptRisk, recoveryTrend } = ANALYTICS_DATA;

  return (
    <div className="analytics-page">
      <div className="analytics-page__header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Hospital performance metrics and trends</p>
      </div>

      {/* Row 1 */}
      <div className="analytics-page__row">
        {/* Critical Trend */}
        <Card padding="md" className="analytics-page__chart-wide">
          <CardHeader title="Critical Trend" subtitle="Last 30 days" icon={Heart} iconColor="#EF4444"
            action={<span className="analytics-page__badge analytics-page__badge--critical">Live</span>}
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={criticalTrend} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#EF4444" strokeWidth={2} fill="url(#gradCrit)" />
              <Area type="monotone" dataKey="high" name="High Risk" stroke="#F59E0B" strokeWidth={1.5} fill="url(#gradHigh)" />
              <Line type="monotone" dataKey="medium" name="Medium" stroke="#2563EB" strokeWidth={1} strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recovery Trend */}
        <Card padding="md" className="analytics-page__chart">
          <CardHeader title="Recovery vs Admissions" subtitle="Last 14 days" icon={TrendingUp} iconColor="#22C55E" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recoveryTrend} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="admitted" name="Admitted" fill="#EFF6FF" stroke="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recovered" name="Recovered" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="analytics-page__row">
        {/* Response Time */}
        <Card padding="md" className="analytics-page__chart">
          <CardHeader title="Response Time" subtitle="Minutes by department (weekly)" icon={Clock} iconColor="#8B5CF6" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseTime} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} formatter={(v) => `${v} min`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="icu" name="ICU" fill="#EF4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="emergency" name="Emergency" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="general" name="General" fill="#2563EB" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Risk */}
        <Card padding="md" className="analytics-page__chart">
          <CardHeader title="Department Risk Score" subtitle="Current risk index" icon={Activity} iconColor="#EF4444" />
          <div className="analytics-page__dept-list">
            {deptRisk.sort((a, b) => b.risk - a.risk).map(d => (
              <div key={d.dept} className="analytics-page__dept-row">
                <div className="analytics-page__dept-name">{d.dept}</div>
                <div className="analytics-page__dept-bar-wrap">
                  <div className="analytics-page__dept-bar">
                    <div className="analytics-page__dept-bar-fill" style={{ width: `${d.risk}%`, background: d.risk > 70 ? '#EF4444' : d.risk > 40 ? '#F59E0B' : '#22C55E' }} />
                  </div>
                </div>
                <div className="analytics-page__dept-score" style={{ color: d.risk > 70 ? '#EF4444' : d.risk > 40 ? '#D97706' : '#16A34A' }}>{d.risk}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bed Occupancy Pie */}
        <Card padding="md" className="analytics-page__chart">
          <CardHeader title="Bed Occupancy" subtitle="By department" icon={BedDouble} iconColor="#06B6D4" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={DEPARTMENTS.map((d, i) => ({ name: d.name, value: Math.floor(Math.random() * 40) + 10, color: d.color }))}
                innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {DEPARTMENTS.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="analytics-page__pie-legend">
            {DEPARTMENTS.map(d => (
              <div key={d.id} className="analytics-page__pie-item">
                <div className="analytics-page__pie-dot" style={{ background: d.color }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
