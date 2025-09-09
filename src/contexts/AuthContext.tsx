import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api';
import authService from '../api/services/AuthService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error: any) {
          console.error('Error al obtener el perfil del usuario:', error);
          
          // Solo limpiar el token si es un error de autenticación (401)
          if (error.response?.status === 401) {
            console.log('Token expirado o inválido, limpiando sesión');
            localStorage.removeItem('auth_token');
            setUser(null);
          } else {
            // Para otros errores (red, servidor), mantener el token pero no setear usuario
            console.log('Error de red o servidor, manteniendo token para reintentar');
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};