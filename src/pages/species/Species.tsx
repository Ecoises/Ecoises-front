import { useState, FC, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import useSpecies from "@/hooks/useSpecies";
import { Taxon } from "@/api/services/TaxonService";



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
            alt={species.common_name || species.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=600&h=400';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-forest-900 text-lg mb-1">
            aaaa
            {species.common_name || species.name}
          </h3>
          <p className="text-forest-700 text-sm italic">
            ss
            {species.scientific_name || species.name}
          </p>
        </div>
      </Card>
    </Link>
  );
};

const Species = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { species, loading, error, pagination, fetchSpecies, searchSpecies, changePage, changePerPage } = useSpecies();
  
  // Update items per page to 6
  useEffect(() => {
    changePerPage(6);
  }, []);

  // Filter species locally based on search term
  const filteredSpecies = species.filter((speciesItem) => {
    if (!searchTerm) return true;
    const matchesSearch =
      (speciesItem.common_name || speciesItem.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (speciesItem.scientific_name || speciesItem.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const handlePageChange = (page: number) => {
    changePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      await searchSpecies(value);
    } else {
      await fetchSpecies();
    }
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