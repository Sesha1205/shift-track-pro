
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'employee' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if admin login
      if (email === 'admin@company.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'HR Admin',
          email: 'admin@company.com',
          department: 'HR',
          role: 'admin' as const
        };
        
        const token = `mock_jwt_token_${adminUser.id}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(adminUser));
        setUser(adminUser);
        return true;
      }

      // Check if employee exists in employees table
      // For now, employees will use default password: "employee123"
      if (password === 'employee123') {
        // In production, this would query the employees table
        // For demo purposes, any email with employee123 password will work as employee
        const employeeUser = {
          id: `emp_${Date.now()}`,
          name: email.split('@')[0], // Use email prefix as name
          email: email,
          department: 'General',
          role: 'employee' as const
        };
        
        const token = `mock_jwt_token_${employeeUser.id}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(employeeUser));
        setUser(employeeUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
