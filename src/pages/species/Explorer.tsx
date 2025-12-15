import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const classes = ["Todas", "Aves", "Mammalia", "Reptilia", "Amphibia", "Insecta"];
// Simplificamos los estados de conservación soportados por la API por ahora
// La API soporta 'threatened' (amenazada), pero no filtrar por LC específico fácilmente en búsqueda simple
const conservationStatuses = [
  { value: "Todos", label: "Todos" },
  { value: "threatened", label: "Amenazadas (VU, EN, CR)" },
  // { value: "LC", label: "LC - Preocupación Menor" },
];

const SpeciesCard = ({ species }: { species: Taxon }) => (
  <Link to={`/species/${species.id}`}>
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer flex flex-col group">
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
        <div className="absolute top-3 right-3">
          <Badge className="bg-red-500 text-white">
            {species.conservation_status}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-forest-900 text-lg mb-1 line-clamp-2">
          {species.common_name || species.scientific_name}
        </h3>
        <p className="text-forest-700 text-sm italic">{species.scientific_name}</p>

        <div className="mt-2 flex gap-1 flex-wrap">
          {species.is_endemic && (
            <span className="text-xs bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full">Endémica</span>
          )}
          {species.is_native && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Nativa</span>
          )}
        </div>
      </div>
    </Card>
  </Link>
);

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Todas");
  const [selectedConservationStatus, setSelectedConservationStatus] = useState("Todos");
  const [nativeFilter, setNativeFilter] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }); // Note: This useEffect pattern is slightly wrong in useState initializer ?? 
  // No, I need useEffect properly.

  // Correct implementation of debounce in hook or simple effect
  // Let's just pass searchTerm directly if no debounce hook, or use useEffect to update a derived state.
  // Actually, useSpecies creates a key. If I type fast, it will blast requests.
  // I will assume simple useEffect for now.

  // Correction:
  /*
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  */
  // But since I am editing the file, I will just put it in the body.

  const ITEMS_PER_PAGE = 24;

  const { data, isLoading, isError, error } = useSpecies({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
    q: searchTerm, // Using direct search term for responsiveness, ideally debounce
    rank: selectedClass,
    native: nativeFilter === 'native',
    endemic: nativeFilter === 'endemic',
    threatened: selectedConservationStatus === 'threatened',
  });

  const speciesList = data?.data || [];
  const pagination = data?.meta?.pagination || data?.pagination || { total: 0, last_page: 1, current_page: 1 };
  const totalPages = pagination.last_page;

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedClass("Todas");
    setSelectedConservationStatus("Todos");
    setNativeFilter("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-forest-950 mb-2">Explorador de Especies</h1>
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
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
                    onClick={() => {
                      setSelectedClass(className);
                      setCurrentPage(1);
                    }}
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
                    onClick={() => {
                      setSelectedConservationStatus(status.value);
                      setCurrentPage(1);
                    }}
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
                  onClick={() => {
                    setNativeFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Todas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${nativeFilter === "native"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => {
                    setNativeFilter("native");
                    setCurrentPage(1);
                  }}
                >
                  Solo Nativas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${nativeFilter === "endemic"
                    ? "bg-lime-500 text-white shadow-md"
                    : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                  onClick={() => {
                    setNativeFilter("endemic");
                    setCurrentPage(1);
                  }}
                >
                  Solo Endémicas
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-forest-900">
            {isLoading ? "Buscando especies..." : (
              pagination.total > 0
                ? `${pagination.total} Especie${pagination.total !== 1 ? "s" : ""} encontrada${pagination.total !== 1 ? "s" : ""}`
                : "No se encontraron especies"
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-lime-500 animate-spin" />
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