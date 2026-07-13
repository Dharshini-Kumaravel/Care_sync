import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login_medical_tech.jpg';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'Admin', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    login(form.email, form.password, form.role);
    navigate('/dashboard');
  };

  const quickLogin = (role) => {
    const emails = { Admin: 'admin@caresync.ai', Doctor: 'doctor@caresync.ai', Nurse: 'nurse@caresync.ai' };
    setForm(f => ({ ...f, email: emails[role], password: 'caresync2024', role }));
  };

  return (
    <div className="login">
      {/* Left Panel */}
      <div className="login__left">
        <div className="login__left-bg" style={{ backgroundImage: `url(${loginBg})` }} />
        <div className="login__left-overlay" />
        <div className="login__left-content">
          <div className="login__brand">
            <div className="login__brand-icon">
              <Activity size={22} color="#fff" />
            </div>
            <span className="login__brand-name">CareSync AI</span>
          </div>
          <div className="login__tagline-block">
            <h2 className="login__tagline-h">Clinical Support &<br />Response Intelligence</h2>
            <p className="login__tagline-p">Real-time physiological tracking & deterioration forecasting.</p>
          </div>
          <div className="login__stats">
            <div className="login__stat">
              <div className="login__stat-val">100</div>
              <div className="login__stat-label">Monitored Beds</div>
            </div>
            <div className="login__stat-div" />
            <div className="login__stat">
              <div className="login__stat-val">30s</div>
              <div className="login__stat-label">Vitals Sweep</div>
            </div>
            <div className="login__stat-div" />
            <div className="login__stat">
              <div className="login__stat-val">99.4%</div>
              <div className="login__stat-label">AI Prognostics</div>
            </div>
          </div>
        </div>
        <div className="login__left-decoration" />
      </div>

      {/* Right Panel */}
      <div className="login__right">
        <div className="login__form-wrapper animate-fade-in-up">
          <div className="login__form-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Quick Login */}
          <div className="login__quick">
            <span className="login__quick-label">Quick access:</span>
            {['Admin', 'Doctor', 'Nurse'].map(role => (
              <button key={role} className={`login__quick-btn ${form.role === role ? 'login__quick-btn--active' : ''}`} onClick={() => quickLogin(role)}>
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="login__form">
            {/* Email */}
            <div className="login__field">
              <label>Email address</label>
              <div className="login__input-wrap">
                <Mail size={16} className="login__input-icon" />
                <input
                  type="email"
                  placeholder="you@caresync.ai"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login__field">
              <label>Password</label>
              <div className="login__input-wrap">
                <Lock size={16} className="login__input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" className="login__pass-toggle" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="login__field">
              <label>Your Role</label>
              <div className="login__input-wrap login__select-wrap">
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option>Admin</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                </select>
                <ChevronDown size={15} className="login__select-arrow" />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="login__options">
              <label className="login__remember">
                <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} />
                <span>Remember me</span>
              </label>
              <button type="button" className="login__forgot">Forgot password?</button>
            </div>

            {error && <div className="login__error">{error}</div>}

            <button type="submit" className="login__submit" disabled={loading}>
              {loading ? <span className="login__spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="login__footer">
            CareSync AI · Secure Healthcare Platform · v2.1.0
          </div>
        </div>
      </div>
    </div>
  );
}
