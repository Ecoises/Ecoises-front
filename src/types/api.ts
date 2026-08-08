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
  id?: number;
  url: string;
  medium_url?: string | null;
  square_url?: string | null;
  large_url?: string | null;
  small_url?: string | null;
  attribution?: string;
  license_code?: string | null;
}

export interface Taxon {
  id: number;
  scientific_name: string;
  common_name: string | null;
  class: string | null;
  family: string | null;
  order_name: string | null;
  rank: string | null;
  conservation_status: { status_name: string; iucn: number } | null; // e.g., { status_name: "VU", iucn: 40 }
  establishment_status_colombia?: string | null; // e.g., "native", "endemic", "introduced"
  native: boolean;
  endemic: boolean;
  observation_count: number;
  default_photo: TaxonPhoto | null;
  wikipedia_url?: string | null;
  // Trazabilidad local del catálogo UNAL La Paz
  taxon_author?: string | null;        // Quien describió la especie (ej: "Linnaeus, 1758")
  inventory_author?: string | null;    // Grupo/semillero responsable del registro
  local_records_count?: number;        // Registros documentados en el sitio
  attribution?: string | null;         // Cita bibliográfica de la fuente de los datos
  inaturalist_id?: number | null;
}

export interface ExploreResponse {
  success: boolean;
  data: Taxon[];
  meta?: {
    pagination?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
    [key: string]: any;
  };
  // Keeping this optional just in case we have mixed responses during transition, 
  // but ideally it should be removed or deprecated if backend consistently sends meta.
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}