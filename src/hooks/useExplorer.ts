import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import type { ExplorerFilters, ExplorerPage, ExplorerSpecies } from "@/types/explorer";

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

/** Género y especie en minúsculas, sin autor ni año, para no repetir una especie de las dos fuentes. */
const speciesKey = (name: string) => name.toLowerCase().split(/\s+/).slice(0, 2).join(" ");

/**
 * Lista única del explorador: mezcla iNaturalist y GBIF página por página
 * (una de cada fuente, alternadas) y quita las especies repetidas.
 */
export const useCombinedExplorer = (filters: ExplorerFilters) => {
  const citizen = useExplorerSpecies(filters);
  const scientific = useScientificRecords(filters, true);

  const citizenPages = citizen.data?.pages ?? [];
  const scientificPages = scientific.data?.pages.filter((page) => page.status !== "building") ?? [];

  const species: ExplorerSpecies[] = [];
  const seen = new Set<string>();
  const add = (item?: ExplorerSpecies) => {
    if (!item) return;
    const key = speciesKey(item.scientific_name);
    if (seen.has(key)) return;
    seen.add(key);
    species.push(item);
  };

  for (let page = 0; page < Math.max(citizenPages.length, scientificPages.length); page++) {
    const a = citizenPages[page]?.data ?? [];
    const b = scientificPages[page]?.data ?? [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      add(a[i]);
      add(b[i]);
    }
  }

  const citizenTotal = citizen.data?.pages[0]?.meta.pagination.total;
  const scientificTotal = scientificPages[0]?.meta.pagination.total;
  // Muchas especies están en las dos fuentes; el total es al menos el mayor de los dos.
  const total = citizenTotal == null && scientificTotal == null ? undefined : Math.max(citizenTotal ?? 0, scientificTotal ?? 0);

  const hasNextPage = !!citizen.hasNextPage || !!scientific.hasNextPage;
  const isFetchingNextPage = citizen.isFetchingNextPage || scientific.isFetchingNextPage;

  const fetchNextPage = () => {
    if (citizen.hasNextPage && !citizen.isFetchingNextPage) citizen.fetchNextPage();
    if (scientific.hasNextPage && !scientific.isFetchingNextPage) scientific.fetchNextPage();
  };

  return {
    species,
    total,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    // Mientras iNaturalist carga la primera página se muestran los esqueletos;
    // GBIF se suma en cuanto llega, sin bloquear la lista.
    isLoading:
      citizen.isLoading ||
      (citizen.isFetching && citizen.isPlaceholderData) ||
      // Si iNaturalist no trae nada, se espera a GBIF antes de decir que no hay especies.
      (species.length === 0 && (scientific.isLoading || scientific.data?.pages[0]?.status === "building")),
    isError: citizen.isError && scientific.isError,
  };
};
