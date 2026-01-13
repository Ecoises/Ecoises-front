"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Circle, Clock, Ruler, Music, Star, Eye, Info, TreePine, Sparkles, CornerRightDown, Loader2, X, Maximize2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useSpeciesDetail, useRelatedSpecies } from "@/hooks/useSpecies"
import SpeciesDistributionMap from "@/components/maps/SpeciesDistributionMap"
import { AnimatePresence, motion } from "framer-motion"


const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();
  const location = useLocation();
  const { data: species, isLoading, isError } = useSpeciesDetail(id!, { enabled: !!id });
  const { data: relatedSpecies, isLoading: isLoadingRelated } = useRelatedSpecies(id!, { enabled: !!id });
  const [activeImage, setActiveImage] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cerrar con tecla escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
  }, [species, id]);

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

  // Determinar la foto activa para mostrar su atribución correcta
  const activePhotoData = gallery.find(img => getHighResUrl(img.url || img.medium_url) === activeImage) || defaultPhoto;

  const handleBack = () => {
    // Si hay estado previo (venimos de una navegación interna), volvemos atrás
    // Si el historial es corto, vamos al explorer por defecto
    if (location.state?.from || window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/explorer");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-forest-700 hover:text-forest-900 px-0 hover:bg-transparent inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a explorar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-1 space-y-4">
          <Card
            className="relative overflow-hidden border rounded-xl shadow-md cursor-zoom-in group"
            onClick={() => setIsFullscreen(true)}
          >
            <img
              src={activeImage || "/placeholder.svg"}
              alt={species.common_name}
              className="w-full aspect-[4/3] md:aspect-[4/4] object-cover bg-gray-100 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay hint */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm pointer-events-none">
              <Maximize2 className="h-5 w-5" />
            </div>

            {activePhotoData?.attribution && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pointer-events-none">
                <p className="text-xs text-white font-medium">
                  {activePhotoData.attribution}
                </p>
              </div>
            )}
          </Card>

          {/* Gallery thubnails */}
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
                      className: "bg-lime-300 text-forest-900",
                      label: "Nativa"
                    };
                  }
                  if (status === "endemic" || status === "edemica" || status === "endémica" || status === "endemica") {
                    return {
                      icon: <Sparkles className="h-3.5 w-3.5" />,
                      className: "bg-lime-800 text-white",
                      label: "Endémica de Colombia"
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
                + Info
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

      {/* Two-column layout: Map and Similar Species */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Distribution Map */}
        <div>
          <h2 className="text-2xl font-bold text-forest-950 mb-4">Mapa de Distribución</h2>
          <div className="h-[400px] w-full relative">
            {/* Get external_id from api_references for iNaturalist */}
            {(() => {
              const externalId = species?.api_references?.find(
                (ref: any) => ref.api_source === 'inaturalist'
              )?.external_id || species?.id;

              return (
                <SpeciesDistributionMap
                  taxonId={externalId}
                  speciesName={species.common_name || species.scientific_name}
                  center={[4.5709, -74.2973]} // Colombia center
                  zoom={6}
                />
              );
            })()}
          </div>
        </div>

        {/* Right Column: Similar Species */}
        <div>
          <h2 className="text-2xl font-bold text-forest-950 mb-4">Especies Similares</h2>
          <div className="space-y-4">
            {isLoadingRelated ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-lime-600" />
              </div>
            ) : relatedSpecies && relatedSpecies.length > 0 ? (
              relatedSpecies.map((similar: any, index: number) => {
                const similarPhoto = similar.default_photo?.url || similar.default_photo?.medium_url;
                return (
                  <Link key={index} to={`/species/${similar.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group mb-1">
                      <div className="flex gap-4">
                        <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                          {similarPhoto ? (
                            <img
                              src={similarPhoto}
                              alt={similar.common_name || similar.scientific_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <TreePine className="h-12 w-12" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 py-3 pr-4 flex flex-col justify-center">
                          <h3 className="font-semibold text-forest-950 text-lg mb-1 group-hover:text-lime-600 transition-colors">
                            {similar.common_name || similar.scientific_name}
                          </h3>
                          <p className="text-forest-700 italic text-sm">
                            {similar.scientific_name}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <p className="text-forest-700 italic text-center py-8">
                No se encontraron especies similares
              </p>
            )}
          </div>
        </div>
      </div>


      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50 cursor-pointer"
            >
              <X className="h-8 w-8" />
              <span className="sr-only">Cerrar</span>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none" // pointer-events-none prevents clicking the div closing the modal, but we want click anywhere to close mostly
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image wrapper itself? actually user wants click to close? "Close button... and easy exit". Usually clicking background closes.
            >
              <img
                src={activeImage || "/placeholder.svg"}
                alt={species.common_name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto" // Re-enable pointer events for the image if we want context menu etc
              />

              {activePhotoData?.attribution && (
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-auto">
                  <span className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                    {activePhotoData.attribution}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SpeciesDetail