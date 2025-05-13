
"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Clock, Ruler, Music, Star, Eye, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"

// Sample bird data
const birdsData = [
  {
    id: 1,
    name: "American Robin",
    scientificName: "Turdus migratorius",
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=800&h=500",
    description:
      "The American Robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is named after the European robin because of its reddish-orange breast, though the two species are not closely related.",
    habitat: "Woodland, Urban areas, Gardens, Parks",
    diet: "Earthworms, insects, berries, fruits",
    behavior:
      "Forages on lawns for earthworms, nests in trees or shrubs, migrates south in winter from northern regions.",
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
      "https://images.unsplash.com/photo-1555284224-731a5843d1ef?auto=format&fit=crop&w=800&h=500",
    ],
    sightings: [
      { location: "Central Park", date: "May 5, 2023", time: "10:23 AM" },
      { location: "Riverside Trail", date: "April 28, 2023", time: "9:15 AM" },
      { location: "Oakwood Garden", date: "April 15, 2023", time: "12:45 PM" },
    ],
    observations: [
      {
        id: 101,
        image: "https://images.unsplash.com/photo-1621105249905-39e9d9b1367f?auto=format&fit=crop&w=800&h=600",
        location: "Central Park, New York",
        date: "May 5, 2023",
        time: "10:23 AM",
        user: {
          name: "Maria García",
          avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        },
        description: "Spotted this beautiful American Robin gathering nesting materials early in the morning. It was very active and seemed undisturbed by my presence.",
        weather: "Sunny, slight breeze",
        notes: "Bird was singing loudly and displaying territorial behavior.",
      },
      {
        id: 102,
        image: "https://images.unsplash.com/photo-1591198936750-db8b93cb7491?auto=format&fit=crop&w=800&h=600",
        location: "Riverside Trail, Boston",
        date: "April 28, 2023", 
        time: "9:15 AM",
        user: {
          name: "John Smith",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        description: "Observed a pair of American Robins building a nest in a maple tree about 8 feet off the ground. They were taking turns bringing materials.",
        weather: "Cloudy, mild temperature",
        notes: "The pair seemed to be working together efficiently, suggesting they may have nested together before.",
      },
      {
        id: 103,
        image: "https://images.unsplash.com/photo-1550029402-226115b7c579?auto=format&fit=crop&w=800&h=600",
        location: "Oakwood Garden, Chicago",
        date: "April 15, 2023",
        time: "12:45 PM",
        user: {
          name: "Emma Johnson",
          avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        },
        description: "Found an American Robin foraging on the lawn after a light rain. It was pulling up earthworms with great success and seemed very healthy.",
        weather: "Partly cloudy, recent light rain",
        notes: "This individual had particularly vibrant coloring, possibly a mature male in breeding plumage.",
      }
    ]
  },
  // Add more birds with similar structure...
  {
    id: 2,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/452211470/original.jpg",
    description:
      "The Northern Cardinal is a bird in the genus Cardinalis. It is also known colloquially as the redbird, common cardinal, red cardinal, or just cardinal. It can be found in southeastern Canada, through the eastern United States, and south to Mexico.",
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
      "https://inaturalist-open-data.s3.amazonaws.com/photos/189434971/large.jpg",
      "https://images.unsplash.com/photo-1520808663317-647b476a81b9?auto=format&fit=crop&w=800&h=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&h=500",
      
      
    ],
    sightings: [
      { location: "Backyard Feeder", date: "May 6, 2023", time: "8:13 AM" },
      { location: "Forest Park", date: "May 1, 2023", time: "7:45 AM" },
      { location: "River Trail", date: "April 22, 2023", time: "10:20 AM" },
    ],
    observations: [
      {
        id: 201,
        image: "https://images.unsplash.com/photo-1590318892850-c7376373f239?auto=format&fit=crop&w=800&h=600",
        location: "Backyard Feeder, Atlanta",
        date: "May 6, 2023",
        time: "8:13 AM",
        user: {
          name: "Carlos Rodriguez",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        description: "Male Northern Cardinal visiting my feeder regularly every morning. Very territorial and chases away other birds.",
        weather: "Clear sky, mild",
        notes: "This cardinal has been visiting for about 3 weeks now. It seems to prefer sunflower seeds.",
      },
      {
        id: 202,
        image: "https://images.unsplash.com/photo-1603270238276-3732e4d3f7f3?auto=format&fit=crop&w=800&h=600",
        location: "Forest Park, Cincinnati",
        date: "May 1, 2023", 
        time: "7:45 AM",
        user: {
          name: "Sarah Williams",
          avatar: "https://randomuser.me/api/portraits/women/67.jpg",
        },
        description: "Saw a pair of Northern Cardinals building a nest in a dense shrub. The male was bringing materials while the female was arranging them.",
        weather: "Sunny, warm morning",
        notes: "The nest was about 6 feet off the ground in a thorny bush, well-hidden from predators.",
      },
      {
        id: 203,
        image: "https://images.unsplash.com/photo-1565023894734-654b25ebf1a9?auto=format&fit=crop&w=800&h=600",
        location: "River Trail, Louisville",
        date: "April 22, 2023",
        time: "10:20 AM",
        user: {
          name: "David Chen",
          avatar: "https://randomuser.me/api/portraits/men/77.jpg",
        },
        description: "Female Northern Cardinal collecting grass and small twigs. Very cautious and would fly away when anyone approached.",
        weather: "Partly cloudy, breezy",
        notes: "Seemed to be in the early stages of nest building based on the materials being gathered.",
      }
    ]
  },
]

type ObservationType = {
  id: number;
  image: string;
  location: string;
  date: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  weather: string;
  notes: string;
};

const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [bird, setBird] = useState<(typeof birdsData)[0] | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [selectedObservation, setSelectedObservation] = useState<ObservationType | null>(null)

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      const foundBird = birdsData.find((b) => b.id === Number(id))
      if (foundBird) {
        setBird(foundBird)
        setActiveImage(foundBird.image)
      }
      setLoading(false)
    }, 300)
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-forest-700">Loading species information...</div>
      </div>
    )
  }

  if (!bird) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-forest-900 mb-4">Species Not Found</h2>
        <p className="text-forest-700 mb-6">We couldn't find information for this bird species.</p>
        <Link to="/explorer">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white">Back to Explorer</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/explorer" className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
       <div className="lg:col-span-1 space-y-4">
        <Card className="relative overflow-hidden border rounded-xl shadow-md">
          <img
            src={activeImage || "/placeholder.svg"}
            alt={bird.name}
            className="w-full aspect-[4/4] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-xs text-white font-medium">
                Foto por:
              </p>
            </div>
        </Card>
       </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1 space-y-6">
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
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white">
                General Info
              </TabsTrigger>
              <TabsTrigger value="habitat" className="rounded-lg data-[state=active]:bg-white">
                Habitat & Behavior
              </TabsTrigger>
              <TabsTrigger value="sightings" className="rounded-lg data-[state=active]:bg-white">
                Your Sightings
              </TabsTrigger>
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
                        <button className="text-lime-600 hover:text-lime-700 underline">Listen to call</button>
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
      
      {/* Observations Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-forest-950 mb-6">Recent Observations</h2>
        
        {bird.observations && bird.observations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bird.observations.map((observation) => (
              <Dialog key={observation.id}>
                <DialogTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={observation.image} 
                          alt={`Observation of ${bird.name}`}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-lime-200">
                            <AvatarImage src={observation.user.avatar} alt={observation.user.name} />
                            <AvatarFallback>{observation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm text-forest-800">{observation.user.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                          <Info className="h-4 w-4 text-forest-600" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-forest-700 mb-2">
                        <MapPin className="h-3 w-3 text-lime-600" />
                        <span>{observation.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-forest-600">
                        <Calendar className="h-3 w-3" />
                        <span>{observation.date}</span>
                        <Clock className="h-3 w-3 ml-1" />
                        <span>{observation.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-forest-900">
                      {bird.name} Observation
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="mt-2">
                    <img 
                      src={observation.image} 
                      alt={`Observation of ${bird.name}`} 
                      className="w-full h-auto rounded-md object-cover mb-4"
                    />
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8 border border-lime-200">
                        <AvatarImage src={observation.user.avatar} alt={observation.user.name} />
                        <AvatarFallback>{observation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-forest-900">{observation.user.name}</span>
                    </div>
                    
                    <div className="space-y-3 text-forest-800">
                      <div>
                        <h3 className="font-medium text-forest-900">Description</h3>
                        <p className="text-sm">{observation.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="font-medium text-forest-700">Location:</span> {observation.location}
                        </div>
                        <div>
                          <span className="font-medium text-forest-700">Date:</span> {observation.date}
                        </div>
                        <div>
                          <span className="font-medium text-forest-700">Time:</span> {observation.time}
                        </div>
                        <div>
                          <span className="font-medium text-forest-700">Weather:</span> {observation.weather}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-forest-900">Notes</h3>
                        <p className="text-sm">{observation.notes}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-forest-700 mb-4">No observations have been recorded for this species yet.</p>
            <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2 rounded-full mx-auto">
              <Eye className="h-4 w-4" />
              Share Your Observation
            </Button>
          </Card>
        )}
      </div>
      
    </div>
  )
}

export default SpeciesDetail
