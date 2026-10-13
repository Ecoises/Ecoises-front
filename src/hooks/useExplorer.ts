import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type { ExplorerFilters, ExplorerPage } from "@/types/explorer";

const PER_PAGE = 24;

const toParams = (filters: ExplorerFilters, page: number) => {
  const params: Record<string, string | number> = { page, per_page: PER_PAGE, order: filters.order };
  if (filters.q) params.q = filters.q;
  if (filters.group) params.group = filters.group;
  if (filters.native) params.native = 1;
  if (filters.endemic) params.endemic = 1;
  if (filters.threatened) params.threatened = 1;
  if (filters.seed) params.seed = filters.seed;
  if (filters.lat != null && filters.lng != null) {
    params.lat = filters.lat;
    params.lng = filters.lng;
    params.radius = filters.radius ?? 25;
  }
  return params;
};

const nextPage = (last: ExplorerPage) => {
  const { current_page, last_page } = last.meta.pagination;
  return current_page < last_page ? current_page + 1 : undefined;
};

/** Lista principal (iNaturalist): fotos y nombres al instante, más páginas al bajar. */
export const useExplorerSpecies = (filters: ExplorerFilters) =>
  useInfiniteQuery({
    queryKey: ["explorer", filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<ExplorerPage>("/explorer", { params: toParams(filters, pageParam) });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: nextPage,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

/**
 * Registros científicos (todas las especies de GBIF en la zona). La primera
 * vez que se pide una zona el backend responde "building"; se vuelve a
 * preguntar cada pocos segundos solo esta sección, sin tocar la lista principal.
 */
export const useScientificRecords = (filters: ExplorerFilters, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: ["explorer-scientific", filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<ExplorerPage>("/explorer/scientific", { params: toParams(filters, pageParam) });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.status === "building" ? undefined : nextPage(last)),
    enabled,
    staleTime: 30 * 60 * 1000,
    refetchInterval: (query) =>
      query.state.data?.pages[0]?.status === "building" && query.state.dataUpdateCount < 20 ? 4000 : false,
  });
