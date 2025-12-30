import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginInput, RegisterInput, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.me();
        
        if (response.success && response.data) {
          setState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          localStorage.removeItem('token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginInput) => {
    const response = await authApi.login(data);
    
    if (response.success && response.data) {
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const register = async (data: RegisterInput) => {
    const response = await authApi.register(data);
    
    if (response.success && response.data) {
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }
    
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default useAuth;

