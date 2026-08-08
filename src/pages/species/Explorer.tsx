import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { 
  Search, Filter, X, ShieldAlert, Loader2, MapPin, Star, Sparkles, Shuffle, Navigation, Map, CornerRightDown, Leaf, ListOrdered, Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSpecies } from "@/hooks/useSpecies";
import { useQueryClient } from "@tanstack/react-query";
import { Taxon } from "@/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocationMapModal } from "@/components/observations/LocationMapModal";


const LOCATION_STORAGE_KEY = 'ecoises.explorer.location.v1';
const LOCATION_TTL_MS = 24 * 60 * 60 * 1000;

type StoredLocation = {
  coords: { lat: number; lng: number };
  name: string;
  savedAt: number;
};

const readStoredLocation = (): StoredLocation | null => {
  try {
    const value = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredLocation;
    const validCoords = Number.isFinite(parsed?.coords?.lat) && Number.isFinite(parsed?.coords?.lng);
    if (!validCoords || Date.now() - parsed.savedAt > LOCATION_TTL_MS) {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const persistLocation = (coords: { lat: number; lng: number }, name: string) => {
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ coords, name, savedAt: Date.now() }));
};
const groups = [
  { label: "Todas", value: "" },
  { label: "Aves", value: "Aves" },
  { label: "Mamíferos", value: "Mammalia" },
  { label: "Reptiles", value: "Reptilia" },
  { label: "Anfibios", value: "Amphibia" },
  { label: "Insectos", value: "Insecta" },
  { label: "Arañas", value: "Arachnida" },
  { label: "Moluscos", value: "Mollusca" },
  { label: "Peces", value: "Actinopterygii" },
  { label: "Plantas", value: "Plantae" },
  { label: "Hongos", value: "Fungi" },
];

// Helpes for badges
const getConservationBadge = (statusData?: any) => {
  if (!statusData) return null;

  // Extract status code (VU, EN, etc)
  let code = '';
  if (typeof statusData === 'object') {
    code = statusData.status || statusData.status_name || '';
  } else {
    code = String(statusData);
  }

  const s = code.toUpperCase();

  if (s === 'NE') return null; // Hide Not Evaluated

  switch (s) {
    case 'EX': return { label: 'EX', className: 'bg-gray-900 text-white border-gray-700' };
    case 'EW': return { label: 'EW', className: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'CR': return { label: 'CR', className: 'bg-red-100 text-red-800 border-red-200' };
    case 'EN': return { label: 'EN', className: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'VU': return { label: 'VU', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'NT': return { label: 'NT', className: 'bg-lime-100 text-lime-800 border-lime-200' };
    case 'LC': return { label: 'LC', className: 'bg-green-100 text-green-800 border-green-200' };
    case 'DD': return { label: 'DD', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    default: return null;
  }
};

const getEstablishmentBadge = (species: Taxon) => {
  // 1. Check strict booleans first
  if (species.endemic) {
    return {
      icon: <Sparkles className="h-3 w-3" />,
      className: "bg-lime-800 text-white border-lime-900",
      label: "Endémica"
    };
  }

  // 2. Check string status (handling Spanish/English variations from Backend)
  const status = String(species.establishment_status_colombia || "").toLowerCase();

  if (status === "endemic" || status === "endémica" || status === "endemica") {
    return {
      icon: <Sparkles className="h-3 w-3" />,
      className: "bg-lime-800 text-white border-lime-900",
      label: "Endémica"
    };
  }

  if (species.native || status === "native" || status === "nativa") {
    return {
      icon: <Star className="h-3 w-3" />,
      className: "bg-lime-300 text-forest-900 border-lime-400",
      label: "Nativa"
    };
  }

  if (status === 'introduced' || status === 'introducida') {
    return {
      icon: <CornerRightDown className="h-3 w-3" />,
      className: "bg-pink-100 text-pink-800 border-pink-200",
      label: "Introducida"
    };
  }
  return null;
};

const SpeciesCard = ({ species }: { species: Taxon }) => {
  const location = useLocation();
  const conservation = getConservationBadge(species.conservation_status);
  const establishment = getEstablishmentBadge(species);

  return (
    <Link to={`/taxa/${species.id}`} state={{ from: location }} className="w-full block h-full">
      <Card className="w-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer flex flex-col group border-lime-100/60 bg-white">
        <div className="relative h-52 min-[430px]:h-48 bg-gray-100 overflow-hidden">
          {species.default_photo ? (
            <img
              src={
                species.default_photo.medium_url ||
                species.default_photo.square_url ||
                species.default_photo.url?.replace("square", "medium") ||
                species.default_photo.url
              }
              alt={species.common_name || species.scientific_name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Si medium_url falla, intentar con square_url o url original
                const target = e.currentTarget;
                const fallback = species.default_photo?.square_url || species.default_photo?.url;
                if (fallback && target.src !== fallback) {
                  target.src = fallback;
                } else {
                  target.style.display = 'none';
                  target.parentElement?.classList.add('photo-error');
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-forest-300 bg-forest-50/50">
              <Leaf className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-xs">Sin imagen</span>
            </div>
          )}

          {/* Establishment Badge (Top Left) */}
          {establishment && (
            <div className={`absolute top-2 left-2 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1 ${establishment.className}`}>
              {establishment.icon}
              {establishment.label}
            </div>
          )}

          {/* Conservation Status Badge (Top Right) */}
          {conservation && (
            <div className={`absolute top-2 right-2 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${conservation.className}`}>
              {conservation.label}
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-forest-950 text-lg mb-1 line-clamp-2 leading-tight group-hover:text-lime-700 transition-colors">
            {species.common_name || species.scientific_name}
          </h3>
          {/* Changed typography: removed font-serif, kept italic */}
          <p className="text-forest-600/80 text-sm italic mb-3 line-clamp-1">{species.scientific_name}</p>

          <div className="flex-grow"></div>
          {typeof species.occurrence_count === 'number' && (
            <p className="mt-3 text-xs font-medium text-forest-600">
              {species.occurrence_count.toLocaleString('es-CO')} {species.occurrence_count === 1 ? 'registro' : 'registros'} en GBIF
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

// Update SkeletonCard
const SkeletonCard = () => (
  <Card className="overflow-hidden h-full border-lime-100/50 bg-white">
    <div className="h-52 min-[430px]:h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="pt-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  </Card>
);

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const queryClient = useQueryClient();

  // La ubicación se conserva por 24 horas y puede eliminarse desde la interfaz.
  const [storedLocation] = useState(readStoredLocation);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(storedLocation?.coords ?? null);
  const [locationName, setLocationName] = useState<string | null>(storedLocation?.name ?? null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Derive state from URL
  const paramPage = parseInt(searchParams.get("page") || "1");
  const page = isNaN(paramPage) || paramPage < 1 ? 1 : paramPage;
  const currentPage = page;
  const q = searchParams.get("q") || "";
  const selectedGroup = searchParams.get("iconic_taxa") || "";
  // DEBUG: console.log('🔍 DEBUG selectedGroup:', selectedGroup, 'from URL param:', searchParams.get("iconic_taxa"));
  const selectedConservationStatus = searchParams.get("threatened") === "true" ? "threatened" : "Todos";
  const nativeFilter = searchParams.get("native") === "true" ? "native" : (searchParams.get("endemic") === "true" ? "endemic" : "all");
  const sortBy = searchParams.get("order_by") || (userLocation ? "occurrence_count" : "random");
  const radiusOptions = [10, 25, 50, 100];
  const requestedRadius = Number(searchParams.get("radius") || 25);
  const radius = radiusOptions.includes(requestedRadius) ? requestedRadius : 25;
  const randomSeed = searchParams.get("random_seed") || (!userLocation ? `national-${new Date().toISOString().slice(0, 10)}` : undefined);

  // Local search input
  const [searchTerm, setSearchTerm] = useState(q);
  const [debouncedSearch, setDebouncedSearch] = useState(q);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== q) {
        const nextParams = new URLSearchParams(searchParams);
        if (searchTerm.trim()) nextParams.set("q", searchTerm.trim());
        else nextParams.delete("q");
        nextParams.set("page", "1");
        setSearchParams(nextParams);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [q, searchParams, searchTerm, setSearchParams]);

  const updateParams = (newParams: Record<string, any>) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clear dependent filters
    if (newParams.native === 'all') { delete merged.native; delete merged.endemic; }
    if (newParams.native === 'native') { merged.native = 'true'; delete merged.endemic; }
    if (newParams.native === 'endemic') { merged.endemic = 'true'; delete merged.native; }
    if (newParams.threatened === 'Todos') { delete merged.threatened; }
    if (newParams.threatened === 'threatened') { merged.threatened = 'true'; }

    // Handle taxon_id clearing
    if (newParams.taxon_id === undefined || newParams.taxon_id === null) {
      delete merged.taxon_id;
    }

    // Clean up old params if they exist
    // delete merged.iconic_taxa;  // REMOVED: This was preventing radio buttons from working
    // delete merged.rank;

    Object.keys(merged).forEach(key => {
      if (merged[key] === '' || merged[key] === undefined || merged[key] === null) delete merged[key];
    });

    setSearchParams(merged);
  };

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = { lat: latitude, lng: longitude };
        setUserLocation(locationData);
        persistLocation(locationData, 'Tu ubicación');

        try {
          // Reverse geocoding to get place name
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await response.json();
          const address = data.address;
          // Prioritize: city -> town -> village -> county -> state
          const name = address.city || address.town || address.village || address.municipality || address.county || address.state || "Tu ubicación";
          setLocationName(name);
          persistLocation(locationData, name);
        } catch (error) {
          console.error("Error getting location name:", error);
          setLocationName("Tu ubicación");
          persistLocation(locationData, "Tu ubicación");
        }

        setIsLocating(false);
        // Force update to use new location
        updateParams({ page: 1 });
      },
      (error) => {
        console.error(error);
        setLocationError("No se pudo obtener tu ubicación. Verifica los permisos.");
        setIsLocating(false);
        // Do not clear userLocation here, maybe strict permissions caused failure but user wanted to keep old one? 
        // Better to not clear unless explicit.
      }
    );
  };

  const clearLocation = () => {
    setUserLocation(null);
    setLocationName(null);
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    setLocationError(null);
  };

  const [mapModalOpen, setMapModalOpen] = useState(false);

  const handleMapConfirm = (coords: { lat: number; lng: number; address?: string }) => {
    const locationData = { lat: coords.lat, lng: coords.lng };
    setUserLocation(locationData);

    const name = coords.address ? coords.address.split(',').slice(0, 2).join(',') : 'Ubicación seleccionada';
    setLocationName(name);
    persistLocation(locationData, name);
    setLocationError(null);

    updateParams({ page: 1 });
  };

  const ITEMS_PER_PAGE = 25;

  // DEBUG: console.log('📤 Params being sent to useSpecies:', { iconic_taxa: selectedGroup, selectedGroup });

  const { data, isLoading, isError, error, isFetching } = useSpecies({
    page,
    per_page: ITEMS_PER_PAGE,
    q: debouncedSearch,
    iconic_taxa: selectedGroup || undefined,
    native: nativeFilter === 'native',
    endemic: nativeFilter === 'endemic',
    threatened: selectedConservationStatus === 'threatened',
    order_by: sortBy,
    random_seed: randomSeed,
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    radius
  });

  const speciesList = data?.data || [];
  const pagination = data?.meta?.pagination || data?.pagination || { total: 0, last_page: 1, current_page: 1 };
  const totalPages = pagination.last_page;
  const occurrenceTotal = data?.meta?.occurrence_total || 0;
  const catalogTruncated = data?.meta?.catalog_truncated || false;
  const errorMessage = error instanceof Error ? error.message : "No fue posible consultar las especies. Intenta nuevamente.";

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const clearAllFilters = () => {
    setSearchTerm("");
    clearLocation();
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Header Title Logic
  const getHeaderTitle = () => {
    if (userLocation) return "Especies observadas cerca de ti";
    return "Especies de Colombia";
  };

  // Determines if we should show skeleton loading
  // FIX: Only show full skeleton on initial load (isLoading). 
  // Ignore isFetching to avoid layout thrashing when returning from cache.
  const showLoading = isLoading;

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-screen">

      {/* Header & Location Control */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 min-w-0">
        <div className="min-w-0">
          <Badge variant="outline" className="mb-2 max-w-full border-lime-500 text-lime-700 bg-lime-50">
            {userLocation ? (
              <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" /> {locationName || "Área seleccionada"} · {radius} km</span>
            ) : "Catálogo Nacional"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2 leading-tight">
            {userLocation ? "Biodiversidad documentada cerca de ti" : getHeaderTitle()}
          </h1>
          <p className="text-forest-700/80 text-base md:text-lg max-w-3xl">
            {userLocation
              ? `Especies con registros documentados dentro de ${radius} km de ${locationName || "la ubicación seleccionada"}.`
              : "Especies documentadas en Colombia a partir de registros de GBIF, enriquecidas con información de iNaturalist."}
          </p>
        </div>

        <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
            {!userLocation ? (
              <Button onClick={requestLocation} disabled={isLocating} className="bg-lime-600 hover:bg-lime-700 text-white gap-2 shadow-lg shadow-lime-200/50 w-full sm:w-auto">
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                Mi ubicación
              </Button>
            ) : (
              <Button variant="outline" onClick={clearLocation} className="text-red-600 border-red-200 hover:bg-red-50 gap-2 w-full sm:w-auto">
                <X className="h-4 w-4" /> Dejar de usar ubicación
              </Button>
            )}
            <Button variant="outline" onClick={() => setMapModalOpen(true)} className="border-lime-300 text-lime-700 hover:bg-lime-50 gap-2 w-full sm:w-auto">
              <Globe className="h-4 w-4" />
              Elegir en el mapa
            </Button>
            {userLocation && (
              <label className="flex items-center justify-between gap-2 rounded-md border border-lime-200 bg-white px-3 h-10 text-sm text-forest-700">
                <span>Radio</span>
                <select
                  aria-label="Radio de búsqueda"
                  value={radius}
                  onChange={(event) => updateParams({ radius: Number(event.target.value), page: 1 })}
                  className="bg-transparent font-semibold text-lime-700 outline-none"
                >
                  {radiusOptions.map((option) => <option key={option} value={option}>{option} km</option>)}
                </select>
              </label>
            )}
          </div>
          {locationError && <span className="text-xs text-red-500">{locationError}</span>}
        </div>
      </div>

      {/* Main Controls */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-lime-100 flex flex-col gap-4">
        {/* Search row - with filter button inline */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar especie..."
              className="pl-10 bg-white/50 border-lime-200 focus:border-lime-500 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3 text-forest-400" />
              </button>
            )}
          </div>

          {/* Filter Button - Inline with search */}
          <Button
            variant="outline"
            size="icon"
            className={`border-lime-200 rounded-xl h-10 w-10 flex-shrink-0 ${filtersVisible ? 'bg-lime-50 text-lime-700 border-lime-500' : ''}`}
            onClick={toggleFilters}
            aria-label="Filtros"
          >
            <Filter className="h-4 w-4" />
          </Button>
          {isFetching && !isLoading && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-forest-500" role="status">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Actualizando
            </span>
          )}
        </div>

        {/* Expanded Filters - With Close Button */}
        {filtersVisible && (
          <div className="relative p-4 bg-lime-50/50 rounded-xl border border-lime-100 animate-in slide-in-from-top-2">
            {/* Close button - positioned top right */}
            <button
              onClick={() => setFiltersVisible(false)}
              className="absolute top-2 right-2 p-1.5 hover:bg-lime-200/50 rounded-lg transition-colors"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5 text-lime-700" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              <div>
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest mb-3">Grupo</h4>
                <div className="flex flex-col gap-1">
                  {groups.map(group => (
                    <label key={group.value || 'all'} className="flex items-center gap-2 text-sm text-forest-700 cursor-pointer hover:text-forest-900">
                      <input
                        type="radio"
                        name="group"
                        checked={selectedGroup === group.value}
                        onChange={() => updateParams({ iconic_taxa: group.value || undefined, page: 1 })}
                        className="accent-lime-600"
                      />
                      {group.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest mb-3">Estado</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedConservationStatus === 'threatened' ? 'destructive' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => updateParams({ threatened: selectedConservationStatus === 'threatened' ? 'Todos' : 'threatened', page: 1 })}
                  >
                    <ShieldAlert className="h-3 w-3 mr-2" />
                    Solo Amenazadas
                  </Button>
                  <Button
                    variant={nativeFilter === 'endemic' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => updateParams({ native: nativeFilter === 'endemic' ? 'all' : 'endemic', page: 1 })}
                  >
                    <Sparkles className="h-3 w-3 mr-2" />
                    Solo Endémicas
                  </Button>
                  <Button
                    variant={nativeFilter === 'native' ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => updateParams({ native: nativeFilter === 'native' ? 'all' : 'native', page: 1 })}
                  >
                    <Star className="h-3 w-3 mr-2" />
                    Solo Nativas
                  </Button>
                </div>
              </div>

              {/* Sort buttons moved inside filters */}
              <div className="lg:col-span-2">
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest mb-3">Ordenar por</h4>
                <div className="flex gap-2">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-all whitespace-nowrap ${sortBy !== 'random' ? 'bg-white shadow text-lime-700' : 'text-gray-500 hover:text-gray-900'}`}
                      onClick={() => updateParams({ order_by: 'observed_on', page: 1 })}
                    >
                      <ListOrdered className="h-3.5 w-3.5" /> Predeterminada
                    </button>
                    <button
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ['species'] });
                        updateParams({ order_by: 'random', random_seed: String(Date.now()), page: 1 });
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-all whitespace-nowrap ${sortBy === 'random' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      <Shuffle className="h-3.5 w-3.5" /> Aleatorio
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-full flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    clearAllFilters();
                    setFiltersVisible(false);
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {data?.meta && !showLoading && !isError && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-lime-100 bg-lime-50/60 px-4 py-3 text-sm text-forest-700" role="status">
          <span>
            <strong>{pagination.total.toLocaleString('es-CO')}</strong> especies documentadas
            {occurrenceTotal > 0 && <> a partir de <strong>{occurrenceTotal.toLocaleString('es-CO')}</strong> registros de GBIF</>}.
          </span>
          {catalogTruncated && <span className="text-amber-700">Resultado parcial: aplica filtros{userLocation ? " o reduce el radio" : " para acotar el catálogo"}.</span>}
        </div>
      )}

      {/* Grid */}
      <div>
        {showLoading ? (
          <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : speciesList.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No se encontraron especies con estos filtros.</p>
            <Button variant="link" onClick={clearAllFilters}>Limpiar filtros</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {speciesList.map((species: Taxon, index: number) => (
                <SpeciesCard key={`${species.id}-${index}`} species={species} />
              ))}
            </div>

            {/* Pagination - Simple Reverted */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <span className="text-sm text-gray-500 px-2 sm:px-4 whitespace-nowrap">
                  Página {currentPage} de {totalPages}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <LocationMapModal
        open={mapModalOpen}
        onOpenChange={setMapModalOpen}
        initialLat={userLocation?.lat}
        initialLng={userLocation?.lng}
        initialLocationName={locationName || ''}
        onConfirm={handleMapConfirm}
      />
    </div>
  );
}