import { keepPreviousData, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { ExploreResponse } from '@/types/api';

interface UseSpeciesParams {
  page?: number;
  per_page?: number;
  q?: string;
  // rank?: string;
  iconic_taxa?: string;
  taxon_id?: number;
  native?: boolean;
  endemic?: boolean;
  threatened?: boolean;
  order_by?: string;
  stateProvince?: string;
  municipality?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  random_seed?: string;
}

export const useSpecies = (params: UseSpeciesParams = {}) => {
  const isRandom = params.order_by === 'random';

  return useQuery({
    queryKey: ['species', params],
    queryFn: async () => {
      // Clean params: remove undefined or empty strings
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== 'Todas' && v !== 'Todos' && v !== 'all' && v !== false)
      );

      // Si hay coordenadas, usar el endpoint optimizado de caché por celda
      // Si hay búsqueda, usar búsqueda global
      // Si no, usar exploración nacional
      const endpoint = cleanParams.lat && cleanParams.lng
        ? '/explorer/nearby'
        : '/explorer/national';

      const { data } = await apiClient.get<ExploreResponse>(endpoint, {
        params: { ...cleanParams, enrich: 0 }, // Optimize load time by skipping heavy details
      });

      return data;
    },
    // Si es random, NO cachear y siempre refetch
    staleTime: isRandom ? 0 : 5 * 60 * 1000,
    gcTime: isRandom ? 0 : 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: isRandom ? 'always' : true,
    // Al cambiar filtros o página se conserva la lista anterior mientras llega la nueva.
    placeholderData: keepPreviousData,
    // Mientras el backend completa fotos en segundo plano (cola species-sync),
    // volvemos a pedir la página unas pocas veces para mostrar las tarjetas completas.
    refetchInterval: (query) =>
      (query.state.data as ExploreResponse | undefined)?.meta?.enriching_count && query.state.dataUpdateCount < 6
        ? 8000
        : false,
  });
};

export const useSpeciesDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['species', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: any }>(`/taxa/${id}`, {
        params: { enrich: 1 } // Request enriched data, sending 1 to pass strict boolean validation
      });
      return data.data;
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRelatedSpecies = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['related-species', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: any[] }>(`/taxa/${id}/related`);
      return data.data;
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
