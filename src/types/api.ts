// src/types/api.ts

export interface User {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
  // Añade aquí cualquier otro campo que tu API devuelva para el usuario
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: User; // El usuario que se devuelve al iniciar sesión
  // Si tu API de registro devuelve algo diferente, puedes crear otra interfaz (ej. RegisterResponse)
}

// Para errores de validación de Laravel (código 422)
export interface LaravelValidationError {
  message: string;
  errors: {
    [key: string]: string[]; // Ejemplo: { email: ["El email ya ha sido tomado."] }
  };
}

// Para la imagen de iNaturalist
export interface INatPhoto {
  id: number;
  url: string;
  attribution: string;
  // Otros campos relevantes si los usas
}

export interface INatResult {
  id: number;
  name: string;
  preferred_common_name?: string;
  default_photo?: INatPhoto;
  // Otros campos relevantes del resultado de la especie
}

export interface INatResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: INatResult[];
}