import BaseService from './BaseService';
import apiClient from '../apiClient';

export interface Photo {
  id?: number;
  url: string;
  medium_url?: string | null;
  square_url?: string | null;
  large_url?: string | null;
  small_url?: string | null;
  attribution?: string;
  license_code?: string | null;
  original_dimensions?: {
    width: number;
    height: number;
  };
}

export interface ConservationStatus {
  status: string;
  status_name: string;
  iucn_status?: string;
  authority?: string;
}

export interface Taxon {
  id: number;
  name: string;
  scientific_name: string;
  common_name?: string | null;
  rank?: string;
  rank_level?: number;
  observations_count?: number;
  default_photo?: Photo | null;
  conservation_status?: ConservationStatus | null;
  wikipedia_url?: string;
  extinct?: boolean;
  threatened?: boolean;
  iconic_taxon_name?: string;
  ancestry?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface LocationInfo {
  name: string;
  latitude: number;
  longitude: number;
  radius_km: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    source?: string;
    cached?: boolean;
    location?: LocationInfo;
  };
}

export interface TaxonListResponse extends ApiResponse<Taxon[]> {
  meta: {
    pagination: PaginationMeta;
    source?: string;
    cached?: boolean;
    location?: LocationInfo;
  };
}

export interface ApiError {
  message: string;
  code?: string | number;
  errors?: Record<string, string[]>;
}

export class TaxonService extends BaseService<any> {
  constructor() {
    super('taxa');
  }

  /**
   * 🆕 MÉTODO PRINCIPAL: Obtiene especies cercanas a la ubicación del usuario
   * Este método corresponde al endpoint listSpeciesByPlace de tu backend
   */
  async getNearbySpecies(params: any = {}): Promise<TaxonListResponse> {
    try {
      const { page = 1, per_page = 12, ...restParams } = params;
      
      const response = await apiClient.get<TaxonListResponse>('/taxa/place/species', {
        params: {
          page,
          per_page,
          order_by: 'observations_count',
          order: 'desc',
          ...restParams
        }
      });
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Error al obtener especies cercanas');
      }
      
      return responseData;
      
    } catch (error) {
      console.error('Error fetching nearby species:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Busca taxones por nombre - CORREGIDO para usar el endpoint correcto
   */
  async searchTaxa(query: string = '', params: any = {}): Promise<TaxonListResponse> {
    try {
      const { page = 1, per_page = 12, ...restParams } = params;
      
      // Si no hay query, usar 'all' para obtener especies populares
      const searchQuery = query.trim() || 'all';
      
      const searchParams: Record<string, any> = {
        q: searchQuery,
        page,
        per_page,
        ...restParams
      };
      
      const response = await apiClient.get<ApiResponse<Taxon[]>>('/taxa/search', {
        params: searchParams
      });
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Error en la búsqueda de taxones');
      }
      
      const data = Array.isArray(responseData.data) ? responseData.data : [];
      const meta = responseData.meta || {};
      const pagination = meta.pagination || {
        current_page: page,
        last_page: 1,
        per_page: per_page,
        total: data.length,
        from: data.length > 0 ? 1 : 0,
        to: data.length
      };
      
      return {
        success: true,
        data,
        meta: {
          pagination,
          source: meta.source || 'unknown',
          cached: meta.cached || false
        }
      };
      
    } catch (error) {
      console.error('Error searching taxa:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Obtiene los detalles completos de un taxón específico
   */
  async getTaxonDetails(taxonId: number | string, refresh: boolean = false): Promise<ApiResponse<Taxon>> {
    try {
      const params = refresh ? { refresh: true } : {};
      
      const response = await apiClient.get<ApiResponse<Taxon>>(`/taxa/${taxonId}`, {
        params
      });
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || `Error al obtener detalles del taxón ${taxonId}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error fetching taxon details for ID ${taxonId}:`, error);
      throw this.normalizeError(error);
    }
  }

  /**
   * 🆕 Obtiene las observaciones de un taxón específico
   */
  async getTaxonObservations(taxonId: number | string, params: any = {}): Promise<ApiResponse<any[]>> {
    try {
      const { page = 1, per_page = 30, ...restParams } = params;
      
      const response = await apiClient.get<ApiResponse<any[]>>(`/taxa/${taxonId}/observations`, {
        params: {
          page,
          per_page,
          ...restParams
        }
      });
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || `Error al obtener observaciones del taxón ${taxonId}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error fetching observations for taxon ${taxonId}:`, error);
      throw this.normalizeError(error);
    }
  }

  /**
   * 🆕 Sincroniza las observaciones de un taxón desde la API
   */
  async syncTaxonObservations(taxonId: number | string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/taxa/${taxonId}/sync-observations`);
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || `Error al sincronizar observaciones del taxón ${taxonId}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error syncing observations for taxon ${taxonId}:`, error);
      throw this.normalizeError(error);
    }
  }

  /**
   * 🆕 Obtiene estadísticas de un taxón
   */
  async getTaxonStats(taxonId: number | string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/taxa/${taxonId}/stats`);
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || `Error al obtener estadísticas del taxón ${taxonId}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`Error fetching stats for taxon ${taxonId}:`, error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Obtiene todos los taxones con paginación
   */
  async getAllTaxa(params: any = {}): Promise<TaxonListResponse> {
    try {
      const { page = 1, per_page = 12, ...restParams } = params;
      
      const response = await apiClient.get<ApiResponse<Taxon[]>>('/taxa', {
        params: {
          page,
          per_page,
          ...restParams
        }
      });
      
      const responseData = response.data;
      
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Error al obtener todos los taxones');
      }
      
      const data = Array.isArray(responseData.data) ? responseData.data : [];
      const meta = responseData.meta || {};
      const pagination = meta.pagination || {
        current_page: page,
        last_page: Math.ceil((responseData.data?.length || 0) / per_page) || 1,
        per_page: per_page,
        total: responseData.data?.length || 0,
        from: data.length > 0 ? 1 : 0,
        to: data.length
      };
      
      return {
        success: true,
        data,
        meta: {
          pagination,
          source: meta.source || 'local',
          cached: meta.cached || false
        }
      };
    } catch (error: any) {
      console.error('Error fetching all taxa:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * 🔄 MÉTODO LEGACY: Mantenido para compatibilidad, pero redirige al método principal
   * @deprecated Usa getNearbySpecies() en su lugar
   */
  async getSpeciesByPlace(placeId: number, params: any = {}): Promise<TaxonListResponse> {
    console.warn('getSpeciesByPlace() está obsoleto. Usa getNearbySpecies() en su lugar.');
    return this.getNearbySpecies(params);
  }

  /**
   * Normaliza los errores de la API
   */
  private normalizeError(error: any): ApiError {
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que está fuera del rango 2xx
      const responseData = error.response.data;
      
      return {
        message: responseData?.message || 'Error en la respuesta del servidor',
        code: error.response.status,
        errors: responseData?.errors
      };
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      return {
        message: 'No se pudo conectar con el servidor',
        code: 'NETWORK_ERROR'
      };
    } else {
      // Algo ocurrió en la configuración de la petición que generó un error
      return {
        message: error.message || 'Error al realizar la petición',
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  }
}

export const taxonService = new TaxonService();