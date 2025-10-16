
"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Clock, Ruler, Music, Star, Eye, Info, TreePine } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"


// Sample bird data
const birdsData = [
  {
    id: 1,
    name: "Gavilán Pollero",
    scientificName: "Rupornis magnirostris",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/1316192/medium.jpg",
    description:
      "El gavilán pollero (Rupornis magnirostris), también conocido como aguilucho de ala rojiza, gavilán caminero, taguato común o Pupa; y también como aguililla caminera, busardo caminero, gavilán chapulinero, chuubi o guío, es una especie de ave accipitriforme de la familia Accipitridae (milanos, aguilillas, gavilanes y águilas). Es a veces colocado en el género Buteo en vez de Rupornis. Es autóctona de la Región Neotropical, encontrándose desde el sur de México hasta Uruguay.Mide aproximadamente 35 cm y pesa alrededor de 295 g. Se alimenta de insectos, pequeños mamíferos y pequeños reptiles. Habita en sabanas, montes y bosques. ",
    diet: "Earthworms, insects, berries, fruits",
    behavior:
      "Forages on lawns for earthworms, nests in trees or shrubs, migrates south in winter from northern regions.",
    conservation: "NA - Preocupación menor",
    size: "25 cm (9.8 in)",
    weight: "77-85 g (2.7-3 oz)",
    lifespan: "2 years average, up to 14 years",
    range: "Throughout North America",
    category: "Nativa",
    audio: "https://example.com/robin-call.mp3",
    // Taxonomic information
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chxxxxxxxordata",
      class: "Avexxxs",
      order: "Pasxxxxxxssssssss seriformes",
      family: "Turdidae",
      genus: "Turdus",
      species: "T. migratorius"
    },
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
    // Taxonomic information
    taxonomy: {
      kingdom: "Anxxximalia",
      phylum: "Choxxxxrdata",
      class: "Avesxxx",
      order: "Passeriformes",
      family: "Cardinalxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxidae",
      genus: "Cardinalxxxis",
      species: "Cardinalijsjsjjsjsjsjs"
    },
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
        image: "https://inaturalist-open-data.s3.amazonaws.com/photos/452211470/original.jpg",
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
        image: "https://inaturalist-open-data.s3.amazonaws.com/photos/452211470/original.jpg",
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
        image: "https://inaturalist-open-data.s3.amazonaws.com/photos/452211470/original.jpg",
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
      },
      {
        id: 203,
        image: "https://inaturalist-open-data.s3.amazonaws.com/photos/452211470/original.jpg",
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

type BirdType = (typeof birdsData)[0] & {
  taxonomy?: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  }
}

const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [bird, setBird] = useState<BirdType | null>(null)
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
      <div className="mb-4">
        <Link to="/explorer" className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver a explorar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
       <div className="lg:col-span-1 space-y-4">
        <Card className="relative overflow-hidden border rounded-xl shadow-md">
          <img
            src={activeImage || "/placeholder.svg"}
            alt={bird.name}
            className="w-full aspect-[4/3] md:aspect-[4/4] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-xs text-white font-medium">
                Foto por: Jhonatan Camelo CCC
              </p>
            </div>
        </Card>
        
        {/* Gallery thumbnails */}
        {bird.gallery && bird.gallery.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {bird.gallery.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative overflow-hidden rounded-md border-2 transition-all hover:scale-105 ${
                  activeImage === imgUrl ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${bird.name} - imagen ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </button>
            ))}
          </div>
        )}
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

            <p className="text-forest-800 mb-6 text-justify">{bird.description}</p>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-lime-50 p-1 rounded-xl">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white">
                Taxonómia 
              </TabsTrigger>
              <TabsTrigger value="habitat" className="rounded-lg data-[state=active]:bg-white">
                Habitat 
              </TabsTrigger>
              <TabsTrigger value="atribution" className="rounded-lg data-[state=active]:bg-white">
                Atribucion 
              </TabsTrigger>
              <TabsTrigger value="sightings" className="rounded-lg data-[state=active]:bg-white">
                Atribucion 
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-lime-600" />
                    Clasificación Taxonómica
                  </h3>
                  <div className="relative">
                    <div className="space-y-4">
                      {[
                        { level: 0, label: 'Reino', value: bird.taxonomy?.kingdom, icon: '👑', color: 'text-lime-600' },
                        { level: 1, label: 'Filo', value: bird.taxonomy?.phylum, icon: '📜', color: 'text-lime-500' },
                        { level: 2, label: 'Clase', value: bird.taxonomy?.class, icon: '📚', color: 'text-lime-400' },
                        { level: 3, label: 'Orden', value: bird.taxonomy?.order, icon: '📖', color: 'text-lime-300' },
                        { level: 4, label: 'Familia', value: bird.taxonomy?.family, icon: '👪', color: 'text-lime-200' },
                        { level: 5, label: 'Género', value: bird.taxonomy?.genus, icon: '🌿', color: 'text-lime-100', italic: true },
                        { level: 6, label: 'Especie', value: bird.taxonomy?.species, icon: '🦜', color: 'text-lime-50', italic: true }
                      ].map((item, index) => (
                        <div key={item.label} className="flex items-start relative">
                          {/* Línea vertical */}
                          {index < 6 && (
                            <div 
                              className={`absolute left-6 top-6 h-${(6-index)*8} border-l-2 border-lime-300`}
                              style={{ height: `${(6-index)*32}px` }}
                            />
                          )}
                          
                          {/* Nodo */}
                          <div className={`flex-shrink-0 w-12 flex items-center justify-center ${item.color}`}>
                            <span className="text-lg">{item.icon}</span>
                          </div>
                          
                          {/* Contenido */}
                          <div className="flex-1 ml-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-forest-700">{item.label}:</span>
                              <span className={`${item.italic ? 'italic' : ''} text-forest-900`}>
                                {item.value || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
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
            <TabsContent value="atribution" className="animate-fade-in mt-4">
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

            
              
          </Tabs>
        </div>
      </div>

      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-forest-950 mb-6">Mapa de Distribución</h2>
        
      </div>

      {/* Map on desktop - appears below image */}
        <div className="lg:block">
          <div className="space-y-4">
            
            <div className="h-[300px] w-full relative bg-gradient-to-br from-blue-100 to-green-100 rounded-xl overflow-hidden border border-lime-200">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="grid-desktop" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#059669" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-desktop)" />
                </svg>
              </div>
              
              {/* Map Title */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-forest-900">Avistamientos de {bird.name}</h3>
              </div>
              
              {/* Sample markers */}
              <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-2/3 left-2/3 w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                  <span className="text-forest-700">Avistamientos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      
      
    </div>
  )
}

export default SpeciesDetail
