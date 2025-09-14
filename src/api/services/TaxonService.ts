import BaseService from './BaseService';
import apiClient from '../apiClient';

export interface Taxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  observations_count?: number;
  default_photo?: {
    url: string;
    attribution?: string;
  };
  conservation_status?: {
    status: string;
    status_name: string;
  };
  // Agrega más campos según sea necesario
}

export interface TaxonListResponse {
  data: Taxon[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export class TaxonService extends BaseService<any> {
  constructor() {
    super('taxa');
  }
  /**
   * Obtiene una lista de especies por lugar
   */
  async getSpeciesByPlace(placeId: number, params: any = {}): Promise<TaxonListResponse> {
    const response = await apiClient.get<TaxonListResponse>('/taxa/place/species', {
      params: {
        place_id: placeId,
        ...params
      }
    });
    return response.data;
  }

  /**
   * Busca taxones por nombre
   */
  async searchTaxa(query: string, params: any = {}): Promise<TaxonListResponse> {
    const response = await apiClient.get<TaxonListResponse>('/taxa/search', {
      params: {
        q: query,
        ...params
      }
    });
    return response.data;
  }

  /**
   * Obtiene los detalles de un taxón específico
   */
  async getTaxonDetails(taxonId: number | string): Promise<{ data: Taxon }> {
    const response = await apiClient.get<{ data: Taxon }>(`/taxa/${taxonId}`);
    return response.data;
  }

  /**
   * Obtiene las observaciones de un taxón específico
   */
  async getTaxonObservations(taxonId: number | string, params: any = {}): Promise<any> {
    const response = await apiClient.get(`/taxa/${taxonId}/observations`, { params });
    return response.data;
  }
}

export const taxonService = new TaxonService();
