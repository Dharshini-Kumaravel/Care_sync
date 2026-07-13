import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Stethoscope, Building2,
  AlertTriangle, BedDouble, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight, Heart, Activity, Brain,
  FileText, ScrollText, Eye, Clock, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

// Role-specific nav items
const ADMIN_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/nurses', icon: UserCheck, label: 'Nurses' },
  { to: '/departments', icon: Building2, label: 'Departments' },
  { to: '/critical', icon: Heart, label: 'Critical Patients' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/beds', icon: BedDouble, label: 'Bed Management' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/audit-logs', icon: ScrollText, label: 'Audit Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const DOCTOR_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/critical', icon: Heart, label: 'Critical Patients' },
  { to: '/ai-insights', icon: Brain, label: 'AI Insights' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/notes', icon: FileText, label: 'Notes' },
];

const NURSE_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assigned-patients', icon: Users, label: 'Assigned Patients' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/observations', icon: ClipboardList, label: 'Observations' },
  { to: '/duty-status', icon: Clock, label: 'Duty Status' },
];

const NAV_BY_ROLE = {
  Admin: ADMIN_NAV,
  Doctor: DOCTOR_NAV,
  Nurse: NURSE_NAV,
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = NAV_BY_ROLE[user?.role] || ADMIN_NAV;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const ROLE_COLORS = { Admin: '#2563EB', Doctor: '#8B5CF6', Nurse: '#22C55E' };
  const roleColor = ROLE_COLORS[user?.role] || '#2563EB';

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Activity size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-name">CareSync</span>
            <span className="sidebar__logo-tag">AI</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button className="sidebar__toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Role Label */}
      {!collapsed && (
        <div className="sidebar__role-label" style={{ background: `${roleColor}12`, color: roleColor, borderColor: `${roleColor}25` }}>
          {user?.role} Portal
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar__nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="sidebar__item-icon" />
            {!collapsed && <span className="sidebar__item-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="sidebar__bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar__profile ${isActive ? 'sidebar__profile--active' : ''}`}
          title={collapsed ? 'Profile' : undefined}
        >
          <div className="sidebar__avatar" style={{ background: roleColor }}>{initials}</div>
          {!collapsed && (
            <div className="sidebar__profile-info">
              <div className="sidebar__profile-name">{user?.name?.split(' ').slice(0, 2).join(' ')}</div>
              <div className="sidebar__profile-role" style={{ color: roleColor }}>{user?.role}</div>
            </div>
          )}
        </NavLink>
        <button className="sidebar__logout" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
