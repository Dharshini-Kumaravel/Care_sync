import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ label, error, icon: Icon, hint, className = '', ...props }, ref) => (
  <div className={`input-wrapper ${className}`}>
    {label && <label className="input-label">{label}</label>}
    <div className={`input-field ${Icon ? 'input-field--icon' : ''} ${error ? 'input-field--error' : ''}`}>
      {Icon && <Icon className="input-icon" size={16} />}
      <input ref={ref} {...props} />
    </div>
    {hint && !error && <span className="input-hint">{hint}</span>}
    {error && <span className="input-error">{error}</span>}
  </div>
));

Input.displayName = 'Input';
export default Input;

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className={`input-wrapper ${className}`}>
    {label && <label className="input-label">{label}</label>}
    <div className={`input-field input-field--select ${error ? 'input-field--error' : ''}`}>
      <select ref={ref} {...props}>{children}</select>
    </div>
    {error && <span className="input-error">{error}</span>}
  </div>
));
Select.displayName = 'Select';
