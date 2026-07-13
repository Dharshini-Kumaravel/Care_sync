import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = {
  admin: { id: 'U001', name: 'Dr. Admin Kumar', role: 'Admin', dept: null, email: 'admin@caresync.ai', avatar: null },
  doctor: { id: 'D002', name: 'Dr. Priya Nair', role: 'Doctor', dept: 'cardiology', email: 'doctor@caresync.ai', avatar: null },
  nurse: { id: 'N001', name: 'Anitha Rajan', role: 'Nurse', dept: 'icu', email: 'nurse@caresync.ai', avatar: null },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password, role) => {
    const roleKey = role.toLowerCase();
    const mockUser = MOCK_USERS[roleKey] || MOCK_USERS.admin;
    setUser({ ...mockUser, email, status: role === 'Nurse' ? 'Available' : 'Online' });
    return true;
  };

  const logout = () => setUser(null);

  const updateStatus = (newStatus) => {
    setUser(prev => prev ? { ...prev, status: newStatus } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateStatus, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
