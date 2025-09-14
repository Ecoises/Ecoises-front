import { useState, FC } from "react";
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

// Sample species data
const speciesData = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    family: "Thrushes",
    habitat: ["Urban", "Woodland", "Gardens"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 1247,
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    family: "Cardinals",
    habitat: ["Woodland", "Gardens", "Shrubland"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 892,
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 3,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    family: "Jays and Crows",
    habitat: ["Woodland", "Urban", "Parks"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 673,
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 4,
    name: "American Goldfinch",
    scientificName: "Spinus tristis",
    family: "Finches",
    habitat: ["Open country", "Gardens", "Meadows"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 534,
    image: "https://images.unsplash.com/photo-1591198936750-16d8e15edc9f?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 5,
    name: "Red-tailed Hawk",
    scientificName: "Buteo jamaicensis",
    family: "Hawks, Eagles, and Kites",
    habitat: ["Open country", "Woodland", "Urban"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 421,
    image: "https://images.unsplash.com/photo-1606567595334-d0781bd70527?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 6,
    name: "Great Blue Heron",
    scientificName: "Ardea herodias",
    family: "Herons and Egrets",
    habitat: ["Wetlands", "Coastal", "Lakes"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 367,
    image: "https://images.unsplash.com/photo-1517824587134-3e3b97472a2a?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 7,
    name: "Barn Swallow",
    scientificName: "Hirundo rustica",
    family: "Swallows",
    habitat: ["Open country", "Farms", "Near water"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 298,
    image: "https://images.unsplash.com/photo-1591718537660-aedd7576f401?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 8,
    name: "Eastern Bluebird",
    scientificName: "Sialia sialis",
    family: "Thrushes",
    habitat: ["Open woodland", "Farmland", "Gardens"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 189,
    image: "https://images.unsplash.com/photo-1547804270-1e15a27c8495?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 9,
    name: "Black-capped Chickadee",
    scientificName: "Poecile atricapillus",
    family: "Tits and Chickadees",
    habitat: ["Woodland", "Urban", "Gardens"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 756,
    image: "https://images.unsplash.com/photo-1613322800652-00229d479b6d?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 10,
    name: "Downy Woodpecker",
    scientificName: "Dryobates pubescens",
    family: "Woodpeckers",
    habitat: ["Woodland", "Urban", "Parks"],
    status: "Common",
    conservationStatus: "Least Concern",
    observations: 445,
    image: "https://images.unsplash.com/photo-1591570773933-f4b465bd3ee2?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 11,
    name: "Bald Eagle",
    scientificName: "Haliaeetus leucocephalus",
    family: "Hawks, Eagles, and Kites",
    habitat: ["Lakes", "Rivers", "Coastal"],
    status: "Uncommon",
    conservationStatus: "Least Concern",
    observations: 87,
    image: "https://images.unsplash.com/photo-1548090463-c4a449026f1a?auto=format&fit=crop&w=600&h=400",
  },
  {
    id: 12,
    name: "Peregrine Falcon",
    scientificName: "Falco peregrinus",
    family: "Falcons",
    habitat: ["Cliffs", "Urban", "Coastal"],
    status: "Uncommon",
    conservationStatus: "Least Concern",
    observations: 54,
    image: "https://images.unsplash.com/photo-1618602051703-bee0a42c1852?auto=format&fit=crop&w=600&h=400",
  },
];

// Filter options
const families = [...new Set(speciesData.map((s) => s.family))];
const statuses = [...new Set(speciesData.map((s) => s.status))];
const habitats = [...new Set(speciesData.flatMap((s) => s.habitat))];

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

const SpeciesCard: FC<{ species: typeof speciesData[0] }> = ({ species }) => {
  return (
    <Link to={`/species/${species.id}`}>
      <Card className="overflow-hidden card-hover h-full">
        <div className="relative h-48">
          <img
            src={species.image}
            alt={species.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-forest-900 text-lg mb-1">
            {species.name}
          </h3>
          <p className="text-forest-700 text-sm italic">
            {species.scientificName}
          </p>
        </div>
      </Card>
    </Link>
  );
};

const Species = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter species
  const filteredSpecies = speciesData.filter((species) => {
    const matchesSearch =
      species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      species.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFamily =
      selectedFamily === null || species.family === selectedFamily;
    const matchesStatus =
      selectedStatus === null || species.status === selectedStatus;
    const matchesHabitat =
      selectedHabitat === null || species.habitat.includes(selectedHabitat);

    return matchesSearch && matchesFamily && matchesStatus && matchesHabitat;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSpecies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSpecies = filteredSpecies.slice(startIndex, endIndex);

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const clearFilters = () => {
    setSelectedFamily(null);
    setSelectedStatus(null);
    setSelectedHabitat(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters or search change
  const resetPagination = () => {
    setCurrentPage(1);
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPagination();
            }}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
          Filters
        </Button>
      </div>

      {/* Filters panel */}
      {filtersVisible && (
        <Card className="p-4 border-lime-200 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-forest-900">Filter Species</h3>
            <Button
              variant="ghost"
              className="h-8 text-forest-700 hover:text-forest-900"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-forest-900 mb-2">Family</h4>
              <div className="flex flex-wrap gap-2">
                {families.map((family) => (
                  <button
                    key={family}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedFamily === family
                        ? "bg-lime-500 text-white"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => {
                      setSelectedFamily(
                        selectedFamily === family ? null : family
                      );
                      resetPagination();
                    }}
                  >
                    {family}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-forest-900 mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedStatus === status
                        ? "bg-lime-500 text-white"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => {
                      setSelectedStatus(
                        selectedStatus === status ? null : status
                      );
                      resetPagination();
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-forest-900 mb-2">Habitat</h4>
              <div className="flex flex-wrap gap-2">
                {habitats.map((habitat) => (
                  <button
                    key={habitat}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedHabitat === habitat
                        ? "bg-lime-500 text-white"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => {
                      setSelectedHabitat(
                        selectedHabitat === habitat ? null : habitat
                      );
                      resetPagination();
                    }}
                  >
                    {habitat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold text-forest-900">
            {filteredSpecies.length}{" "}
            {filteredSpecies.length === 1 ? "Species" : "Species"} Found
          </h2>
          {totalPages > 1 && (
            <p className="text-forest-700 text-sm">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </div>

        {filteredSpecies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedSpecies.map((species) => (
                <SpeciesCard key={species.id} species={species} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
              No species found
            </h3>
            <p className="text-forest-700 mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="border-lime-200"
              onClick={() => {
                setSearchTerm("");
                clearFilters();
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Species;