import apiClient from '../apiClient';

export interface Photo {
  id?: number;
  url?: string;
  medium_url?: string | null;
  square_url?: string | null;
  attribution?: string;
  license_code?: string | null;
}

/** Resumen de especie que devuelve el buscador del catálogo local. */
export interface Taxon {
  id: number;
  scientific_name: string;
  common_name?: string | null;
  default_photo?: Photo | null;
  conservation_status?: string | null;
  is_native?: boolean | null;
  is_endemic?: boolean | null;
  is_introduced?: boolean | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface TaxonListResponse {
  success: boolean;
  data: Taxon[];
  meta: { pagination: PaginationMeta; source?: string };
}

/**
 * Buscador de especies del catálogo local (GET /api/taxa/search).
 * La exploración geográfica y las fichas se consultan con los hooks de
 * `@/hooks/useSpecies`.
 */
export const taxonService = {
  async searchTaxa(query: string, params: { per_page?: number } = {}): Promise<TaxonListResponse> {
    const q = query.trim();
    if (q.length < 2) {
      return { success: true, data: [], meta: { pagination: { current_page: 1, last_page: 1, per_page: 0, total: 0 } } };
    }

    const { data } = await apiClient.get<TaxonListResponse>('/taxa/search', {
      params: { q, per_page: params.per_page ?? 12 },
    });

    return data;
  },
};

export default taxonService;
