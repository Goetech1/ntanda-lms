import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Map fullName or standard user attributes
        setUser({
          ...parsed,
          fullName: parsed.full_name || parsed.fullName || 'User',
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a fallback based on localStorage directly if provider is not loaded
    try {
      const parsed = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        user: {
          ...parsed,
          fullName: parsed.full_name || parsed.fullName || 'User',
        }
      };
    } catch (e) {
      return { user: null };
    }
  }
  return context;
};
