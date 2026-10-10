/** Tarjeta de especie que devuelve GET /api/explorer y /api/explorer/scientific. */
export interface ExplorerSpecies {
  id: number;
  scientific_name: string;
  common_name: string | null;
  default_photo: { url: string | null; attribution?: string | null } | null;
  is_native: boolean;
  is_endemic: boolean;
  is_introduced: boolean;
  is_threatened: boolean;
  conservation_status: string | null;
  group: string | null;
  observation_count?: number;
  occurrence_count?: number;
  /** inaturalist = ciencia ciudadana · gbif = registro científico */
  source: "inaturalist" | "gbif";
}

export interface ExplorerPage {
  success: boolean;
  /** Solo en registros científicos: "building" mientras se calcula la zona por primera vez. */
  status?: "ready" | "building";
  data: ExplorerSpecies[];
  meta: {
    source?: string;
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
  };
}

export interface ExplorerFilters {
  q?: string;
  group?: string;
  native?: boolean;
  endemic?: boolean;
  threatened?: boolean;
  order: "popular" | "random";
  seed?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
