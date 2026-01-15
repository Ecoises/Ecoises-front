import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
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

      // Si hay un término de búsqueda ('q'), usamos el endpoint de búsqueda global
      // Si no, usamos el endpoint de exploración de Colombia
      const endpoint = cleanParams.q
        ? '/api/taxa/search'
        : '/api/taxa/explore/colombia';

      console.log('🌐 useSpecies - Params after cleaning:', cleanParams);
      console.log('🌐 useSpecies - Will send to:', endpoint);

      const { data } = await api.get<ExploreResponse>(endpoint, {
        params: { ...cleanParams, enrich: 0 }, // Optimize load time by skipping heavy details
      });

      console.log('✅ useSpecies - Response received, data count:', data?.data?.length);

      return data;
    },
    placeholderData: (previousData) => previousData,
    // Si es random, NO cachear y siempre refetch
    staleTime: isRandom ? 0 : 5 * 60 * 1000,
    gcTime: isRandom ? 0 : 5 * 60 * 1000,
    refetchOnMount: isRandom ? 'always' : true,
  });
};

export const useSpeciesDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['species', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: any }>(`/api/taxa/${id}`, {
        params: { enrich: 1 } // Request enriched data, sending 1 to pass strict boolean validation
      });
      return data.data;
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRelatedSpecies = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['related-species', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: any[] }>(`/api/taxa/${id}/related`);
      return data.data;
    },
    enabled: options?.enabled !== false && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
