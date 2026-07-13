import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let nid = 1;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: nid++, title: 'Critical Alert', message: 'Patient P003 SpO₂ dropped to 85%', severity: 'critical', read: false, time: new Date(Date.now() - 120000).toISOString(), patientId: 'P003' },
    { id: nid++, title: 'New Admission', message: 'Patient Kiran Kumar admitted to ICU Bed ICU-12', severity: 'info', read: false, time: new Date(Date.now() - 600000).toISOString() },
    { id: nid++, title: 'Alert Resolved', message: 'BP Alert for Patient P007 has been resolved', severity: 'success', read: true, time: new Date(Date.now() - 3600000).toISOString(), patientId: 'P007' },
    { id: nid++, title: 'Duty Change', message: 'Night shift nurses are now on duty in ICU', severity: 'info', read: true, time: new Date(Date.now() - 7200000).toISOString() },
  ]);
  const [toasts, setToasts] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const addNotification = useCallback((notif) => {
    const n = { id: nid++, ...notif, read: false, time: new Date().toISOString() };
    setNotifications(prev => [n, ...prev]);
    setToasts(prev => [n, ...prev.slice(0, 2)]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== n.id)), 4000);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, toasts, unreadCount, panelOpen, setPanelOpen,
      addNotification, markAllRead, markRead, dismissToast,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
