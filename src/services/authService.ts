import apiClient from '../api/apiClient';
import { AuthResponse, User } from '../types/api'; // Importa tus tipos

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', { id_token: idToken });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{ status: boolean; data: User }>('/profile');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
        await apiClient.post('/logout');
        localStorage.removeItem('auth_token');
    } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error);
        localStorage.removeItem('auth_token'); // Asegurarse de limpiar el token incluso si el backend falla
        throw error;
    }
  },


  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Método para verificar si el token es válido sin hacer una llamada al servidor
  hasValidToken: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
};

export default authService;