
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Search, 
  Filter,
  Camera,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Trash,
  Edit,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample sightings data
const sightingsData = [
  {
    id: 1,
    birdName: "American Robin",
    location: "Central Park",
    date: "May 5, 2023",
    time: "10:23 AM",
    note: "Spotted foraging on the ground near the pond",
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: 2,
    birdName: "Northern Cardinal",
    location: "Riverside Trail",
    date: "May 3, 2023",
    time: "8:15 AM",
    note: "Male cardinal singing on a branch",
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: 3,
    birdName: "Blue Jay",
    location: "Oakwood Garden",
    date: "May 1, 2023",
    time: "9:45 AM",
    note: "Very vocal, interacting with another jay",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: 4,
    birdName: "American Goldfinch",
    location: "Meadow Park",
    date: "April 28, 2023",
    time: "11:20 AM",
    note: "Bright yellow male feeding on thistle",
    image: "https://images.unsplash.com/photo-1591198936750-16d8e15edc9f?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: 5,
    birdName: "Red-tailed Hawk",
    location: "Highland Ridge",
    date: "April 25, 2023",
    time: "2:10 PM",
    note: "Soaring high above the ridge",
    image: "https://images.unsplash.com/photo-1606567595334-d0781bd70527?auto=format&fit=crop&w=300&h=300"
  }
];

// Monthly stats
const monthlyStats = [
  { month: "January", count: 12 },
  { month: "February", count: 18 },
  { month: "March", count: 25 },
  { month: "April", count: 43 },
  { month: "May", count: 26 },
  { month: "June", count: 0 },
  { month: "July", count: 0 },
  { month: "August", count: 0 },
  { month: "September", count: 0 },
  { month: "October", count: 0 },
  { month: "November", count: 0 },
  { month: "December", count: 0 }
];

const SightingListItem = ({ sighting }: { sighting: typeof sightingsData[0] }) => {
  return (
    <Card className="mb-4 overflow-hidden border-lime-200 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/4 h-full">
            <img 
              src={sighting.image} 
              alt={sighting.birdName} 
              className="w-full h-40 sm:h-full object-cover"
            />
          </div>
          
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading font-bold text-forest-900 text-xl">{sighting.birdName}</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-forest-700 hover:text-forest-900 hover:bg-lime-50">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-forest-700 hover:text-red-500 hover:bg-red-50">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-y-2 mb-3 text-sm text-forest-700">
              <div className="flex items-center mr-4">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{sighting.location}</span>
              </div>
              <div className="flex items-center mr-4">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{sighting.date} - {sighting.time}</span>
              </div>
            </div>
            
            {sighting.note && (
              <p className="text-forest-800 text-sm flex-1 mb-3">{sighting.note}</p>
            )}
            
            <div className="mt-auto">
              <Link to={`/species/${sighting.id}`} className="text-lime-600 hover:text-lime-700 text-sm font-medium flex items-center">
                View Species Info
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsBar = ({ month, count, max }: { month: string; count: number; max: number }) => {
  const percentage = Math.round((count / max) * 100);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-forest-900 font-medium">{month}</span>
        <span className="text-forest-700">{count} sightings</span>
      </div>
      <div className="h-2 bg-lime-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-lime-500 rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const Sightings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Filter sightings based on search term
  const filteredSightings = sightingsData.filter(sighting => 
    sighting.birdName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sighting.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort sightings
  const sortedSightings = [...filteredSightings].sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time).getTime();
    const dateB = new Date(b.date + " " + b.time).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  const maxMonthlyCount = Math.max(...monthlyStats.map(stat => stat.count));
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">My Bird Sightings</h1>
            <p className="text-forest-700">Track and manage your bird observations</p>
          </div>
          <Link to="/sightings/new">
            <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Record Sighting
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-lime-50 p-1 rounded-xl">
            <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white">List View</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-white">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="animate-fade-in mt-4">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by bird name or location..."
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
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-lime-200 gap-2 rounded-xl"
                  onClick={toggleFilters}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-lime-200 gap-2 rounded-xl"
                  onClick={toggleSortOrder}
                >
                  {sortOrder === "newest" ? (
                    <>
                      <ArrowDown className="h-4 w-4" />
                      Newest
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-4 w-4" />
                      Oldest
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {filtersVisible && (
              <Card className="p-4 border-lime-200 mb-4 animate-fade-in">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-forest-900">Filters</h3>
                  <button onClick={toggleFilters}>
                    <X className="h-4 w-4 text-forest-700" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-forest-700 mb-1 block">Date Range</label>
                    <select className="w-full rounded-lg border-lime-200">
                      <option>All time</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>This year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-forest-700 mb-1 block">Location</label>
                    <select className="w-full rounded-lg border-lime-200">
                      <option>All locations</option>
                      <option>Central Park</option>
                      <option>Riverside Trail</option>
                      <option>Oakwood Garden</option>
                      <option>Meadow Park</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-forest-700 mb-1 block">Bird Category</label>
                    <select className="w-full rounded-lg border-lime-200">
                      <option>All Categories</option>
                      <option>Thrush</option>
                      <option>Cardinal</option>
                      <option>Jay</option>
                      <option>Finch</option>
                      <option>Hawk</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-forest-700 mb-1 block">Has Photo</label>
                    <select className="w-full rounded-lg border-lime-200">
                      <option>Any</option>
                      <option>With photo</option>
                      <option>Without photo</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}
            
            {sortedSightings.length > 0 ? (
              <div>
                {sortedSightings.map(sighting => (
                  <SightingListItem key={sighting.id} sighting={sighting} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-lime-200">
                <div className="mx-auto bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-lime-600" />
                </div>
                <h3 className="text-forest-900 font-medium mb-2">No sightings found</h3>
                <p className="text-forest-700 mb-4">
                  {searchTerm 
                    ? "Try adjusting your search or filters" 
                    : "Record your first bird sighting to get started"}
                </p>
                <Link to="/sightings/new">
                  <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Record Sighting
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="animate-fade-in mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border-lime-200 p-6">
                  <h3 className="font-heading font-semibold text-xl text-forest-900 mb-4">Monthly Sightings (2023)</h3>
                  <div className="space-y-1">
                    {monthlyStats.map(stat => (
                      <StatsBar 
                        key={stat.month}
                        month={stat.month}
                        count={stat.count}
                        max={maxMonthlyCount}
                      />
                    ))}
                  </div>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <Card className="border-lime-200 p-6 h-full">
                  <h3 className="font-heading font-semibold text-xl text-forest-900 mb-4">Sighting Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-lime-100">
                      <span className="text-forest-700">Total Sightings</span>
                      <span className="font-medium text-forest-900">{sightingsData.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-lime-100">
                      <span className="text-forest-700">Unique Species</span>
                      <span className="font-medium text-forest-900">
                        {new Set(sightingsData.map(s => s.birdName)).size}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-lime-100">
                      <span className="text-forest-700">Locations Visited</span>
                      <span className="font-medium text-forest-900">
                        {new Set(sightingsData.map(s => s.location)).size}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-lime-100">
                      <span className="text-forest-700">Active Streak</span>
                      <span className="font-medium text-forest-900">4 days</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-forest-700">Last Sighting</span>
                      <span className="font-medium text-forest-900">Today</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Sightings;
