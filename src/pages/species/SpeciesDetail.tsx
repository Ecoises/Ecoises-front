"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Utensils, Star, Eye, Info, TreePine, Sparkles, CornerRightDown, Loader2, X, Maximize2, User, BookOpen, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useSpeciesDetail, useRelatedSpecies } from "@/hooks/useSpecies"
import SpeciesDistributionMap from "@/components/maps/SpeciesDistributionMap"
import { AnimatePresence, motion } from "framer-motion"
import TaxonomyGame from "@/components/species/TaxonomyGame"
import RecentObservations from "@/components/observations/RecentObservations"


const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();
  const location = useLocation();
  const { data: species, isLoading, isError } = useSpeciesDetail(id!, { enabled: !!id });
  const { data: relatedSpecies, isLoading: isLoadingRelated } = useRelatedSpecies(id!, { enabled: !!id });
  const [activeImage, setActiveImage] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

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
      setIsSummaryExpanded(false);
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
  const explorerCommonName = typeof location.state?.explorerCommonName === 'string'
    ? location.state.explorerCommonName.trim()
    : '';
  const displayCommonName = explorerCommonName || species.common_name || species.scientific_name;
  const gallery = species.gallery || (species.default_photo ? [species.default_photo] : []);
  const defaultPhoto = species.default_photo || (gallery.length > 0 ? gallery[0] : null);
  const ecologyProfile = species.ecology_profile;
  const ecologicalRole = ecologyProfile?.role;
  const habitat = ecologyProfile?.habitat || null;
  const diet = ecologyProfile?.diet || null;
  const ecology = ecologyProfile?.ecology || null;
  const eolSummary = ecologyProfile?.natural_history || null;
  const summary = species.api_references?.find((ref: any) => ref.api_source === 'inaturalist')?.data?.wikipedia_summary
    || species.wikipedia_summary
    || eolSummary?.text
    || null;
  const comparableText = (value?: string | null) => (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const isDuplicateText = (first?: string | null, second?: string | null) => {
    const normalizedFirst = comparableText(first);
    const normalizedSecond = comparableText(second);

    if (!normalizedFirst || !normalizedSecond) return false;
    if (normalizedFirst === normalizedSecond) return true;

    const minimumLength = Math.min(normalizedFirst.length, normalizedSecond.length);
    return minimumLength >= 120 && (
      normalizedFirst.includes(normalizedSecond) || normalizedSecond.includes(normalizedFirst)
    );
  };
  const naturalHistoryCandidate = ecologyProfile?.natural_history || null;
  const naturalHistory = naturalHistoryCandidate && !isDuplicateText(naturalHistoryCandidate.text, summary)
    ? naturalHistoryCandidate
    : null;

  const ecologicalHighlight = ecologicalRole;

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
              alt={displayCommonName}
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
            <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-x-visible md:pb-0 md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((item: any, index: number) => {
                const thumbUrl = item.medium_url || item.url;
                // Pre-calculate the high res url for this item
                const highResUrl = getHighResUrl(item.url || item.medium_url);
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(highResUrl)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all hover:scale-105 w-20 md:w-auto flex-shrink-0 snap-start ${activeImage === highResUrl ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`${displayCommonName} - imagen ${index + 1}`}
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
            <h1 className="text-3xl font-bold text-forest-950 mb-1 capitalize">{displayCommonName}</h1>
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
                const scope = species.conservation_status_scope || statusObj.scope;
                const scopeLabel = scope === 'colombia' ? 'Colombia' : scope === 'global' ? 'Global' : null;
                const authority = species.conservation_status_authority || statusObj.authority;

                return (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
                    title={authority ? `Fuente: ${authority}` : undefined}
                  >
                    {config.label}{scopeLabel ? ` · ${scopeLabel}` : ''}
                  </span>
                );              })()}
            </div>

            {(() => {
              if (summary && summary.trim() !== '') {
                return (
                  <div className="mb-6">
                    <div
                      className={`text-forest-800 text-justify prose prose-sm max-w-none prose-lime ${
                        isSummaryExpanded ? '' : 'line-clamp-4'
                      }`}
                      dangerouslySetInnerHTML={{ __html: summary }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSummaryExpanded((expanded) => !expanded)}
                      className="mt-2 text-sm font-semibold text-lime-700 hover:text-lime-800"
                    >
                      {isSummaryExpanded ? 'Ver menos' : 'Leer más'}
                    </button>
                  </div>
                );
              }
              return (
                <p className="text-forest-800 mb-6 text-justify">
                  <strong>{displayCommonName}</strong> ({species.scientific_name}) es una especie perteneciente a la familia <strong>{species.family}</strong>.
                </p>
              );
            })()}

            {ecologicalHighlight && (
              <Card className="mb-6 overflow-hidden border-lime-200 bg-gradient-to-br from-lime-50/90 to-emerald-50/70 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-2.5 text-lime-700 shadow-sm ring-1 ring-lime-100">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-forest-950">Su papel en la naturaleza</h3>
                        {ecologicalRole?.name && (
                          <span className="rounded-full bg-lime-200/70 px-2.5 py-0.5 text-xs font-semibold text-lime-900">
                            {ecologicalRole.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-forest-800">
                        {ecologicalHighlight.text}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-lime-50 p-1 rounded-xl w-full grid grid-cols-3">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white font-medium">
                Taxonomía
              </TabsTrigger>
              <TabsTrigger value="habitat" className="rounded-lg data-[state=active]:bg-white font-medium flex items-center justify-center gap-1.5">
                Historia Natural
              </TabsTrigger>
              <TabsTrigger value="atribution" className="rounded-lg data-[state=active]:bg-white font-medium">
                Atribución
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-4">
                <TaxonomyGame species={species} />
              </Card>
            </TabsContent>

            <TabsContent value="habitat" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Contenedor principal que adapta columnas según datos disponibles */}
                  {(habitat || diet || naturalHistory) ? (
                    <div className={`
                      grid gap-6
                      ${habitat && diet ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}
                    `}>
                      {/* Hábitat */}
                      {habitat && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 pb-2 border-b border-lime-100">
                            <TreePine className="h-5 w-5 text-lime-600" />
                            <h4 className="font-semibold text-forest-900 text-sm">Hábitat</h4>
                            {habitat.language && habitat.language !== 'es' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-100 text-lime-800 uppercase font-medium">
                                {habitat.language}
                              </span>
                            )}
                          </div>
                          <p className="text-forest-700 text-sm leading-relaxed">{habitat.text}</p>
                        </div>
                      )}

                      {/* Dieta */}
                      {diet && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 pb-2 border-b border-lime-100">
                            <Utensils className="h-5 w-5 text-lime-600" />
                            <h4 className="font-semibold text-forest-900 text-sm">Dieta</h4>
                            {diet.language && diet.language !== 'es' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-100 text-lime-800 uppercase font-medium">
                                {diet.language}
                              </span>
                            )}
                          </div>
                          <p className="text-forest-700 text-sm leading-relaxed">{diet.text}</p>
                        </div>
                      )}

                      {/* Historia Natural */}
                      {naturalHistory && (
                        <div className="col-span-full space-y-2">
                          <div className="flex items-center gap-2 pb-2 border-b border-lime-100">
                            <BookOpen className="h-5 w-5 text-lime-600" />
                            <h4 className="font-semibold text-forest-900 text-sm">Historia Natural</h4>
                            {naturalHistory.language && naturalHistory.language !== 'es' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-100 text-lime-800 uppercase font-medium">
                                {naturalHistory.language}
                              </span>
                            )}
                          </div>
                          <p className="text-forest-700 text-sm leading-relaxed">{naturalHistory.text}</p>
                        </div>
                      )}

                      {/* Ecología y comportamiento */}
                      {ecology && !isDuplicateText(ecology.text, summary) && !isDuplicateText(ecology.text, naturalHistory?.text) && (
                        <div className="col-span-full space-y-2">
                          <div className="flex items-center gap-2 pb-2 border-b border-lime-100">
                            <BookOpen className="h-5 w-5 text-lime-600" />
                            <h4 className="font-semibold text-forest-900 text-sm">Ecología y comportamiento</h4>
                            {ecology.language && ecology.language !== 'es' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-100 text-lime-800 uppercase font-medium">
                                {ecology.language}
                              </span>
                            )}
                          </div>
                          <p className="text-forest-700 text-sm leading-relaxed">{ecology.text}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-forest-600 text-sm">
                      Aún no hay información ecológica verificable para esta especie.
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="atribution" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-6">
                <div className="space-y-6">

                  {/* Créditos de información ecológica (EOL) */}
                  {ecologyProfile && (
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-3 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-lime-500" />
                        Créditos de información ecológica (Encyclopedia of Life)
                      </h3>
                      <div className="bg-lime-50/70 border border-lime-200/80 rounded-xl p-4 space-y-3">
                        {ecologicalRole && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Rol ecológico: </span>
                            {ecologicalRole.provider || 'Encyclopedia of Life'}
                            {ecologicalRole.license && (
                              <span className="text-forest-600 ml-1">({ecologicalRole.license})</span>
                            )}
                          </div>
                        )}
                        {habitat?.provider && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Datos de hábitat: </span>
                            {habitat.provider}
                            {habitat.rights_holder && ` · ${habitat.rights_holder}`}
                            {habitat.license && <span className="text-forest-600 ml-1">({habitat.license})</span>}
                          </div>
                        )}
                        {diet?.provider && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Datos de dieta: </span>
                            {diet.provider}
                            {diet.rights_holder && ` · ${diet.rights_holder}`}
                            {diet.license && <span className="text-forest-600 ml-1">({diet.license})</span>}
                          </div>
                        )}
                        {naturalHistory?.provider && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Historia natural: </span>
                            {naturalHistory.provider}
                            {naturalHistory.rights_holder && ` · ${naturalHistory.rights_holder}`}
                            {naturalHistory.license && <span className="text-forest-600 ml-1">({naturalHistory.license})</span>}
                          </div>
                        )}
                        {ecologyProfile.eol_url && (
                          <div className="pt-1">
                            <a
                              href={ecologyProfile.eol_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-lime-700 hover:text-lime-900 underline inline-flex items-center gap-1"
                            >
                              Ver ficha completa en Encyclopedia of Life (EOL)
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cita bibliográfica / Inventario local */}
                  {(species.attribution || species.taxon_author || species.inventory_author || (species.local_records_count != null && species.local_records_count > 0)) && (
                    <div>
                      <h3 className="font-semibold text-forest-900 mb-3 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-forest-500" />
                        Inventario y registro local
                      </h3>
                      <div className="bg-forest-50/50 border border-forest-100 rounded-xl p-4 space-y-3">
                        {species.attribution && (
                          <blockquote className="border-l-3 border-lime-500 pl-3 py-1">
                            <p className="text-forest-800 text-xs italic leading-relaxed">
                              {species.attribution}
                            </p>
                          </blockquote>
                        )}
                        {species.taxon_author && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Autor de la descripción: </span>
                            {species.taxon_author}
                          </div>
                        )}
                        {species.inventory_author && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Registrado por: </span>
                            {species.inventory_author}
                          </div>
                        )}
                        {species.local_records_count != null && species.local_records_count > 0 && (
                          <div className="text-xs text-forest-800">
                            <span className="font-semibold text-forest-900">Registros en campus: </span>
                            {species.local_records_count} {species.local_records_count === 1 ? 'registro documentado' : 'registros documentados'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <hr className="border-lime-100" />

                  {/* Fuentes externas */}
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-3 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      Consultar en fuentes externas
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Enlace a iNaturalist */}
                      <a
                        href={species.inaturalist_id 
                          ? `https://www.inaturalist.org/taxa/${species.inaturalist_id}` 
                          : `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(species.scientific_name)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        </svg>
                        Ver en iNaturalist
                      </a>

                      {/* Wikipedia si disponible */}
                      {species.wikipedia_url && (
                        <a
                          href={species.wikipedia_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-forest-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                          </svg>
                          Wikipedia
                        </a>
                      )}

                      <a
                        href={ecologyProfile?.eol_url || `https://eol.org/search?q=${encodeURIComponent(species.scientific_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-lime-300 text-forest-700 text-sm font-medium hover:bg-lime-50 transition-colors shadow-sm"
                      >
                        <TreePine className="h-4 w-4 text-lime-600" />
                        Encyclopedia of Life
                      </a>
                    </div>
                  </div>

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
              )?.external_id || species?.inaturalist_id || species?.inat_taxon_id || species?.id;

              return (
                <SpeciesDistributionMap
                  taxonId={externalId}
                  speciesName={displayCommonName}
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
                  <Link key={index} to={`/taxa/${similar.id}`}>
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

      {/* Recent Observations */}
      <RecentObservations taxonId={Number(id)} speciesName={displayCommonName} />

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
                alt={displayCommonName}
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
