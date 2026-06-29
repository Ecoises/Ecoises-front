import apiClient from '../apiClient';
import type { ApiObservation, ObservationPagination } from '@/types/observation';

export interface ObservationListResponse {
  success: boolean;
  data: ApiObservation[];
  meta: { pagination: ObservationPagination };
}

export interface ObservationDetailResponse {
  success: boolean;
  data: ApiObservation;
}

export interface ObservationCreateResponse {
  success: boolean;
  message: string;
  data: ApiObservation;
}

class ObservationService {
  private endpoint = 'observations';

  /** Listar observaciones públicas (opcionalmente filtradas por taxon_id o user_id) */
  async getAll(params?: { taxon_id?: number; user_id?: number; per_page?: number; page?: number }): Promise<ObservationListResponse> {
    const response = await apiClient.get<ObservationListResponse>(`/${this.endpoint}`, { params });
    return response.data;
  }

  /** Obtener detalle de una observación */
  async getById(id: number | string): Promise<ApiObservation | null> {
    try {
      const response = await apiClient.get<ObservationDetailResponse>(`/${this.endpoint}/${id}`);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Registrar un nuevo avistamiento.
   * Envía los datos como FormData para soportar subida de fotos.
   */
  async create(payload: {
    taxon_id?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    location_name?: string;
    observed_at?: string;
    description?: string;
    notes?: string;
    is_public?: boolean;
    photos?: File[];
  }): Promise<ObservationCreateResponse> {
    const form = new FormData();

    if (payload.taxon_id != null) form.append('taxon_id', String(payload.taxon_id));
    if (payload.latitude != null) form.append('latitude', String(payload.latitude));
    if (payload.longitude != null) form.append('longitude', String(payload.longitude));
    if (payload.location_name) form.append('location_name', payload.location_name);
    if (payload.observed_at) form.append('observed_at', payload.observed_at);
    if (payload.description) form.append('description', payload.description);
    if (payload.notes) form.append('notes', payload.notes);
    form.append('is_public', payload.is_public !== false ? '1' : '0');

    if (payload.photos?.length) {
      payload.photos.forEach((file) => form.append('photos[]', file));
    }

    const response = await apiClient.post<ObservationCreateResponse>(`/${this.endpoint}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Actualizar una observación existente.
   * Envía los datos como FormData para soportar la subida de nuevas fotos.
   */
  async update(
    id: number | string,
    payload: {
      taxon_id?: number | null;
      latitude?: number | null;
      longitude?: number | null;
      location_name?: string;
      observed_at?: string;
      description?: string;
      notes?: string;
      is_public?: boolean;
      photos?: File[];
      delete_photos?: number[];
    }
  ): Promise<ObservationCreateResponse> {
    const form = new FormData();

    if (payload.taxon_id !== undefined) form.append('taxon_id', payload.taxon_id !== null ? String(payload.taxon_id) : '');
    if (payload.latitude !== undefined) form.append('latitude', payload.latitude !== null ? String(payload.latitude) : '');
    if (payload.longitude !== undefined) form.append('longitude', payload.longitude !== null ? String(payload.longitude) : '');
    if (payload.location_name !== undefined) form.append('location_name', payload.location_name || '');
    if (payload.observed_at !== undefined) form.append('observed_at', payload.observed_at || '');
    if (payload.description !== undefined) form.append('description', payload.description || '');
    if (payload.notes !== undefined) form.append('notes', payload.notes || '');
    if (payload.is_public !== undefined) form.append('is_public', payload.is_public ? '1' : '0');

    if (payload.photos?.length) {
      payload.photos.forEach((file) => form.append('photos[]', file));
    }

    if (payload.delete_photos?.length) {
      payload.delete_photos.forEach((photoId) => form.append('delete_photos[]', String(photoId)));
    }

    const response = await apiClient.post<ObservationCreateResponse>(`/${this.endpoint}/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Eliminar una observación por ID.
   */
  async delete(id: number | string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Reportar una observación.
   */
  async report(id: number | string, comment: string): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await apiClient.post<{ success: boolean; message: string; data?: any }>(`/${this.endpoint}/${id}/report`, { comment });
    return response.data;
  }
}

export const observationService = new ObservationService();
export default observationService;
