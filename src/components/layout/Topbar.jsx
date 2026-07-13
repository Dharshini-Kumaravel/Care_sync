import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSimulation } from '../../context/SimulationContext';
import { DEPARTMENTS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

export default function Topbar({ sidebarCollapsed }) {
  const { user } = useAuth();
  const { unreadCount, setPanelOpen } = useNotifications();
  const { patients } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const found = patients
      .filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.dept.includes(q))
      .slice(0, 5)
      .map(p => ({ type: 'patient', id: p.id, label: p.name, sub: `${p.id} · ${DEPARTMENTS.find(d => d.id === p.dept)?.name}`, risk: p.risk }));
    setSearchResults(found);
  }, [searchQuery, patients]);

  const handleResultClick = (r) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(`/patients/${r.id}`);
  };

  const dept = user?.dept ? DEPARTMENTS.find(d => d.id === user.dept) : null;

  return (
    <header className={`topbar ${sidebarCollapsed ? 'topbar--collapsed' : ''}`}>
      {/* Search */}
      <div className="topbar__search" ref={searchRef}>
        <div className={`topbar__search-field ${showSearch ? 'topbar__search-field--active' : ''}`}>
          <Search size={15} className="topbar__search-icon" />
          <input
            type="text"
            placeholder="Search patients, departments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="topbar__search-clear">
              <X size={13} />
            </button>
          )}
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="topbar__search-results">
            {searchResults.map(r => (
              <div key={r.id} className="topbar__search-result" onClick={() => handleResultClick(r)}>
                <div className="topbar__result-label">{r.label}</div>
                <div className="topbar__result-sub">{r.sub}</div>
                <span className={`topbar__result-risk risk--${r.risk?.toLowerCase()}`}>{r.risk}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="topbar__right">
        {dept && (
          <div className="topbar__dept">
            <div className="topbar__dept-dot" style={{ background: dept.color }} />
            {dept.name}
          </div>
        )}
        <div className="topbar__time">
          <div className="topbar__time-val">{timeStr}</div>
          <div className="topbar__time-date">{dateStr}</div>
        </div>
        <button className="topbar__notif-btn" onClick={() => setPanelOpen(true)} id="notif-btn">
          <Bell size={18} />
          {unreadCount > 0 && <span className="topbar__notif-badge">{unreadCount}</span>}
        </button>
        <div className="topbar__user">
          <div className="topbar__user-avatar">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="topbar__user-info">
            <div className="topbar__user-name">{user?.name?.split(' ').slice(0, 2).join(' ')}</div>
            <div className="topbar__user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
