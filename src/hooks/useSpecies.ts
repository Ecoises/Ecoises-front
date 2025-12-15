import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ExploreResponse } from '@/types/api';

interface UseSpeciesParams {
  page?: number;
  per_page?: number;
  q?: string;
  rank?: string;
  native?: boolean;
  endemic?: boolean;
  threatened?: boolean;
  order_by?: string;
}

export const useSpecies = (params: UseSpeciesParams = {}) => {
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

      const { data } = await api.get<ExploreResponse>(endpoint, {
        params: cleanParams,
      });
      return data;
    },
    placeholderData: (previousData) => previousData, // Maintain data while fetching new page
    staleTime: 5 * 60 * 1000, // 5 minutes
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
