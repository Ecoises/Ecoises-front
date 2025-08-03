import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, LaravelValidationError } from '../types/api'; // Importa tus tipos

// Configurar la URL base de tu API de Laravel
const API_BASE_URL: string = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Asume que tus rutas de API están bajo /api en Laravel
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token: string | null = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes (ej. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<AuthResponse | LaravelValidationError>) => {
    // Solo limpiar token en casos específicos de error 401 y rutas protegidas
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
      
      if (!isAuthRoute) {
        console.warn("Token expirado o no autorizado. El contexto manejará la limpieza del token.");
        // No limpiamos el token aquí para evitar problemas de concurrencia
        // Lo manejará el AuthContext después de intentar obtener el perfil
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;