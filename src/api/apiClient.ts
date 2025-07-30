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
    // Si la respuesta es 401 Unauthorized y no es la ruta de login
    if (error.response && error.response.status === 401 && error.config?.url !== '/login') {
      console.warn("Sesión expirada o no autorizada. Limpiando token y sugiriendo redirección.");
      localStorage.removeItem('auth_token');
      // Aquí podrías añadir una redirección global si tienes un router (ej. navigate('/login');)
    }
    return Promise.reject(error);
  }
);

export default apiClient;