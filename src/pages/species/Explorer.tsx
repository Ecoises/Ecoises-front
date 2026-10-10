import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Globe, Leaf, Loader2, Microscope, Navigation, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LocationMapModal } from "@/components/observations/LocationMapModal";
import { SpeciesCard, SpeciesCardSkeleton } from "@/components/explorer/SpeciesCard";
import { ExplorerFilterOptions } from "@/components/explorer/ExplorerFilterOptions";
import { ActiveFilterChips, countActiveFilters } from "@/components/explorer/ActiveFilterChips";
import { useExplorerSpecies, useScientificRecords } from "@/hooks/useExplorer";
import { useExplorerLocation } from "@/hooks/useExplorerLocation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ExplorerFilters } from "@/types/explorer";

const RADIUS_OPTIONS = [10, 25, 50, 100];
const SKELETONS = Array.from({ length: 12 });
const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5";

type Source = "ciudadana" | "cientifica";

/** Lee los filtros de la URL (acepta los nombres antiguos iconic_taxa y order_by). */
const readFilters = (params: URLSearchParams): Omit<ExplorerFilters, "lat" | "lng"> => {
  const radius = Number(params.get("radius") || 25);
  return {
    q: params.get("q") || undefined,
    group: params.get("group") || params.get("iconic_taxa") || undefined,
    native: params.get("native") === "1",
    endemic: params.get("endemic") === "1",
    threatened: params.get("threatened") === "1",
    order: params.get("order") === "random" || params.get("order_by") === "random" ? "random" : "popular",
    seed: params.get("seed") || undefined,
    radius: RADIUS_OPTIONS.includes(radius) ? radius : 25,
  };
};

const writeFilters = (filters: Partial<ExplorerFilters>, source: Source) => {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.group) params.set("group", filters.group);
  if (filters.native) params.set("native", "1");
  if (filters.endemic) params.set("endemic", "1");
  if (filters.threatened) params.set("threatened", "1");
  if (filters.order === "random") params.set("order", "random");
  if (filters.order === "random" && filters.seed) params.set("seed", filters.seed);
  if (filters.radius && filters.radius !== 25) params.set("radius", String(filters.radius));
  if (source === "cientifica") params.set("fuente", "cientifica");
  return params;
};

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useExplorerLocation();
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const source: Source = searchParams.get("fuente") === "cientifica" ? "cientifica" : "ciudadana";
  const urlFilters = useMemo(() => readFilters(searchParams), [searchParams]);
  const filters: ExplorerFilters = useMemo(
    () => ({ ...urlFilters, lat: location.coords?.lat, lng: location.coords?.lng }),
    [urlFilters, location.coords]
  );

  // La navegación se aplica en una transición de React, así que la URL renderizada
  // puede ir un paso atrás. Se guarda la última escrita para que dos cambios
  // seguidos (p. ej. grupo y luego endémicas) no se pisen.
  const latestParams = useRef(searchParams);
  useEffect(() => {
    latestParams.current = searchParams;
  }, [searchParams]);

  const update = useCallback(
    (changes: Partial<ExplorerFilters>, nextSource?: Source) => {
      if ("lat" in changes && changes.lat === undefined) location.clear();
      const previous = latestParams.current;
      const previousSource: Source = previous.get("fuente") === "cientifica" ? "cientifica" : "ciudadana";
      const next = writeFilters({ ...readFilters(previous), ...changes }, nextSource ?? previousSource);
      latestParams.current = next;
      setSearchParams(next);
    },
    [location, setSearchParams]
  );

  // Buscador con espera de 500 ms antes de consultar.
  const [searchTerm, setSearchTerm] = useState(urlFilters.q ?? "");
  useEffect(() => setSearchTerm(urlFilters.q ?? ""), [urlFilters.q]);
  useEffect(() => {
    const term = searchTerm.trim();
    if (term === (urlFilters.q ?? "")) return;
    const timer = setTimeout(() => update({ q: term || undefined }), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, update, urlFilters.q]);

  const citizen = useExplorerSpecies(filters);
  const scientific = useScientificRecords(filters, true);
  const active = source === "ciudadana" ? citizen : scientific;

  const species = active.data?.pages.flatMap((page) => page.data) ?? [];
  const scientificBuilding = scientific.data?.pages[0]?.status === "building";
  const totals = {
    ciudadana: citizen.data?.pages[0]?.meta.pagination.total,
    cientifica: scientificBuilding ? undefined : scientific.data?.pages[0]?.meta.pagination.total,
  };
  const showSkeleton = active.isLoading || (active.isFetching && active.isPlaceholderData) || (source === "cientifica" && scientificBuilding);

  const loadMore = useCallback(() => {
    if (active.hasNextPage && !active.isFetchingNextPage) active.fetchNextPage();
  }, [active]);
  const sentinelRef = useInfiniteScroll(loadMore, !!active.hasNextPage && !showSkeleton);

  const activeCount = countActiveFilters(filters);
  const hasLocation = !!location.coords;
  const title = hasLocation ? `Especies cerca de ${location.name || "ti"}` : "Especies de Colombia";

  const filterOptions = <ExplorerFilterOptions filters={filters} onChange={(changes) => update(changes)} />;

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-4 animate-fade-in">
      {/* Título y alcance en una sola línea */}
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="font-heading text-2xl font-bold leading-tight text-forest-950 md:text-4xl">{title}</h1>
        <Badge variant="outline" className="border-lime-500 bg-lime-50 text-lime-700">
          {hasLocation ? `Radio de ${filters.radius} km` : "Catálogo nacional"}
        </Badge>
      </header>

      {/* Barra fija: buscador, ubicación, mapa y filtros */}
      <div className="sticky top-16 z-20 -mx-4 space-y-3 border-b border-lime-100 bg-white/85 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <label htmlFor="explorer-search" className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar especie</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" aria-hidden="true" />
            <Input
              id="explorer-search"
              type="search"
              placeholder="Buscar especie..."
              className="h-11 rounded-xl border-lime-200 bg-white pl-10 pr-9 text-base focus-visible:ring-lime-500 md:text-sm"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-lime-50"
                aria-label="Borrar búsqueda"
              >
                <X className="h-4 w-4 text-forest-500" aria-hidden="true" />
              </button>
            )}
          </label>

          {hasLocation ? (
            <Button
              variant="outline"
              onClick={() => update({ lat: undefined, lng: undefined })}
              className="h-11 shrink-0 gap-2 rounded-xl border-red-200 px-3 text-red-600 hover:bg-red-50"
              aria-label="Quitar ubicación"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Quitar ubicación</span>
            </Button>
          ) : (
            <Button
              onClick={location.locate}
              disabled={location.isLocating}
              className="h-11 shrink-0 gap-2 rounded-xl bg-lime-600 px-3 text-white shadow-sm hover:bg-lime-700"
              aria-label="Usar mi ubicación"
            >
              {location.isLocating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Navigation className="h-4 w-4" aria-hidden="true" />}
              <span className="hidden md:inline">Mi ubicación</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setMapOpen(true)}
            className="h-11 shrink-0 gap-2 rounded-xl border-lime-300 px-3 text-lime-700 hover:bg-lime-50"
            aria-label="Elegir zona en el mapa"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Mapa</span>
          </Button>

          {hasLocation && (
            <label className="hidden h-11 shrink-0 items-center gap-1 rounded-xl border border-lime-200 bg-white px-3 text-sm text-forest-700 md:flex">
              <span>Radio</span>
              <select
                aria-label="Radio de búsqueda"
                value={filters.radius}
                onChange={(event) => update({ radius: Number(event.target.value) })}
                className="cursor-pointer bg-transparent font-semibold text-lime-700 outline-none"
              >
                {RADIUS_OPTIONS.map((option) => <option key={option} value={option}>{option} km</option>)}
              </select>
            </label>
          )}

          <Button
            variant="outline"
            onClick={() => setFiltersOpen((open) => !open)}
            className={cn(
              "relative h-11 shrink-0 gap-2 rounded-xl border-lime-200 px-3",
              filtersOpen && "border-lime-500 bg-lime-50 text-lime-700"
            )}
            aria-label="Filtros"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Filtros</span>
            {activeCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white md:static md:bg-lime-600">
                {activeCount}
              </span>
            )}
          </Button>
        </div>

        {location.error && <p className="text-xs text-red-600" role="alert">{location.error}</p>}

        <ActiveFilterChips
          filters={filters}
          total={totals[source]}
          locationName={location.name}
          onClear={(changes) => update(changes)}
        />

        {/* Panel de filtros en escritorio */}
        {filtersOpen && !isMobile && (
          <div className="rounded-xl border border-lime-100 bg-lime-50/60 p-4 animate-fade-in">
            {filterOptions}
          </div>
        )}
      </div>

      {/* Panel de filtros en el celular, desde abajo */}
      <Sheet open={filtersOpen && isMobile} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="font-heading text-forest-950">Filtros</SheetTitle>
            <SheetDescription>Elige qué especies quieres ver.</SheetDescription>
          </SheetHeader>
          {filterOptions}
          {hasLocation && (
            <label className="mt-5 flex items-center justify-between rounded-xl border border-lime-200 px-3 py-2 text-sm text-forest-800">
              Radio de búsqueda
              <select
                value={filters.radius}
                onChange={(event) => update({ radius: Number(event.target.value) })}
                className="cursor-pointer bg-transparent font-semibold text-lime-700 outline-none"
              >
                {RADIUS_OPTIONS.map((option) => <option key={option} value={option}>{option} km</option>)}
              </select>
            </label>
          )}
          <Button className="mt-6 h-12 w-full rounded-xl bg-lime-600 text-white hover:bg-lime-700" onClick={() => setFiltersOpen(false)}>
            Ver {totals[source]?.toLocaleString("es-CO") ?? ""} especies
          </Button>
        </SheetContent>
      </Sheet>

      {/* Fuente de los datos */}
      <div role="tablist" aria-label="Fuente de los datos" className="flex gap-2">
        {([
          ["ciudadana", "Ciencia ciudadana", "Ciudadana", Users, "bg-lime-500"],
          ["cientifica", "Registros científicos", "Científicos", Microscope, "bg-teal-500"],
        ] as const).map(([value, label, shortLabel, Icon, dot]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={source === value}
            onClick={() => update({}, value)}
            className={cn(
              "inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors duration-200 md:flex-none md:px-4",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500",
              source === value ? "border-forest-900 bg-forest-950 text-white" : "border-lime-200 bg-white text-forest-800 hover:bg-lime-50"
            )}
          >
            <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
            <Icon className="hidden h-4 w-4 md:block" aria-hidden="true" />
            <span className="md:hidden">{shortLabel}</span>
            <span className="hidden md:inline">{label}</span>
            {value === "cientifica" && scientificBuilding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-label="Calculando" />
            ) : (
              typeof totals[value] === "number" && <span className="tabular-nums opacity-70">{totals[value]!.toLocaleString("es-CO")}</span>
            )}
          </button>
        ))}
      </div>

      {source === "cientifica" && (
        <p className="text-sm text-forest-700">
          Especies con registros de museos, colecciones y monitoreos (GBIF) que no aparecen en ciencia ciudadana para esta zona.
          {scientificBuilding && " Estamos reuniendo los registros de esta zona por primera vez; tarda unos segundos."}
        </p>
      )}

      {/* Lista */}
      {active.isError ? (
        <Alert variant="destructive">
          <AlertTitle>No pudimos cargar las especies</AlertTitle>
          <AlertDescription>Revisa tu conexión e intenta de nuevo.</AlertDescription>
        </Alert>
      ) : showSkeleton ? (
        <div className={GRID}>{SKELETONS.map((_, i) => <SpeciesCardSkeleton key={i} />)}</div>
      ) : species.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-lime-200 bg-lime-50/40 px-4 py-16 text-center">
          <Leaf className="mx-auto mb-3 h-8 w-8 text-lime-500" aria-hidden="true" />
          <p className="text-forest-700">No encontramos especies con estos filtros.</p>
          <Button variant="link" className="text-lime-700" onClick={() => update({ q: undefined, group: undefined, native: false, endemic: false, threatened: false })}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <>
          <div className={GRID}>
            {species.map((item) => <SpeciesCard key={`${item.source}-${item.id}`} species={item} />)}
          </div>
          <div ref={sentinelRef} className="flex justify-center py-6" aria-live="polite">
            {active.isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 animate-spin text-lime-600" aria-label="Cargando más especies" />
            ) : (
              // Respaldo del scroll infinito para teclado y lectores de pantalla.
              active.hasNextPage && (
                <Button variant="outline" onClick={loadMore} className="rounded-full border-lime-300 text-lime-700 hover:bg-lime-50">
                  Ver más especies
                </Button>
              )
            )}
          </div>
        </>
      )}

      <LocationMapModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        initialLat={location.coords?.lat}
        initialLng={location.coords?.lng}
        initialLocationName={location.name || ""}
        onConfirm={location.choose}
      />
    </div>
  );
}
