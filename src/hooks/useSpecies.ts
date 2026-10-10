import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

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
