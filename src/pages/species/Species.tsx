import { useState, FC, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSpecies } from "@/hooks/useSpecies";
import { Taxon } from "@/types/api";

// ... (SpeciesCard component stays same, omitted here for brevity if I could, but need to be precise)
// I will keep SpeciesCard as is in my mind, but since I am replacing the top part, I need to assume imports are at the top.
// Wait, replace_file_content replaces a block.
// I will target the imports down to the 'const Species = ...'

const getConservationStatusColor = (status: string) => {
  switch (status) {
    case "Least Concern":
      return "bg-green-500";
    case "Near Threatened":
      return "bg-yellow-500";
    case "Vulnerable":
      return "bg-orange-500";
    case "Endangered":
      return "bg-red-500";
    case "Critically Endangered":
      return "bg-red-700";
    default:
      return "bg-gray-500";
  }
};

const SpeciesCard: FC<{ species: Taxon }> = ({ species }) => {
  const imageUrl = species.default_photo?.url || 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=600&h=400';

  return (
    <Link to={`/species/${species.id}`}>
      <Card className="overflow-hidden card-hover h-full">
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={species.common_name || species.scientific_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=600&h=400';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-forest-900 text-lg mb-1">
            {species.common_name || species.scientific_name}
          </h3>
          <p className="text-forest-700 text-sm italic">
            {species.scientific_name}
          </p>
          {species.establishment_status_colombia && (
            <Badge variant="outline" className={`mt-2 ${species.is_native ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'}`}>
              {species.establishment_status_colombia}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
};

const Species = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Derive state from URL
  const page = parseInt(searchParams.get("page") || "1");
  const q = searchParams.get("q") || "";
  const stateProvince = searchParams.get("stateProvince") || "";
  const municipality = searchParams.get("municipality") || "";

  // Local state for inputs (to allow typing without instant URL sync if desired, but for simplicity sync on change/debounce)
  // Actually, for filters like Dept/Muni, 'onBlur' or 'Enter' is better, or debounce.
  // For 'q' we already have logic to debounce? 
  // Let's use useSpecies directly with URL params. The hook will handle fetching.
  // BUT we need to debounce 'q' updates to the URL to avoid history spam.

  const [searchTerm, setSearchTerm] = useState(q);
  const [debouncedSearch, setDebouncedSearch] = useState(q);

  // Debounce effect for Search Term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== q) {
        updateParams({ q: searchTerm, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateParams = (newParams: Record<string, any>) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clean empty values
    Object.keys(merged).forEach(key => {
      if (!merged[key]) delete merged[key];
    });

    setSearchParams(merged);
  };

  const { data, isLoading: loading, isError, error: queryError } = useSpecies({
    page,
    per_page: 12,
    q: debouncedSearch,
    stateProvince,
    municipality
  });

  const species = data?.data || [];
  const paginationData = data?.pagination || { total: 0, per_page: 12, current_page: 1, last_page: 1 };

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter handlers
  const handleLocationFilter = (key: string, value: string) => {
    updateParams({ [key]: value, page: 1 });
  };

  const error = isError ? String(queryError) : null;
  const pagination = {
    page: paginationData.current_page,
    totalPages: paginationData.last_page
  };

  // Dummy fetchSpecies for retry button (just generic invalidation or reload)
  const fetchSpecies = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">
          Species Guide
        </h1>
        <p className="text-forest-700">Comprehensive information about bird species</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name or scientific name..."
            className="pl-10 bg-white rounded-xl border-lime-200"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => handleSearch("")}
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
          Filters
        </Button>
      </div>

      {filtersVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-lime-200 animate-slide-in-top">
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
      )}


      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold text-forest-900">
            {loading ? "Cargando..." : `${species.length} Especies Encontradas`}
          </h2>
          {pagination.totalPages > 1 && (
            <p className="text-forest-700 text-sm">
              Página {pagination.page} de {pagination.totalPages}
            </p>
          )}
        </div>

        {error ? (
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <h3 className="text-red-900 font-medium mb-2">
              Error al cargar especies
            </h3>
            <p className="text-red-700 mb-4">
              {error}
            </p>
            <Button
              variant="outline"
              className="border-red-200"
              onClick={() => fetchSpecies()}
            >
              Reintentar
            </Button>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden h-full animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : species.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {species.map((speciesItem) => (
                <SpeciesCard key={speciesItem.id} species={speciesItem} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) handlePageChange(pagination.page - 1);
                        }}
                        className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pagination.page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) handlePageChange(pagination.page + 1);
                        }}
                        className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card className="p-8 text-center border-lime-200">
            <h3 className="text-forest-900 font-medium mb-2">
              No se encontraron especies
            </h3>
            <p className="text-forest-700 mb-4">
              Intenta ajustar tu búsqueda
            </p>
            <Button
              variant="outline"
              className="border-lime-200"
              onClick={() => handleSearch("")}
            >
              Limpiar búsqueda
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Species;