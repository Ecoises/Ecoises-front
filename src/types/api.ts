// src/types/api.ts

export interface User {
  id: number;
  full_name: string;
  email: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Para errores de validación de Laravel (código 422)
export interface LaravelValidationError {
  message: string;
  errors: {
    [key: string]: string[]; // Ejemplo: { email: ["El email ya ha sido tomado."] }
  };
}

// Para las respuestas de restablecimiento de contraseña
export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  error?: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  message: string;
  error?: string;
}

// Para la imagen de iNaturalist
export interface INatPhoto {
  id: number;
  url: string;
  attribution: string;
}

export interface INatResult {
  id: number;
  name: string;
  preferred_common_name?: string;
  default_photo?: INatPhoto;
}

export interface INatResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: INatResult[];
}

export interface TaxonPhoto {
  url: string;
  attribution?: string;
}

export interface Taxon {
  id: number;
  scientific_name: string;
  common_name: string | null;
  class: string | null;
  family: string | null;
  order_name: string | null;
  rank: string | null;
  conservation_status: string | null; // e.g., "LC", "NT", "VU", "EN"
  establishment_status_colombia?: string | null; // e.g., "native", "endemic", "introduced"
  is_native: boolean;
  is_endemic: boolean;
  observation_count: number;
  default_photo: TaxonPhoto | null;
  wikipedia_url?: string | null;
}

export interface ExploreResponse {
  success: boolean;
  data: Taxon[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}