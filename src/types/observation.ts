// Tipos que coinciden con el esquema real de la API backend

export interface ObservationPhoto {
  id: number;
  observation_id: number;
  photo_url: string;
  is_primary: boolean;
  caption: string | null;
}

export interface ObservationUser {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface ObservationTaxon {
  id: number;
  scientific_name: string;
  common_name: string | null;
  conservation_status?: string | null;
}

/** Estructura real devuelta por GET /api/observations y GET /api/observations/{id} */
export interface ApiObservation {
  id: number;
  user_id: number;
  taxon_id: number | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  observed_at: string | null;
  description: string | null;
  notes: string | null;
  is_public: boolean;
  points_awarded: number;
  created_at: string;
  updated_at: string;
  // Relaciones eager-loaded
  user?: ObservationUser;
  taxon?: ObservationTaxon | null;
  photos?: ObservationPhoto[];
  comments?: Comment[];
}

export interface ObservationPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ── Legado (usado en ObservationDetail mock) ──────────────────────────────

export interface Observation {
  id: number;
  species_name: string;
  scientific_name?: string;
  image: string;
  location: string;
  date: string;
  time: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  description: string;
  weather?: string;
  notes?: string;
  is_favorite?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  created_at: string;
}