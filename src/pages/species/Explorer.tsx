import { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Search, Filter, X, Loader2, Pin, ShieldX, Music, MapPin, Star, Sparkles, Shuffle, Trophy } from "lucide-react";
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

const classes = ["Todas", "Aves", "Mammalia", "Reptilia", "Amphibia", "Insecta"];
const conservationStatuses = [
  { value: "Todos", label: "Todos" },
  { value: "threatened", label: "Amenazadas (VU, EN, CR)" },
];

const SpeciesCard = ({ species }: { species: Taxon }) => {
  // Configuración de estado de conservación (Misma lógica que SpeciesDetail)
  const getConservationConfig = (s: string | null | undefined | { status: string }) => {
    if (!s) return null;
    let status = typeof s === 'object' && s !== null ? s.status : s;
    status = String(status).toUpperCase();

    switch (status) {
      case 'EX': return { label: 'EX', className: 'bg-gray-900 text-white' };
      case 'EW': return { label: 'EW', className: 'bg-purple-100 text-purple-800' };
      case 'CR': return { label: 'CR', className: 'bg-red-100 text-red-800' };
      case 'EN': return { label: 'EN', className: 'bg-orange-100 text-orange-800' };
      case 'VU': return { label: 'VU', className: 'bg-yellow-100 text-yellow-800' };
      case 'NT': return { label: 'NT', className: 'bg-lime-100 text-lime-800' };
      case 'LC': return { label: 'LC', className: 'bg-green-100 text-green-800' };
      case 'DD': return { label: 'DD', className: 'bg-gray-100 text-gray-800' };
      case 'NE': return null; // No mostrar si es NE
      default: return null;
    }
  };

  // Configuración de estado de establecimiento
  const getEstablishmentConfig = () => {
    if (species.is_endemic) {
      return {
        icon: <Sparkles className="h-3.5 w-3.5" />,
        className: "bg-lime-800 text-white",
        label: "Endémica"
      };
    }
    if (species.is_native) {
      return {
        icon: <Star className="h-3.5 w-3.5" />,
        className: "bg-lime-300 text-forest-900",
        label: "Nativa"
      };
    }
    return null;
  };

  const conservationConfig = getConservationConfig(species.conservation_status) || getConservationConfig((species as any).conservation_status_details);
  const establishmentConfig = getEstablishmentConfig();

  const location = useLocation();

  return (
    <Link to={`/species/${species.id}`} state={{ from: location }} className="w-full block h-full">
      <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer flex flex-col group">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {species.default_photo?.url ? (
            <img
              src={species.default_photo.url.replace("square", "medium")}
              alt={species.common_name || species.scientific_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image
            </div>
          )}

          {/* Badge: Estado de Conservación (Top Right) */}
          {conservationConfig && (
            <div className="absolute top-2 right-2">
              <Badge className={`${conservationConfig.className} border-0 shadow-sm`}>
                {conservationConfig.label}
              </Badge>
            </div>
          )}

          {/* Badge: Establecimiento (Top Left) */}
          {establishmentConfig && (
            <div className="absolute top-2 left-2">
              <Badge className={`${establishmentConfig.className} border-0 shadow-sm gap-1 pl-2 pr-2.5`}>
                {establishmentConfig.icon}
                <span>{establishmentConfig.label}</span>
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-forest-900 text-lg mb-1 line-clamp-2">
            {species.common_name || species.scientific_name}
          </h3>
          <p className="text-forest-700 text-sm italic">{species.scientific_name}</p>
        </div>
      </Card>
    </Link>
  );
};

// Skeleton Card Component for loading state
const SkeletonCard = () => (
  <Card className="overflow-hidden h-full animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </Card>
);

export default function Explorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const queryClient = useQueryClient();

  // Derive state from URL
  const page = parseInt(searchParams.get("page") || "1");
  const currentPage = page; // Alias for backward compatibility with existing JSX
  const q = searchParams.get("q") || "";
  const selectedClass = searchParams.get("rank") || "Todas";
  const selectedConservationStatus = searchParams.get("threatened") === "true" ? "threatened" : "Todos";
  const nativeFilter = searchParams.get("native") === "true" ? "native" : (searchParams.get("endemic") === "true" ? "endemic" : "all");
  const sortBy = searchParams.get("order_by") || "observations_count";
  const stateProvince = searchParams.get("stateProvince") || "";
  const municipality = searchParams.get("municipality") || "";

  // Local state for inputs (debouncing)
  const [searchTerm, setSearchTerm] = useState(q);
  const [debouncedSearch, setDebouncedSearch] = useState(q);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== q) {
        updateParams({ q: searchTerm, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const updateParams = (newParams: Record<string, any>) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Logic to handle specific filters clearing others if needed
    if (newParams.native === 'all') { delete merged.native; delete merged.endemic; }
    if (newParams.native === 'native') { merged.native = 'true'; delete merged.endemic; }
    if (newParams.native === 'endemic') { merged.endemic = 'true'; delete merged.native; }

    if (newParams.threatened === 'Todos') { delete merged.threatened; }
    if (newParams.threatened === 'threatened') { merged.threatened = 'true'; }

    if (newParams.rank === 'Todas') { delete merged.rank; }

    // Clean empty values
    Object.keys(merged).forEach(key => {
      if (merged[key] === '' || merged[key] === undefined || merged[key] === null) delete merged[key];
    });

    setSearchParams(merged);
  };

  // Filter handlers
  const handleLocationFilter = (key: string, value: string) => {
    updateParams({ [key]: value, page: 1 });
  };

  const ITEMS_PER_PAGE = 24;

  const { data, isLoading, isError, error, isFetching } = useSpecies({
    page,
    per_page: ITEMS_PER_PAGE,
    q: debouncedSearch,
    rank: selectedClass !== "Todas" ? selectedClass : undefined,
    native: nativeFilter === 'native',
    endemic: nativeFilter === 'endemic',
    threatened: selectedConservationStatus === 'threatened',
    order_by: sortBy,
    stateProvince,
    municipality
  });

  const speciesList = data?.data || [];
  const pagination = data?.meta?.pagination || data?.pagination || { total: 0, last_page: 1, current_page: 1 };
  const totalPages = pagination.last_page;

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSearchParams({}); // Clear all params to default
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-forest-950 mb-2">Explorador de Especies</h1>
        <p className="text-forest-700 text-lg">Descubre la biodiversidad de Colombia</p>
      </div>


      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por nombre común, científico..."
            className="pl-10 bg-white rounded-xl border-lime-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-forest-500" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          className="md:w-auto border-lime-200 gap-2 rounded-xl"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {filtersVisible && (
        <Card className="p-6 border-lime-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Filters */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-2">
              <div>
                <label className="text-sm font-medium text-forest-700 mb-1 block">Departamento / Estado</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                  <Input
                    placeholder="Ej: Antioquia"
                    defaultValue={stateProvince}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationFilter('stateProvince', (e.target as HTMLInputElement).value)}
                    onBlur={(e) => handleLocationFilter('stateProvince', e.target.value)}
                    className="pl-9 border-lime-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-forest-700 mb-1 block">Municipio</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                  <Input
                    placeholder="Ej: Medellín"
                    defaultValue={municipality}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationFilter('municipality', (e.target as HTMLInputElement).value)}
                    onBlur={(e) => handleLocationFilter('municipality', e.target.value)}
                    className="pl-9 border-lime-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-forest-900 mb-3 text-lg">Categoría</h3>
              <div className="flex flex-wrap gap-2">
                {classes.map(className => (
                  <button
                    key={className}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedClass === className
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                      }`}
                    onClick={() => updateParams({ rank: className, page: 1 })}
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-forest-900 mb-3 text-lg">Estado de Conservación</h3>
              <div className="flex flex-wrap gap-2">
                {conservationStatuses.map(status => (
                  <button
                    key={status.value}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedConservationStatus === status.value
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                      }`}
                    onClick={() => updateParams({ threatened: status.value, page: 1 })}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-forest-900 mb-3 text-lg">Origen</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${nativeFilter === "all"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => updateParams({ native: 'all', page: 1 })}
                >
                  Todas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${nativeFilter === "native"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => updateParams({ native: 'native', page: 1 })}
                >
                  Solo Nativas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${nativeFilter === "endemic"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => updateParams({ native: 'endemic', page: 1 })}
                >
                  Solo Endémicas
                </button>
              </div>
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold text-forest-900 mb-3 text-lg">Ordenamiento</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === "observations_count"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => updateParams({ order_by: "observations_count", page: 1 })}
                >
                  <Trophy className="h-4 w-4" />
                  Más Populares
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${sortBy === "random"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['species'] });
                    updateParams({ order_by: "random", page: 1 });
                  }}
                >
                  <Shuffle className="h-4 w-4" />
                  Modo Descubrimiento
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={sortBy === 'random' ? 'default' : 'outline'}
          className={`gap-2 rounded-full ${sortBy === 'random' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['species'] });
            updateParams({ order_by: sortBy === 'random' ? 'observations_count' : 'random', page: 1 });
          }}
        >
          {sortBy === 'random' ? <Trophy className="h-4 w-4" /> : <Shuffle className="h-4 w-4" />}
          {sortBy === 'random' ? "Volver a Populares" : "Modo Descubrimiento"}
        </Button>

        <Button
          variant={nativeFilter === 'native' ? 'default' : 'outline'}
          className={`gap-2 rounded-full ${nativeFilter === 'native' ? 'bg-lime-600' : ''}`}
          onClick={() => updateParams({ native: nativeFilter === 'native' ? 'all' : 'native', page: 1 })}
        >
          <Star className="h-4 w-4" />
          {nativeFilter === 'native' ? "Todas" : "Solo Nativas"}
        </Button>

        <Button
          variant={selectedConservationStatus === 'threatened' ? 'default' : 'outline'}
          className={`gap-2 rounded-full ${selectedConservationStatus === 'threatened' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
          onClick={() => updateParams({ threatened: selectedConservationStatus === 'threatened' ? 'Todos' : 'threatened', page: 1 })}
        >
          <ShieldX className="h-4 w-4" />
          {selectedConservationStatus === 'threatened' ? "Todas" : "Amenazadas"}
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
            {isLoading ? "Buscando especies..." : (
              pagination.total > 0
                ? `${pagination.total} Especie${pagination.total !== 1 ? "s" : ""} encontrada${pagination.total !== 1 ? "s" : ""}`
                : "No se encontraron especies"
            )}
            {isFetching && !isLoading && (
              <Loader2 className="h-5 w-5 text-lime-600 animate-spin" />
            )}
          </h2>
        </div>

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <Card className="p-12 text-center border-red-200 shadow-md bg-red-50">
            <h3 className="text-red-900 font-semibold mb-2 text-xl">Error al cargar especies</h3>
            <p className="text-red-700 mb-6">{String(error)}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </Card>
        ) : speciesList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {speciesList.map(species => (
                <SpeciesCard key={species.id} species={species} />
              ))}
            </div>

            {(totalPages > 1 || (pagination.total === 0 && currentPage > 1)) && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    <div className="flex items-center">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    </div>

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center border-lime-200 shadow-md">
            <h3 className="text-forest-900 font-semibold mb-2 text-xl">No se encontraron especies</h3>
            <p className="text-forest-700 mb-6">Intenta ajustar tu búsqueda o filtros</p>
            <Button
              variant="outline"
              className="border-lime-200 hover:bg-lime-50"
              onClick={clearAllFilters}
            >
              Limpiar todos los filtros
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}