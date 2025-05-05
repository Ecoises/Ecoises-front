
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  ArrowLeft,
  Clock, 
  Ruler, 
  Music, 
  BookOpen,
  Star,
  Heart,
  Eye,
  Share
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample bird data
const birdsData = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=800&h=500",
    description: "The American Robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is named after the European robin because of its reddish-orange breast, though the two species are not closely related.",
    habitat: "Woodland, Urban areas, Gardens, Parks",
    diet: "Earthworms, insects, berries, fruits",
    behavior: "Forages on lawns for earthworms, nests in trees or shrubs, migrates south in winter from northern regions.",
    conservation: "Least Concern - abundant and widespread",
    size: "25 cm (9.8 in)",
    weight: "77-85 g (2.7-3 oz)",
    lifespan: "2 years average, up to 14 years",
    range: "Throughout North America",
    category: "Thrush",
    audio: "https://example.com/robin-call.mp3",
    gallery: [
      "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1555446667-cfec1fb467c5?auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1555284224-731a5843d1ef?auto=format&fit=crop&w=800&h=500"
    ],
    sightings: [
      { location: "Central Park", date: "May 5, 2023", time: "10:23 AM" },
      { location: "Riverside Trail", date: "April 28, 2023", time: "9:15 AM" },
      { location: "Oakwood Garden", date: "April 15, 2023", time: "12:45 PM" }
    ]
  },
  // Add more birds with similar structure...
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&h=500",
    description: "The Northern Cardinal is a bird in the genus Cardinalis. It is also known colloquially as the redbird, common cardinal, red cardinal, or just cardinal. It can be found in southeastern Canada, through the eastern United States, and south to Mexico.",
    habitat: "Woodlands, Gardens, Shrublands, Swamps",
    diet: "Seeds, fruits, insects",
    behavior: "Ground forager, maintains year-round territories, males are aggressive in defending territory.",
    conservation: "Least Concern - population increasing",
    size: "21-23 cm (8.3-9.1 in)",
    weight: "42-48 g (1.5-1.7 oz)",
    lifespan: "3 years average, up to 15 years",
    range: "Eastern and central North America, Mexico",
    category: "Cardinal",
    audio: "https://example.com/cardinal-call.mp3",
    gallery: [
      "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&h=500"
    ],
    sightings: [
      { location: "Backyard Feeder", date: "May 6, 2023", time: "8:13 AM" },
      { location: "Forest Park", date: "May 1, 2023", time: "7:45 AM" },
      { location: "River Trail", date: "April 22, 2023", time: "10:20 AM" }
    ]
  }
];

const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bird, setBird] = useState<typeof birdsData[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundBird = birdsData.find(b => b.id === Number(id));
      if (foundBird) {
        setBird(foundBird);
        setActiveImage(foundBird.image);
      }
      setLoading(false);
    }, 300);
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse text-forest-700">Loading species information...</div>
        </div>
      </Layout>
    );
  }
  
  if (!bird) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-forest-900 mb-4">Species Not Found</h2>
          <p className="text-forest-700 mb-6">We couldn't find information for this bird species.</p>
          <Link to="/explorer">
            <Button className="bg-lime-500 hover:bg-lime-600 text-white">
              Back to Explorer
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <Link to="/explorer" className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Explorer
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden border-lime-200">
              <img 
                src={activeImage} 
                alt={bird.name} 
                className="w-full aspect-video object-cover"
              />
            </Card>
            
            <div className="grid grid-cols-3 gap-2">
              {bird.gallery.map((img, index) => (
                <button 
                  key={index} 
                  className="overflow-hidden rounded-lg border border-lime-200"
                  onClick={() => setActiveImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${bird.name} ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 justify-center">
              <Button size="sm" variant="outline" className="rounded-full border-lime-200 gap-1">
                <Star className="h-4 w-4" />
                Favorite
              </Button>
              <Button size="sm" variant="outline" className="rounded-full border-lime-200 gap-1">
                <Eye className="h-4 w-4" />
                Log Sighting
              </Button>
              <Button size="sm" variant="outline" className="rounded-full border-lime-200 gap-1">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-forest-950 mb-1">{bird.name}</h1>
              <p className="text-forest-700 italic mb-4">{bird.scientificName}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-sm">{bird.category}</span>
                <span className="bg-forest-100 text-forest-800 px-3 py-1 rounded-full text-sm">{bird.conservation}</span>
              </div>
              
              <p className="text-forest-800 mb-6">{bird.description}</p>
            </div>
            
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="bg-lime-50 p-1 rounded-xl">
                <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white">General Info</TabsTrigger>
                <TabsTrigger value="habitat" className="rounded-lg data-[state=active]:bg-white">Habitat & Behavior</TabsTrigger>
                <TabsTrigger value="sightings" className="rounded-lg data-[state=active]:bg-white">Your Sightings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="animate-fade-in mt-4">
                <Card className="border-lime-200 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-lg">
                        <Ruler className="h-5 w-5 text-lime-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-forest-900">Size</h3>
                        <p className="text-forest-700">{bird.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-lime-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-forest-900">Lifespan</h3>
                        <p className="text-forest-700">{bird.lifespan}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-lime-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-forest-900">Range</h3>
                        <p className="text-forest-700">{bird.range}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-lime-100 p-2 rounded-lg">
                        <Music className="h-5 w-5 text-lime-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-forest-900">Song</h3>
                        <p className="text-forest-700">
                          <button className="text-lime-600 hover:text-lime-700 underline">
                            Listen to call
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="habitat" className="animate-fade-in mt-4">
                <Card className="border-lime-200 p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-forest-900 mb-1">Habitat</h3>
                      <p className="text-forest-700">{bird.habitat}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-forest-900 mb-1">Diet</h3>
                      <p className="text-forest-700">{bird.diet}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-forest-900 mb-1">Behavior</h3>
                      <p className="text-forest-700">{bird.behavior}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="sightings" className="animate-fade-in mt-4">
                <Card className="border-lime-200 p-4">
                  {bird.sightings.length > 0 ? (
                    <div className="divide-y divide-lime-100">
                      {bird.sightings.map((sighting, index) => (
                        <div key={index} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-lime-600" />
                              <span className="text-forest-900">{sighting.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-forest-700 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>{sighting.date}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{sighting.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-forest-700 mb-3">You haven't recorded any sightings of this species yet.</p>
                      <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2 rounded-full">
                        <Eye className="h-4 w-4" />
                        Log Your First Sighting
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SpeciesDetail;
