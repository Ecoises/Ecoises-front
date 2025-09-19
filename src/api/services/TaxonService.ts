import BaseService from './BaseService';
import apiClient from '../apiClient';

export interface Photo {
  url: string;
  attribution?: string;
  license_code?: string;
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
  preferred_common_name?: string | null;
  observations_count?: number;
  default_photo?: Photo | null;
  conservation_status?: ConservationStatus | null;
  scientific_name?: string;
  rank?: string;
  rank_level?: number;
  wikipedia_url?: string;
  preferred_establishment_means?: string;
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
  };
}

export interface TaxonListResponse extends ApiResponse<Taxon[]> {
  meta: {
    pagination: PaginationMeta;
    source?: string;
    cached?: boolean;
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
   * Obtiene una lista de especies por lugar
   */
  async getSpeciesByPlace(placeId: number, params: any = {}): Promise<TaxonListResponse> {
    try {
      const response = await apiClient.get<TaxonListResponse>('/taxa/place/species', {
        params: {
          place_id: placeId,
          per_page: 12,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching species by place:', error);
      throw this.normalizeError(error);
    }
  }

  /**
   * Busca taxones por nombre
   */
  async searchTaxa(query: string = '', params: any = {}): Promise<TaxonListResponse> {
    try {
      const { page = 1, per_page = 12, ...restParams } = params;
      
      // Usamos 'all' como valor por defecto para obtener todos los taxones
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
      
      // Normalizar la respuesta para asegurar consistencia
      const responseData = response.data;
      
      // Verificar si la respuesta es exitosa
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Error en la búsqueda de taxones');
      }
      
      // Extraer datos y metadatos
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
   * Obtiene los detalles de un taxón específico
   */
  async getTaxonDetails(taxonId: number | string): Promise<ApiResponse<Taxon>> {
    try {
      const response = await apiClient.get<ApiResponse<Taxon>>(`/taxa/${taxonId}`);
      
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