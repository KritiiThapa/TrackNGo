
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, name }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optional: keep session only for refresh
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) setUser(JSON.parse(sessionUser));
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
  setUser(null);
  sessionStorage.removeItem("user");
  localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);