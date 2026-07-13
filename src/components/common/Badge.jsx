import './Badge.css';

const VARIANTS = {
  critical: 'badge--critical',
  high: 'badge--high',
  warning: 'badge--warning',
  medium: 'badge--medium',
  success: 'badge--success',
  low: 'badge--low',
  info: 'badge--info',
  neutral: 'badge--neutral',
  primary: 'badge--primary',
};

export default function Badge({ children, variant = 'neutral', dot = false, pulse = false, size = 'sm' }) {
  return (
    <span className={`badge badge--${size} ${VARIANTS[variant] || VARIANTS.neutral} ${pulse ? 'badge--pulse' : ''}`}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
