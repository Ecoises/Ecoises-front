import { useState } from "react";
import { 
  MapPin, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  X,
  Layers
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SimpleMap from "@/components/LeafletMap";

// Sample sighting data
const sightings = [
  {
    id: 1,
    birdName: "American Robin",
    location: "Central Park",
    coordinates: { lat: 40.785091, lng: -73.968285 },
    date: "May 5, 2023",
    time: "10:23 AM",
    observer: "You",
    category: "Thrush"
  },
  {
    id: 2,
    birdName: "Northern Cardinal",
    location: "Prospect Park",
    coordinates: { lat: 40.660204, lng: -73.969193 },
    date: "May 3, 2023",
    time: "8:15 AM",
    observer: "You",
    category: "Cardinal"
  },
  {
    id: 3,
    birdName: "Blue Jay",
    location: "Riverside Park",
    coordinates: { lat: 40.801505, lng: -73.972192 },
    date: "May 1, 2023",
    time: "9:45 AM",
    observer: "Jane Smith",
    category: "Jay"
  },
  {
    id: 4,
    birdName: "American Goldfinch",
    location: "Bryant Park",
    coordinates: { lat: 40.753597, lng: -73.983230 },
    date: "April 28, 2023",
    time: "11:20 AM",
    observer: "John Doe",
    category: "Finch"
  },
  {
    id: 5,
    birdName: "Red-tailed Hawk",
    location: "Battery Park",
    coordinates: { lat: 40.703770, lng: -74.016868 },
    date: "April 25, 2023",
    time: "2:10 PM",
    observer: "You",
    category: "Hawk"
  }
];

// Sample hotspots
const hotspots = [
  {
    id: 1,
    name: "Central Park Ramble",
    coordinates: { lat: 40.779306, lng: -73.969736 },
    birdCount: 127,
    topSpecies: ["American Robin", "Northern Cardinal", "Blue Jay"]
  },
  {
    id: 2,
    name: "Jamaica Bay Wildlife Refuge",
    coordinates: { lat: 40.616291, lng: -73.820037 },
    birdCount: 238,
    topSpecies: ["Great Egret", "Osprey", "Glossy Ibis"]
  },
  {
    id: 3,
    name: "Prospect Park",
    coordinates: { lat: 40.660204, lng: -73.969193 },
    birdCount: 98,
    topSpecies: ["Red-bellied Woodpecker", "American Goldfinch", "Yellow Warbler"]
  }
];

const SightingCard = ({ sighting }: { sighting: typeof sightings[0] }) => {
  return (
    <div className="p-3 hover:bg-lime-50 rounded-lg transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-forest-900">{sighting.birdName}</h3>
          <div className="flex items-center text-forest-700 text-sm mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{sighting.location}</span>
          </div>
        </div>
        <Badge variant="secondary" className="bg-lime-100 text-lime-800 hover:bg-lime-200">
          {sighting.category}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-forest-700">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{sighting.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{sighting.time}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{sighting.observer}</span>
        </div>
      </div>
    </div>
  );
};

const HotspotCard = ({ hotspot }: { hotspot: typeof hotspots[0] }) => {
  return (
    <div className="p-3 hover:bg-lime-50 rounded-lg transition-colors">
      <h3 className="font-medium text-forest-900">{hotspot.name}</h3>
      <div className="flex items-center text-forest-700 text-sm mt-1">
        <span>{hotspot.birdCount} species recorded</span>
      </div>
      
      <div className="mt-2">
        <p className="text-xs text-forest-700 mb-1">Top species:</p>
        <div className="flex flex-wrap gap-1">
          {hotspot.topSpecies.map((species, index) => (
            <Badge key={index} variant="outline" className="text-forest-700 border-lime-200 text-xs">
              {species}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};


const Map = () => {
  const [activeTab, setActiveTab] = useState<"sightings" | "hotspots">("sightings");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const toggleFilters = () => setFiltersVisible(!filtersVisible);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Sightings Map</h1>
        <p className="text-forest-700">Explore bird sightings and hotspots on the map</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Map */}
        <div className="lg:col-span-2">
          <Card className="border-lime-200 overflow-hidden">
            <div className="p-3 bg-lime-50 border-b border-lime-200 flex justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeTab === "sightings" 
                      ? "bg-lime-500 text-white" 
                      : "bg-white text-forest-700"
                  }`}
                  onClick={() => setActiveTab("sightings")}
                >
                  Sightings
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeTab === "hotspots" 
                      ? "bg-lime-500 text-white" 
                      : "bg-white text-forest-700"
                  }`}
                  onClick={() => setActiveTab("hotspots")}
                >
                  Hotspots
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="bg-white p-2 rounded-lg border border-lime-200"
                  onClick={toggleFilters}
                >
                  <Filter className="h-4 w-4 text-forest-700" />
                </button>
                <button className="bg-white p-2 rounded-lg border border-lime-200">
                  <Layers className="h-4 w-4 text-forest-700" />
                </button>
              </div>
            </div>
            
            {filtersVisible && (
              <div className="bg-white p-3 border-b border-lime-200 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-forest-900">Filters</h3>
                  <button onClick={toggleFilters}>
                    <X className="h-4 w-4 text-forest-700" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-forest-700">Date Range</label>
                    <select className="w-full mt-1 rounded-lg border-lime-200 text-sm">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last year</option>
                      <option>All time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-forest-700">Bird Category</label>
                    <select className="w-full mt-1 rounded-lg border-lime-200 text-sm">
                      <option>All Categories</option>
                      <option>Thrush</option>
                      <option>Cardinal</option>
                      <option>Jay</option>
                      <option>Finch</option>
                      <option>Hawk</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-forest-700">Observer</label>
                    <select className="w-full mt-1 rounded-lg border-lime-200 text-sm">
                      <option>All Observers</option>
                      <option>Your Sightings</option>
                      <option>Community Sightings</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <SimpleMap 
                sightings={sightings} 
                hotspots={hotspots} 
                activeTab={activeTab} 
              />
            </div>
          </Card>
        </div>
        
        {/* Right column: List */}
        <div className="lg:col-span-1">
          <Card className="border-lime-200 h-full">
            <div className="p-3 bg-lime-50 border-b border-lime-200">
              <h2 className="font-medium text-forest-900">
                {activeTab === "sightings" ? "Recent Sightings" : "Popular Hotspots"}
              </h2>
            </div>
            
            <div className="p-2 max-h-[500px] overflow-y-auto">
              <div className="divide-y divide-lime-100">
                {activeTab === "sightings" ? (
                  sightings.map(sighting => (
                    <SightingCard key={sighting.id} sighting={sighting} />
                  ))
                ) : (
                  hotspots.map(hotspot => (
                    <HotspotCard key={hotspot.id} hotspot={hotspot} />
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;
