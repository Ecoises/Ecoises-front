"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Circle, Clock, Ruler, Music, Star, Eye, Info, TreePine, Sparkles, CornerRightDown, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useSpeciesDetail } from "@/hooks/useSpecies"


const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: species, isLoading, isError } = useSpeciesDetail(id!, { enabled: !!id });
  const [activeImage, setActiveImage] = useState("")

  // Helper to force high-resolution URL for iNaturalist images
  const getHighResUrl = (url: string) => {
    if (!url) return "/placeholder.svg";
    // Check if it's an iNaturalist URL and has a size indicator
    if (url.includes('inaturalist')) {
      return url.replace(/\/(medium|square|small|large)\./, '/original.');
    }
    return url;
  };

  useEffect(() => {
    if (species) {
      if (species.gallery && species.gallery.length > 0) {
        // Prefer the first gallery image (usually original quality in API references)
        // or transform the URL if it's not
        const firstImage = species.gallery[0];
        const urlToCheck = firstImage.url || firstImage.medium_url;
        setActiveImage(getHighResUrl(urlToCheck));
      } else if (species.default_photo) {
        // Fallback to default photo, upgrading quality if possible
        const defPhoto = species.default_photo;
        const urlToCheck = defPhoto.url || defPhoto.medium_url;
        setActiveImage(getHighResUrl(urlToCheck));
      }
    }
  }, [species]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-forest-700">
          <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
          <p>Cargando información de la especie...</p>
        </div>
      </div>
    )
  }

  if (isError || !species) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-forest-900 mb-4">Especie no encontrada</h2>
        <p className="text-forest-700 mb-6">No pudimos encontrar información para esta especie.</p>
        <Link to="/explorer">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white">Volver al Explorador</Button>
        </Link>
      </div>
    )
  }

  // Construct gallery from API data
  const gallery = species.gallery || (species.default_photo ? [species.default_photo] : []);
  const defaultPhoto = species.default_photo || (gallery.length > 0 ? gallery[0] : null);

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
              alt={species.common_name}
              className="w-full aspect-[4/3] md:aspect-[4/4] object-cover bg-gray-100"
            />
            {defaultPhoto?.attribution && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs text-white font-medium">
                  {defaultPhoto.attribution}
                </p>
              </div>
            )}
          </Card>

          {/* Gallery thumbnails */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {gallery.map((item: any, index: number) => {
                const thumbUrl = item.medium_url || item.url;
                // Pre-calculate the high res url for this item
                const highResUrl = getHighResUrl(item.url || item.medium_url);
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(highResUrl)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all hover:scale-105 ${activeImage === highResUrl ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`${species.common_name} - imagen ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-950 mb-1 capitalize">{species.common_name || species.scientific_name}</h1>
            <p className="text-forest-700 italic mb-4">{species.scientific_name}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {species.establishment_status_colombia && species.establishment_status_colombia !== "unknown" && (() => {
                const status = String(species.establishment_status_colombia).toLowerCase();
                const getStatusConfig = () => {
                  if (status === "native" || status === "nativa") {
                    return {
                      icon: <Star className="h-3.5 w-3.5" />,
                      className: "bg-lime-200 text-forest-800",
                      label: "Nativa"
                    };
                  }
                  if (status === "endemic" || status === "edemica" || status === "endémica" || status === "endemica") {
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
                    label: species.establishment_status_colombia
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

              {(() => {
                // Try to get status from root, or fallback to api_references
                let statusData = species.conservation_status;

                // If root status is NE or missing, check api_references
                if ((!statusData || statusData === 'NE' || (typeof statusData === 'object' && statusData.status === 'NE')) &&
                  species.api_references?.[0]?.data?.conservation_status) {
                  statusData = species.api_references[0].data.conservation_status;
                }

                if (!statusData) return null;

                const statusObj = typeof statusData === 'object' ? statusData : { status: statusData };
                const status = (statusObj.status || 'NE').toUpperCase();

                const getConservationConfig = (s: string) => {
                  switch (s) {
                    case 'EX': return { label: 'Extinto (EX)', className: 'bg-gray-900 text-white' }; // Mantenerlo fuerte (casi negro)
                    case 'EW': return { label: 'Extinto en Estado Silvestre (EW)', className: 'bg-purple-100 text-purple-800' };
                    case 'CR': return { label: 'En Peligro Crítico (CR)', className: 'bg-red-100 text-red-800' };
                    case 'EN': return { label: 'En Peligro (EN)', className: 'bg-orange-100 text-orange-800' };
                    case 'VU': return { label: 'Vulnerable (VU)', className: 'bg-yellow-100 text-yellow-800' };
                    case 'NT': return { label: 'Casi Amenazado (NT)', className: 'bg-lime-100 text-lime-800' };
                    case 'LC': return { label: 'Preocupación Menor (LC)', className: 'bg-green-100 text-green-800' };
                    case 'DD': return { label: 'Datos Insuficientes (DD)', className: 'bg-gray-100 text-gray-800' };
                    case 'NE': return { label: 'No Evaluado (NE)', className: 'bg-gray-100 text-gray-800' };
                    default: return { label: s, className: 'bg-gray-100 text-gray-800' };
                  }
                };
                const config = getConservationConfig(status);
                return (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
                    {config.label}
                  </span>
                );
              })()}
            </div>

            {(() => {
              const summary = species.api_references?.[0]?.data?.wikipedia_summary || species.wikipedia_summary;
              if (summary && summary.trim() !== '') {
                return (
                  <div
                    className="text-forest-800 mb-6 text-justify prose prose-sm max-w-none prose-lime"
                    dangerouslySetInnerHTML={{ __html: summary }}
                  />
                );
              }
              return (
                <p className="text-forest-800 mb-6 text-justify">
                  <strong>{species.common_name || species.scientific_name}</strong> ({species.scientific_name}) es una especie perteneciente a la familia <strong>{species.family}</strong>.
                </p>
              );
            })()}
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-lime-50 p-1 rounded-xl">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white">
                Taxonomía
              </TabsTrigger>
              <TabsTrigger value="habitat" className="rounded-lg data-[state=active]:bg-white">
                Habitat
              </TabsTrigger>
              <TabsTrigger value="atribution" className="rounded-lg data-[state=active]:bg-white">
                Atribución
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="animate-fade-in mt-4">
  <Card className="border-lime-200 p-4">
    <div className="space-y-4">
      
      
      {/* Nuevo Contenedor de Lista */}
      <div className="space-y-1">
        {[
          { level: 0, label: 'Reino', value: species.kingdom },
          { level: 1, label: 'Filo', value: species.phylum },
          { level: 2, label: 'Clase', value: species.class },
          { level: 3, label: 'Orden', value: species.order_name },
          { level: 4, label: 'Familia', value: species.family },
          { level: 5, label: 'Género', value: species.genus, italic: true },
          { level: 6, label: 'Especie', value: species.scientific_name, italic: true }
        ].filter(i => i.value).map((item) => (
          <div 
            key={item.label} 
            // Indentación basada en el nivel: pl-4 para el nivel 0, pl-6 para el nivel 1, etc.
            className={`flex items-start ${item.level > 0 ? `pl-${(item.level * 4)}` : ''} text-gray-700`}
          >
            
            {/* Icono simple: Usar un punto (Circle) o guion para un estilo limpio */}
            <Circle className="h-2 w-2 mt-2 mr-2 flex-shrink-0 text-lime-600 fill-lime-600" />
            
            {/* Contenido */}
            <div className="flex-1">
              <span className="font-medium text-forest-700 mr-2">{item.label}:</span>
              <span className={`${item.italic ? 'italic' : ''} text-forest-900 font-normal`}>
                {item.value}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  </Card>
</TabsContent>

            <TabsContent value="habitat" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-forest-900 mb-1">Habitat</h3>
                    <p className="text-forest-700 italic">Información no disponible por el momento</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-forest-900 mb-1">Dieta</h3>
                    <p className="text-forest-700 italic">Información no disponible por el momento</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="atribution" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-forest-900 mb-1">Fuente de datos</h3>
                    <p className="text-forest-700">iNaturalist API</p>
                  </div>
                  {species.wikipedia_url && (
                    <div>
                      <h3 className="font-medium text-forest-900 mb-1">Enlaces externos</h3>
                      <a href={species.wikipedia_url} target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:underline">
                        Wikipedia
                      </a>
                    </div>
                  )}
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
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#059669" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-desktop)" />
              </svg>
            </div>

            {/* Map Title */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-forest-900">Avistamientos de {species.common_name || species.scientific_name}</h3>
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