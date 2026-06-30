import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import type { LaravelValidationError } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, Camera, Search, Loader2, CheckCircle2,
  X, Calendar, Upload, Leaf, Star, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { taxonService, Taxon } from "@/api/services/TaxonService";
import { observationService } from "@/api/services/ObservationService";
import LocationMapModal from "@/components/observations/LocationMapModal";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatLocalDatetime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    console.error("API error response:", error.response.data);
    const data = error.response.data as LaravelValidationError | { message?: string; errors?: Record<string, string[]> };
    if (data.errors) {
      return Object.values(data.errors).flat().join(' ') || data.message || "Error de validación en los datos.";
    }
    if (data.message) {
      return data.message;
    }
  }
  return (error as any)?.message || "Intenta nuevamente.";
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

const PhotoPreview = ({
  file,
  index,
  onRemove,
}: {
  file: File;
  index: number;
  onRemove: (i: number) => void;
}) => {
  const url = URL.createObjectURL(file);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group"
    >
      <img
        src={url}
        alt={`Foto ${index + 1}`}
        className="h-24 w-24 object-cover rounded-xl border-2 border-lime-200"
      />
      {index === 0 && (
        <span className="absolute bottom-1 left-1 bg-lime-500 text-white text-[10px] rounded px-1 font-semibold">
          Principal
        </span>
      )}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

// ── Página principal ───────────────────────────────────────────────────────

export const ObservationCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Búsqueda de especie
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesResults, setSpeciesResults] = useState<Taxon[]>([]);
  const [searchingSpecies, setSearchingSpecies] = useState(false);
  const [selectedTaxon, setSelectedTaxon] = useState<Taxon | null>(null);

  // Formulario
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [locationName, setLocationName] = useState("");
  const [observedAt, setObservedAt] = useState(formatLocalDatetime(new Date()));
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  // Estado de envío e interacción
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(50);

  // ── Búsqueda de especie con debounce ────────────────────────────────────
  useEffect(() => {
    if (!speciesQuery.trim() || selectedTaxon) {
      setSpeciesResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingSpecies(true);
      try {
        const res = await taxonService.searchTaxa(speciesQuery, { per_page: 8 });
        setSpeciesResults(res.data || []);
      } catch {
        setSpeciesResults([]);
      } finally {
        setSearchingSpecies(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [speciesQuery, selectedTaxon]);

  const handleSelectTaxon = (t: Taxon) => {
    setSelectedTaxon(t);
    setSpeciesQuery(t.common_name || t.scientific_name);
    setSpeciesResults([]);
  };

  const handleClearTaxon = () => {
    setSelectedTaxon(null);
    setSpeciesQuery("");
  };

  // ── Confirmar coordenadas desde el Mapa ──────────────────────────────────
  const handleMapConfirm = (coords: { lat: number; lng: number; address?: string }) => {
    setLatitude(String(coords.lat.toFixed(6)));
    setLongitude(String(coords.lng.toFixed(6)));
    if (coords.address) {
      setLocationName(coords.address);
    }
    toast({
      title: "📍 Ubicación guardada",
      description: "Coordenadas y dirección actualizadas en el formulario.",
    });
  };

  // ── Fotos ───────────────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Envío del formulario ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!latitude || !longitude) {
      toast({
        title: "Ubicación requerida",
        description: "Por favor, selecciona una ubicación en el mapa.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await observationService.create({
        taxon_id: selectedTaxon?.id ?? null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location_name: locationName || undefined,
        observed_at: observedAt ? new Date(observedAt).toISOString() : undefined,
        description: description || undefined,
        notes: notes || undefined,
        is_public: isPublic,
        photos: photos.length > 0 ? photos : undefined,
      });

      if (response.success) {
        setPointsEarned(response.data?.points_awarded || 50);
        setSubmitted(true);
        setTimeout(() => navigate("/sightings"), 3000);
      } else {
        throw new Error(response.message || "Fallo al guardar.");
      }
    } catch (err: unknown) {
      toast({
        title: "Error al registrar el avistamiento",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Pantalla de éxito ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="h-24 w-24 text-lime-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-forest-900">¡Avistamiento registrado!</h2>
        <p className="text-forest-600 flex items-center gap-1.5 bg-lime-50 border border-lime-150 px-4 py-2 rounded-full font-medium">
          <Sparkles className="h-4 w-4 text-lime-600 fill-current" />
          Has ganado <span className="font-bold text-lime-650">{pointsEarned} puntos</span> 🎉
        </p>
        <p className="text-sm text-forest-500">Redirigiendo a tus avistamientos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/sightings">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-lime-50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-forest-950 font-heading">Nuevo Avistamiento</h1>
          <p className="text-sm text-forest-600">Registra una especie que observaste en el campus</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Especie */}
        <Card className="p-5 space-y-3 border-lime-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Especie observada</h2>
            <Badge variant="outline" className="ml-auto text-xs bg-lime-50/50">Opcional</Badge>
          </div>

          {selectedTaxon ? (
            <div className="flex items-center gap-3 p-3 bg-lime-50/50 rounded-xl border border-lime-200">
              {selectedTaxon.default_photo?.url && (
                <img
                  src={selectedTaxon.default_photo.url}
                  alt={selectedTaxon.scientific_name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-forest-900 truncate">
                  {selectedTaxon.common_name || selectedTaxon.scientific_name}
                </p>
                <p className="text-xs text-forest-600 italic truncate">{selectedTaxon.scientific_name}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={handleClearTaxon} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
              <Input
                id="species-search"
                placeholder="Buscar especie por nombre común o científico..."
                value={speciesQuery}
                onChange={(e) => setSpeciesQuery(e.target.value)}
                className="pl-9 border-lime-200 focus:border-lime-400 bg-white"
                autoComplete="off"
              />
              {searchingSpecies && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-lime-500" />
              )}

              <AnimatePresence>
                {speciesResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-20 w-full mt-1 bg-white border border-lime-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    {speciesResults.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTaxon(t)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-lime-50 transition-colors text-left"
                      >
                        {t.default_photo?.url ? (
                          <img src={t.default_photo.url} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-lime-100 flex items-center justify-center shrink-0">
                            <Leaf className="h-5 w-5 text-lime-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-forest-900 truncate">
                            {t.common_name || t.scientific_name}
                          </p>
                          <p className="text-xs text-forest-500 italic truncate">{t.scientific_name}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Card>

        {/* Ubicación con Mapa */}
        <Card className="p-5 space-y-4 border-lime-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Ubicación Geográfica</h2>
          </div>

          {/* Trigger Modal Mapa */}
          <div
            onClick={() => setMapModalOpen(true)}
            className="border-2 border-dashed border-lime-200 hover:border-lime-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-lime-50/10 hover:bg-lime-50/30 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="bg-lime-100 text-lime-700 p-3.5 rounded-full group-hover:scale-110 transition-transform shadow-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-sm text-forest-950 block">
                {latitude && longitude
                  ? "Modificar ubicación en el mapa"
                  : "Seleccionar ubicación en el mapa"}
              </span>
              <span className="text-xs text-forest-600 block">
                Permite geolocalizarte u obtener coordenadas haciendo clic
              </span>
            </div>
          </div>

          {/* Campos de Ubicación (Llenado automático/manual) */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-forest-700 mb-1 block">Nombre descriptivo del lugar</label>
              <Input
                id="location-name"
                placeholder="Ej: Jardín Botánico UNAL La Paz o dirección"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="border-lime-200 focus:border-lime-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-forest-700 mb-1 block">Latitud</label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Ej: 10.9685"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="border-lime-200 focus:border-lime-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-forest-700 mb-1 block">Longitud</label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Ej: -74.7890"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="border-lime-200 focus:border-lime-400 bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Fecha y hora */}
        <Card className="p-5 space-y-3 border-lime-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Fecha y hora de observación</h2>
          </div>
          <Input
            id="observed-at"
            type="datetime-local"
            value={observedAt}
            onChange={(e) => setObservedAt(e.target.value)}
            className="border-lime-200 focus:border-lime-400 bg-white"
          />
        </Card>

        {/* Descripción y notas */}
        <Card className="p-5 space-y-4 border-lime-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Notas de campo</h2>
          </div>
          <div>
            <label className="text-xs font-semibold text-forest-700 mb-1 block">Descripción del avistamiento</label>
            <Textarea
              id="description"
              placeholder="¿Qué viste? Describe el comportamiento, cantidad de aves, clima o entorno..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-lime-200 focus:border-lime-400 min-h-[100px] bg-white resize-none"
              maxLength={2000}
            />
            <p className="text-[10px] text-forest-500 mt-1 text-right">{description.length}/2000</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-forest-700 mb-1 block">Notas de uso personal (privadas)</label>
            <Textarea
              id="notes"
              placeholder="Detalles confidenciales para tu propia referencia..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-lime-200 focus:border-lime-400 min-h-[70px] bg-white resize-none"
              maxLength={1000}
            />
          </div>
        </Card>

        {/* Fotos */}
        <Card className="p-5 space-y-4 border-lime-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Evidencia fotográfica</h2>
            <Badge variant="outline" className="ml-auto text-xs bg-lime-50/50">{photos.length}/5</Badge>
          </div>

          <AnimatePresence>
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-3"
              >
                {photos.map((file, i) => (
                  <PhotoPreview key={i} file={file} index={i} onRemove={handleRemovePhoto} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {photos.length < 5 && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2 border-dashed border-lime-300 text-lime-700 hover:bg-lime-50 h-16 rounded-xl transition-all"
              >
                <Upload className="h-5 w-5" />
                {photos.length === 0 ? "Subir fotos de evidencia" : "Agregar más fotos"}
              </Button>
            </>
          )}
        </Card>

        {/* Enviar */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white h-12 text-base font-semibold rounded-xl gap-2 shadow-sm transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando avistamiento...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Registrar Avistamiento (+50 pts)
            </>
          )}
        </Button>
      </form>

      {/* Modal interactivo de Mapa */}
      <LocationMapModal
        open={mapModalOpen}
        onOpenChange={setMapModalOpen}
        initialLat={latitude ? parseFloat(latitude) : null}
        initialLng={longitude ? parseFloat(longitude) : null}
        initialLocationName={locationName}
        onConfirm={handleMapConfirm}
      />
    </div>
  );
};

export default ObservationCreate;
