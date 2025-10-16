import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sample data - estructura compatible con API
const data = [
  {
    id: 1,
    scientific_name: "Malacoptila mystacalis",
    common_name: "buco bigotudo",
    class: "Aves",
    family: "Bucconidae",
    order_name: "Galbuliformes",
    conservation_status: "NE",
    is_native: true,
    is_endemic: false,
    observation_count: 398,
    default_photo: {
      medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/240419745/medium.jpg",
      attribution: "(c) Oswaldo Hernández, some rights reserved (CC BY-NC)"
    }
  },
  {
    id: 2,
    scientific_name: "Panthera onca",
    common_name: "jaguar",
    class: "Mammalia",
    family: "Felidae",
    order_name: "Carnivora",
    conservation_status: "NT",
    is_native: true,
    is_endemic: false,
    observation_count: 156,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 3,
    scientific_name: "Cardinalis cardinalis",
    common_name: "cardenal norteño",
    class: "Aves",
    family: "Cardinalidae",
    order_name: "Passeriformes",
    conservation_status: "LC",
    is_native: false,
    is_endemic: false,
    observation_count: 890,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 4,
    scientific_name: "Tapirus bairdii",
    common_name: "tapir centroamericano",
    class: "Mammalia",
    family: "Tapiridae",
    order_name: "Perissodactyla",
    conservation_status: "EN",
    is_native: true,
    is_endemic: false,
    observation_count: 89,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 5,
    scientific_name: "Pharomachrus mocinno",
    common_name: "quetzal mesoamericano",
    class: "Aves",
    family: "Trogonidae",
    order_name: "Trogoniformes",
    conservation_status: "NT",
    is_native: true,
    is_endemic: true,
    observation_count: 234,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1547804270-1e15a27c8495?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 6,
    scientific_name: "Buteo jamaicensis",
    common_name: "gavilán colirrojo",
    class: "Aves",
    family: "Accipitridae",
    order_name: "Accipitriformes",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,
    observation_count: 1120,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1606567595334-d0781bd70527?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 7,
    scientific_name: "Alouatta palliata",
    common_name: "mono aullador de manto",
    class: "Mammalia",
    family: "Atelidae",
    order_name: "Primates",
    conservation_status: "VU",
    is_native: true,
    is_endemic: false,
    observation_count: 267,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 8,
    scientific_name: "Ardea herodias",
    common_name: "garza azul",
    class: "Aves",
    family: "Ardeidae",
    order_name: "Pelecaniformes",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,
    observation_count: 980,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1517824587134-3e3b97472a2a?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 9,
    scientific_name: "Odocoileus virginianus",
    common_name: "venado cola blanca",
    class: "Mammalia",
    family: "Cervidae",
    order_name: "Artiodactyla",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,
    observation_count: 543,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  },
  {
    id: 10,
    scientific_name: "Iguana iguana",
    common_name: "iguana verde",
    class: "Reptilia",
    family: "Iguanidae",
    order_name: "Squamata",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,
    observation_count: 712,
    default_photo: {
      medium_url: "https://images.unsplash.com/photo-1562948994-f8ec258a2a5f?auto=format&fit=crop&w=600&h=400",
      attribution: "Unsplash"
    }
  }
];

const classes = ["Todas", "Aves", "Mammalia", "Reptilia", "Amphibia", "Insecta"];
const conservationStatuses = [
  { value: "Todos", label: "Todos" },
  { value: "LC", label: "LC - Preocupación Menor" },
  { value: "NT", label: "NT - Casi Amenazado" },
  { value: "VU", label: "VU - Vulnerable" },
  { value: "EN", label: "EN - En Peligro" },
  { value: "CR", label: "CR - En Peligro Crítico" },
  { value: "NE", label: "NE - No Evaluado" },
  { value: "DD", label: "DD - Datos Insuficientes" }
];

const SpeciesCard = ({ species }: { species: typeof data[0] }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer">
    <div className="relative h-48">
      <img 
        src={species.default_photo.medium_url} 
        alt={species.common_name} 
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-forest-900 text-lg mb-1">{species.common_name}</h3>
      <p className="text-forest-700 text-sm italic">{species.scientific_name}</p>
    </div>
  </Card>
);

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Todas");
  const [selectedConservationStatus, setSelectedConservationStatus] = useState("Todos");
  const [nativeFilter, setNativeFilter] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const filteredData = data.filter(species => {
    const matchesSearch = 
      species.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      species.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      species.family.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === "Todas" || species.class === selectedClass;
    const matchesConservationStatus = selectedConservationStatus === "Todos" || species.conservation_status === selectedConservationStatus;
    
    let matchesNativeFilter = true;
    if (nativeFilter === "native") {
      matchesNativeFilter = species.is_native;
    } else if (nativeFilter === "endemic") {
      matchesNativeFilter = species.is_endemic;
    }
    
    return matchesSearch && matchesClass && matchesConservationStatus && matchesNativeFilter;
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);
  
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedClass("Todas");
    setSelectedConservationStatus("Todos");
    setNativeFilter("all");
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
            placeholder="Buscar por nombre común, científico o familia..."
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
            <div>
              <h3 className="font-semibold text-forest-900 mb-3 text-lg">Categoría</h3>
              <div className="flex flex-wrap gap-2">
                {classes.map(className => (
                  <button
                    key={className}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedClass === className
                        ? "bg-lime-500 text-white shadow-md"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => setSelectedClass(className)}
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedConservationStatus === status.value
                        ? "bg-lime-500 text-white shadow-md"
                        : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                    }`}
                    onClick={() => setSelectedConservationStatus(status.value)}
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    nativeFilter === "all"
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                  }`}
                  onClick={() => setNativeFilter("all")}
                >
                  Todas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    nativeFilter === "native"
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                  }`}
                  onClick={() => setNativeFilter("native")}
                >
                  Solo Nativas
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    nativeFilter === "endemic"
                      ? "bg-lime-500 text-white shadow-md"
                      : "bg-lime-50 text-forest-700 hover:bg-lime-100"
                  }`}
                  onClick={() => setNativeFilter("endemic")}
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
            {filteredData.length} {filteredData.length === 1 ? "Especie encontrada" : "Especies encontradas"}
          </h2>
        </div>
        
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(species => (
              <SpeciesCard key={species.id} species={species} />
            ))}
          </div>
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