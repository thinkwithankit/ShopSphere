import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopsphere_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopsphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopsphere_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopsphere_user');
  };

  const register = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, register, isLoginOpen, setIsLoginOpen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
