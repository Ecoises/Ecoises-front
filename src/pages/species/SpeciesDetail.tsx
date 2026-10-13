"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft, Utensils, Eye, Info, TreePine, Sparkles, Loader2, X, Maximize2, User, BookOpen, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useSpeciesDetail, useRelatedSpecies } from "@/hooks/useSpecies"
import SpeciesDistributionMap from "@/components/maps/SpeciesDistributionMap"
import { AnimatePresence, motion } from "framer-motion"
import TaxonomyGame from "@/components/species/TaxonomyGame"
import EcologicalImportanceCard, { type EcologyDetail } from "@/components/species/EcologicalImportanceCard";
import ConservationBadges from "@/components/species/ConservationBadges";
import { useIsDesktop } from "@/hooks/use-mobile"
import SpeciesAttribution from "@/components/species/SpeciesAttribution"
import { providerName } from "@/lib/sources"


const SpeciesDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();
  const location = useLocation();
  const { data: species, isLoading, isError } = useSpeciesDetail(id!, { enabled: !!id });
  const { data: relatedSpecies, isLoading: isLoadingRelated } = useRelatedSpecies(id!, { enabled: !!id });
  const [activeImage, setActiveImage] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const isDesktop = useIsDesktop();

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
  const inatSummary = species.api_references?.find((ref: any) => ref.api_source === 'inaturalist')?.data?.wikipedia_summary;
  const summarySource = inatSummary
    ? 'Wikipedia, vía iNaturalist'
    : species.wikipedia_summary
      ? 'Wikipedia'
      : eolSummary?.text
        ? providerName(eolSummary.provider || 'Encyclopedia of Life')
        : null;
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
    if (minimumLength >= 120 && (normalizedFirst.includes(normalizedSecond) || normalizedSecond.includes(normalizedFirst))) {
      return true;
    }

    // Casi el mismo texto (p. ej. el mismo párrafo de Wikipedia con un nombre común
    // más): 70 % o más de las palabras del texto corto aparecen en el otro.
    const words = (text: string) => new Set(text.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 3));
    const [shorter, longer] = [words(normalizedFirst), words(normalizedSecond)].sort((x, y) => x.size - y.size);
    if (shorter.size < 8) return false;
    const shared = [...shorter].filter((word) => longer.has(word)).length;
    return shared / shorter.size >= 0.7;
  };
  const naturalHistoryCandidate = ecologyProfile?.natural_history || null;
  const naturalHistory = naturalHistoryCandidate && !isDuplicateText(naturalHistoryCandidate.text, summary)
    ? naturalHistoryCandidate
    : null;

  const ecologicalHighlight = ecologicalRole;

  // Hábitat, dieta y comportamiento van dentro de "Importancia ecológica"
  // (antes en una pestaña aparte), sin repetir lo que ya dice el resumen.
  const ecologyDetails = [
    habitat && { key: 'habitat', label: 'Hábitat', text: habitat.text, icon: TreePine },
    diet && { key: 'diet', label: 'Dieta', text: diet.text, icon: Utensils },
    naturalHistory && { key: 'natural_history', label: 'Historia natural', text: naturalHistory.text, icon: BookOpen },
    ecology && { key: 'ecology', label: 'Ecología y comportamiento', text: ecology.text, icon: BookOpen },
  ].filter((detail): detail is EcologyDetail =>
    !!detail && !!detail.text && !isDuplicateText(detail.text, summary) && !isDuplicateText(detail.text, species.ecology_text?.text)
  );

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

  // Mapa y especies similares: en escritorio van bajo la foto; en el celular,
  // el mapa va después del resumen y las similares al final.
  const mapSection = (
    <section aria-labelledby="species-map-title">
      <h2 id="species-map-title" className="text-2xl font-bold text-forest-950 mb-4">Mapa de ocurrencias</h2>
      <div className="h-[360px] w-full relative">
        <SpeciesDistributionMap
          gbifKey={species?.gbif_taxon_key}
          inatId={species?.inaturalist_id || species?.inat_taxon_id}
          speciesName={displayCommonName}
        />
      </div>
    </section>
  );

  const similarSection = (
    <section aria-labelledby="species-similar-title">
      <h2 id="species-similar-title" className="text-2xl font-bold text-forest-950 mb-4">Especies Similares</h2>
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
    </section>
  );

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
        {/* Columna izquierda: lo visual (foto, mapa y similares) */}
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

          {isDesktop && <div className="space-y-8 pt-4">{mapSection}{similarSection}</div>}
        </div>

        {/* Columna derecha: lo que se lee */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-950 mb-1 capitalize">{displayCommonName}</h1>
            <p className="text-forest-700 italic mb-4">{species.scientific_name}</p>

            <ConservationBadges labels={species.labels} />

            {(() => {
              if (summary && summary.trim() !== '') {
                return (
                  <div className="mb-6">
                    <div
                      className={`text-forest-800 text-justify prose prose-sm max-w-none prose-lime ${
                        isSummaryExpanded ? '' : 'line-clamp-3'
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

            {!isDesktop && <div className="mb-6">{mapSection}</div>}

            {species.ecological_importance || species.ecology_text || ecologyDetails.length > 0 ? (
              <EcologicalImportanceCard data={species.ecological_importance} text={species.ecology_text} details={ecologyDetails} />
            ) : ecologicalHighlight && (
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
            <TabsList className="bg-lime-50 p-1 rounded-xl w-full grid grid-cols-2">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:bg-white font-medium">
                Taxonomía
              </TabsTrigger>
              <TabsTrigger value="atribution" className="rounded-lg data-[state=active]:bg-white font-medium">
                Atribución
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="animate-fade-in mt-4">
              <Card className="border-lime-200 p-4">
                <TaxonomyGame species={species} />
                {species.taxonomy_source && (
                  <p className="mt-3 text-xs text-forest-600">Clasificación según {species.taxonomy_source}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="atribution" className="animate-fade-in mt-4">
              <SpeciesAttribution
                scientificName={species.scientific_name}
                labels={species.labels}
                ecologyText={species.ecology_text}
                ecologicalImportance={species.ecological_importance}
                summarySource={summarySource}
                ecologyTexts={[
                  { label: 'Hábitat', data: habitat },
                  { label: 'Dieta', data: diet },
                  { label: 'Historia natural', data: naturalHistory },
                  { label: 'Ecología y comportamiento', data: ecology },
                ].filter(({ label }) => ecologyDetails.some((detail) => detail.label === label))}
                taxonomySource={species.taxonomy_source}
                hasPhotos={gallery.length > 0 || !!defaultPhoto}
                gbifKey={species.gbif_taxon_key}
                inatId={species.inaturalist_id || species.inat_taxon_id}
                wikipediaUrl={species.wikipedia_url}
                eolUrl={ecologyProfile?.eol_url}
                local={{
                  attribution: species.attribution,
                  taxonAuthor: species.taxon_author,
                  inventoryAuthor: species.inventory_author,
                  records: species.local_records_count,
                }}
              />
            </TabsContent>

          </Tabs>

          {!isDesktop && similarSection}
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
