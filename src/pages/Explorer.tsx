import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Sample bird data
const birds = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=600&h=400",
    category: "Thrush",
    habitat: "Urban, Woodland"
  },
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&h=400",
    category: "Cardinal",
    habitat: "Woodland, Gardens"
  },
  {
    id: 3,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&h=400",
    category: "Jay",
    habitat: "Woodland, Urban"
  },
  {
    id: 4,
    name: "American Goldfinch",
    scientificName: "Spinus tristis",
    image: "https://images.unsplash.com/photo-1591198936750-16d8e15edc9f?auto=format&fit=crop&w=600&h=400",
    category: "Finch",
    habitat: "Open country, Gardens"
  },
  {
    id: 5,
    name: "Red-tailed Hawk",
    scientificName: "Buteo jamaicensis",
    image: "https://images.unsplash.com/photo-1606567595334-d0781bd70527?auto=format&fit=crop&w=600&h=400",
    category: "Hawk",
    habitat: "Open country, Woodland"
  },
  {
    id: 6,
    name: "Great Blue Heron",
    scientificName: "Ardea herodias",
    image: "https://images.unsplash.com/photo-1517824587134-3e3b97472a2a?auto=format&fit=crop&w=600&h=400",
    category: "Heron",
    habitat: "Wetlands, Coastal"
  },
  {
    id: 7,
    name: "Barn Swallow",
    scientificName: "Hirundo rustica",
    image: "https://images.unsplash.com/photo-1591718537660-aedd7576f401?auto=format&fit=crop&w=600&h=400",
    category: "Swallow",
    habitat: "Open country, Farms"
  },
  {
    id: 8,
    name: "Eastern Bluebird",
    scientificName: "Sialia sialis",
    image: "https://images.unsplash.com/photo-1547804270-1e15a27c8495?auto=format&fit=crop&w=600&h=400",
    category: "Thrush",
    habitat: "Open woodland, Farmland"
  }
];

// Categories for filters
const categories = ["All", "Thrush", "Cardinal", "Jay", "Finch", "Hawk", "Heron", "Swallow"];
const habitats = ["All", "Urban", "Woodland", "Gardens", "Open country", "Wetlands", "Coastal", "Farms", "Farmland"];

const BirdCard = ({ bird }: { bird: typeof birds[0] }) => (
  <Link to={`/species/${bird.id}`}>
    <Card className="overflow-hidden card-hover h-full">
      <div className="relative h-48">
        <img 
          src={bird.image} 
          alt={bird.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-forest-900 text-lg">{bird.name}</h3>
        <p className="text-forest-700 text-sm italic mb-2">{bird.scientificName}</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded-full">{bird.category}</span>
          <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded-full">{bird.habitat}</span>
        </div>
      </div>
    </Card>
  </Link>
);

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedHabitat, setSelectedHabitat] = useState("All");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter birds based on search and filters
  const filteredBirds = birds.filter(bird => {
    const matchesSearch = 
      bird.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bird.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || bird.category === selectedCategory;
    const matchesHabitat = selectedHabitat === "All" || bird.habitat.includes(selectedHabitat);
    
    return matchesSearch && matchesCategory && matchesHabitat;
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Bird Explorer</h1>
        <p className="text-forest-700">Discover and learn about various bird species</p>
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-forest-900 mb-2">Bird Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? "bg-lime-500 text-white"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-forest-900 mb-2">Habitat</h3>
              <div className="flex flex-wrap gap-2">
                {habitats.map(habitat => (
                  <button
                    key={habitat}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedHabitat === habitat
                        ? "bg-lime-500 text-white"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => setSelectedHabitat(habitat)}
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
            {filteredBirds.length} {filteredBirds.length === 1 ? "Bird" : "Birds"} Found
          </h2>
        </div>
        
        {filteredBirds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBirds.map(bird => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-lime-200">
            <h3 className="text-forest-900 font-medium mb-2">No birds found</h3>
            <p className="text-forest-700 mb-4">Try adjusting your search or filters</p>
            <Button 
              variant="outline" 
              className="border-lime-200"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedHabitat("All");
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

export default Explorer;
