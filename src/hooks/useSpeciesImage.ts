import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

interface DailySpecies {
  name: string;
  scientificName: string;
  image: string;
  author: string;
}

/**
 * Foto de una especie para las pantallas de acceso.
 * Usa las curiosidades del día del backend (cacheadas 24 h) en lugar de
 * llamar a iNaturalist desde el navegador.
 */
export const useSpeciesImage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['auth-species-image'],
    queryFn: async () => {
      const { data } = await apiClient.get<DailySpecies[]>('/daily-curiosities');
      const withImage = data.filter((species) => species.image);
      return withImage[Math.floor(Math.random() * withImage.length)] ?? null;
    },
    staleTime: 60 * 60 * 1000,
  });

  return {
    imageUrl: data?.image ?? '',
    speciesName: data?.name ?? '',
    scientificName: data?.scientificName ?? '',
    photoAttribution: data?.author ?? '',
    imageLoading: isLoading,
    imageError: isError || (!isLoading && !data),
    refetchImage: refetch,
  };
};
