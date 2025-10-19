"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Clock, Ruler, Music, Star, Eye, Info, TreePine, Sparkles, CornerRightDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"


// Sample bird data
const birdsData = [
  {
    id: 1,
    common_name: "Gavilán Pollero",
    scientific_name: "Rupornis magnirostris",
    default_photo: {
      medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/1316192/medium.jpg",
      attribution: "(c) Alejandro  Bayer Tamayo, some rights reserved (CC BY-SA)",
      license_code: "cc-by"
    },
    ecological_importance: {
      conservation_status: {
        status: "LC",
        description: "Preocupación Menor"
      },
      establishment_in_colombia: {
        is_native: true,
        is_endemic: false,
        description: "Especie nativa de la Región Neotropical, encontrándose desde el sur de México hasta Uruguay"
      }
    },
    habitat: "Sabanas, montes y bosques",
    diet: "Insectos, pequeños mamíferos y pequeños reptiles",
    behavior: "Se alimenta cazando desde perchas. Habita en sabanas, montes y bosques",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,  
    establishment_status_colombia: "edemica",
    // Taxonomic information
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Aves",
    order_name: "Accipitriformes",
    family: "Accipitridae",
    genus: "Rupornis",
    species: "R. magnirostris",
    rank: "species",
    api_references: [
      {
        data: {
          taxon_photos: [
            { photo: { medium_url: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=800&h=500" } },
            { photo: { medium_url: "https://images.unsplash.com/photo-1555446667-cfec1fb467c5?auto=format&fit=crop&w=800&h=500" } },
            { photo: { medium_url: "https://images.unsplash.com/photo-1555284224-731a5843d1ef?auto=format&fit=crop&w=800&h=500" } }
          ]
        }
      }
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
    common_name: "Canario coronado",
    scientific_name: "Sicalis flaveola",
    default_photo: {
      medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/23856507/large.jpg",
      attribution: "(c) Alejandro Bayer Tamayo, some rights reserved (CC BY-SA)",
      license_code: "cc-by-sa"
    },
    ecological_importance: {
      conservation_status: {
        status: "LC",
        description: "Preocupación Menor - La especie tiene poblaciones saludables"
      },
      establishment_in_colombia: {
        is_native: true,
        is_endemic: false,
        description: "Especie nativa de Colombia - forma parte del ecosistema natural del país"
      }
    },
    habitat: "Áreas abiertas y sotobosques de tierras bajas",
    diet: "Semillas, frutas, insectos",
    behavior: "Forrajea en el suelo, común en áreas urbanas y rurales",
    conservation_status: "LC",
    is_native: true,
    is_endemic: false,
    establishment_status_colombia: "nativa",
    // Taxonomic information
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Aves",
    order_name: "Passeriformes",
    family: "Thraupidae",
    genus: "Sicalis",
    species: "S. flaveola",
    rank: "species",
    api_references: [
      {
        data: {
          taxon_photos: [
            { photo: { medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/220765971/medium.jpg" } },
            { photo: { medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/255647599/medium.jpg" } },
            { photo: { medium_url: "https://inaturalist-open-data.s3.amazonaws.com/photos/526826763/medium.jpg" } }
          ]
        }
      }
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
  kingdom?: string;
  phylum?: string;
  class?: string;
  order_name?: string;
  family?: string;
  genus?: string;
  species?: string;
  rank?: string;
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
        setActiveImage(foundBird.default_photo.medium_url)
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
            alt={bird.common_name}
            className="w-full aspect-[4/3] md:aspect-[4/4] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-xs text-white font-medium">
                {bird.default_photo.attribution}
              </p>
            </div>
        </Card>
        
        {/* Gallery thumbnails */}
        {bird.api_references && bird.api_references[0]?.data?.taxon_photos && bird.api_references[0].data.taxon_photos.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {bird.api_references[0].data.taxon_photos.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(item.photo.medium_url)}
                className={`relative overflow-hidden rounded-md border-2 transition-all hover:scale-105 ${
                  activeImage === item.photo.medium_url ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={item.photo.medium_url}
                  alt={`${bird.common_name} - imagen ${index + 1}`}
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
            <h1 className="text-3xl font-bold text-forest-950 mb-1">{bird.common_name}</h1>
            <p className="text-forest-700 italic mb-4">{bird.scientific_name}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {bird.establishment_status_colombia && bird.establishment_status_colombia !== "unknown" && (() => {
                const status = bird.establishment_status_colombia.toLowerCase();
                const getStatusConfig = () => {
                  if (status === "native" || status === "nativa") {
                    return { 
                      icon: <Star className="h-3.5 w-3.5" />, 
                      className: "bg-forest-100 text-forest-800",
                      label: "Nativa"
                    };
                  }
                  if (status === "endemic" || status === "edemica" || status === "endémica") {
                    return { 
                      icon: <Sparkles className="h-3.5 w-3.5" />, 
                      className: "bg-yellow-100 text-yellow-800",
                      label: "Endémica"
                    };
                  }
                  if (status === "introduced" || status === "introducida") {
                    return { 
                      icon: <CornerRightDown className="h-3.5 w-3.5" />, 
                      className: "bg-pink-100 text-pink-800",
                      label: "Introducida"
                    };
                  }
                  return { 
                    icon: null, 
                    className: "bg-lime-100 text-lime-800",
                    label: bird.establishment_status_colombia
                  };
                };
                const config = getStatusConfig();
                return (
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${config.className}`}>
                    {config.icon}
                    {config.label}
                  </span>
                );
              })()}
              {bird.conservation_status && (() => {
                const getConservationConfig = (status: string) => {
                  switch (status.toUpperCase()) {
                    case 'EX':
                      return { 
                        label: 'Extinto (EX)', 
                        className: 'bg-black text-white'
                      };
                    case 'EW':
                      return { 
                        label: 'Extinto en Estado Silvestre (EW)', 
                        className: 'bg-purple-900 text-white'
                      };
                    case 'CR':
                      return { 
                        label: 'En Peligro Crítico (CR)', 
                        className: 'bg-red-700 text-white'
                      };
                    case 'EN':
                      return { 
                        label: 'En Peligro (EN)', 
                        className: 'bg-orange-500 text-white'
                      };
                    case 'VU':
                      return { 
                        label: 'Vulnerable (VU)', 
                        className: 'bg-yellow-400 text-black'
                      };
                    case 'NT':
                      return { 
                        label: 'Casi Amenazado (NT)', 
                        className: 'bg-lime-400 text-black'
                      };
                    case 'LC':
                      return { 
                        label: 'Preocupación Menor (LC)', 
                        className: 'bg-green-500 text-white'
                      };
                    case 'DD':
                      return { 
                        label: 'Datos Insuficientes (DD)', 
                        className: 'bg-gray-400 text-white'
                      };
                    case 'NE':
                      return { 
                        label: 'No Evaluado (NE)', 
                        className: 'bg-gray-200 text-gray-800'
                      };
                    default:
                      return { 
                        label: status, 
                        className: 'bg-gray-200 text-gray-800'
                      };
                  }
                };
                const config = getConservationConfig(bird.conservation_status);
                return (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
                    {config.label}
                  </span>
                );
              })()}
            </div>

            <p className="text-forest-800 mb-6 text-justify">
              {bird.ecological_importance?.establishment_in_colombia?.description || 'Especie registrada en Colombia'}
            </p>
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
                        { level: 0, label: 'Reino', value: bird.kingdom, icon: '👑', color: 'text-lime-600' },
                        { level: 1, label: 'Filo', value: bird.phylum, icon: '📜', color: 'text-lime-500' },
                        { level: 2, label: 'Clase', value: bird.class, icon: '📚', color: 'text-lime-400' },
                        { level: 3, label: 'Orden', value: bird.order_name, icon: '📖', color: 'text-lime-300' },
                        { level: 4, label: 'Familia', value: bird.family, icon: '👪', color: 'text-lime-200' },
                        { level: 5, label: 'Género', value: bird.genus, icon: '🌿', color: 'text-lime-100', italic: true },
                        { level: 6, label: 'Especie', value: bird.species, icon: '🦜', color: 'text-lime-50', italic: true }
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
                <h3 className="text-sm font-medium text-forest-900">Avistamientos de {bird.common_name}</h3>
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