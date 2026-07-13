import { useEffect, useRef, useState } from 'react';
import './KPICard.css';

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function KPICard({ title, value, subtitle, icon: Icon, iconColor = '#2563EB', trend, trendLabel, animate = true, className = '' }) {
  const displayValue = animate ? useCountUp(typeof value === 'number' ? value : 0) : value;
  const isPositive = trend > 0;

  return (
    <div className={`kpi-card ${className}`}>
      <div className="kpi-card__header">
        <div className="kpi-card__icon" style={{ background: `${iconColor}15` }}>
          <Icon size={20} color={iconColor} />
        </div>
        {trend !== undefined && (
          <span className={`kpi-card__trend ${isPositive ? 'trend--up' : 'trend--down'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="kpi-card__value">
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
      </div>
      <div className="kpi-card__title">{title}</div>
      {subtitle && <div className="kpi-card__subtitle">{subtitle}</div>}
    </div>
  );
}
