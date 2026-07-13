import './Card.css';

export default function Card({ children, className = '', padding = 'md', hover = false, onClick, style }) {
  return (
    <div
      className={`card-base card--${padding} ${hover ? 'card--hover' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined, ...style }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon, iconColor }) {
  return (
    <div className="card-header">
      <div className="card-header__left">
        {Icon && (
          <div className="card-header__icon" style={{ background: iconColor ? `${iconColor}18` : 'var(--color-primary-light)' }}>
            <Icon size={18} color={iconColor || 'var(--color-primary)'} />
          </div>
        )}
        <div>
          <h4 className="card-header__title">{title}</h4>
          {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="card-header__action">{action}</div>}
    </div>
  );
}
