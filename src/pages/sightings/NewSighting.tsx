import { useState, useRef, useCallback, useEffect } from "react";
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
  X, LocateFixed, Calendar, Upload, Leaf, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { taxonService, Taxon } from "@/api/services/TaxonService";
import { observationService } from "@/api/services/ObservationService";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatLocalDatetime(date: Date): string {
  // Formato ISO sin zona horaria para el input datetime-local
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

const NewSighting = () => {
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

  // Estado de envío
  const [submitting, setSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // ── Geolocalización ─────────────────────────────────────────────────────
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocalización no disponible", variant: "destructive" });
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude.toFixed(6)));
        setLongitude(String(pos.coords.longitude.toFixed(6)));
        setGettingLocation(false);
        toast({ title: "📍 Ubicación obtenida", description: "Coordenadas actualizadas." });
      },
      () => {
        setGettingLocation(false);
        toast({ title: "No se pudo obtener la ubicación", variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [toast]);

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

    setSubmitting(true);
    try {
      await observationService.create({
        taxon_id: selectedTaxon?.id ?? null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        location_name: locationName || undefined,
        observed_at: observedAt ? new Date(observedAt).toISOString() : undefined,
        description: description || undefined,
        notes: notes || undefined,
        is_public: isPublic,
        photos: photos.length > 0 ? photos : undefined,
      });

      setSubmitted(true);
      setTimeout(() => navigate("/sightings"), 2000);
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
        <p className="text-forest-600">Has ganado <span className="font-bold text-lime-600">50 puntos</span> 🎉</p>
        <p className="text-sm text-forest-500">Redirigiendo a tus avistamientos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/sightings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-forest-950">Nuevo Avistamiento</h1>
          <p className="text-sm text-forest-600">Registra una especie que observaste</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Especie */}
        <Card className="p-5 space-y-3 border-lime-200">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Especie observada</h2>
            <Badge variant="outline" className="ml-auto text-xs">Opcional</Badge>
          </div>

          {selectedTaxon ? (
            <div className="flex items-center gap-3 p-3 bg-lime-50 rounded-xl border border-lime-200">
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
                placeholder="Buscar especie por nombre..."
                value={speciesQuery}
                onChange={(e) => setSpeciesQuery(e.target.value)}
                className="pl-9 border-lime-200 focus:border-lime-400"
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

        {/* Ubicación */}
        <Card className="p-5 space-y-4 border-lime-200">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Ubicación</h2>
          </div>

          <div>
            <label className="text-sm text-forest-700 mb-1 block">Nombre del lugar</label>
            <Input
              id="location-name"
              placeholder="Ej: Jardín Botánico UNAL La Paz"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="border-lime-200 focus:border-lime-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-forest-700 mb-1 block">Latitud</label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="10.9685"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="border-lime-200 focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-sm text-forest-700 mb-1 block">Longitud</label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-74.7890"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="border-lime-200 focus:border-lime-400"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={gettingLocation}
            className="w-full gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
          >
            {gettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            Obtener coordenadas actuales
          </Button>
        </Card>

        {/* Fecha y hora */}
        <Card className="p-5 space-y-3 border-lime-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Fecha y hora</h2>
          </div>
          <Input
            id="observed-at"
            type="datetime-local"
            value={observedAt}
            onChange={(e) => setObservedAt(e.target.value)}
            className="border-lime-200 focus:border-lime-400"
          />
        </Card>

        {/* Descripción */}
        <Card className="p-5 space-y-4 border-lime-200">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Notas del avistamiento</h2>
          </div>
          <div>
            <label className="text-sm text-forest-700 mb-1 block">Descripción</label>
            <Textarea
              id="description"
              placeholder="¿Qué observaste? Comportamiento, cantidad, condiciones del lugar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-lime-200 focus:border-lime-400 min-h-[100px]"
              maxLength={2000}
            />
            <p className="text-xs text-forest-500 mt-1 text-right">{description.length}/2000</p>
          </div>
          <div>
            <label className="text-sm text-forest-700 mb-1 block">Notas internas (privadas)</label>
            <Textarea
              id="notes"
              placeholder="Notas personales para tu referencia..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-lime-200 focus:border-lime-400 min-h-[70px]"
              maxLength={1000}
            />
          </div>
        </Card>

        {/* Fotos */}
        <Card className="p-5 space-y-4 border-lime-200">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-4 w-4 text-lime-600" />
            <h2 className="font-semibold text-forest-900">Fotos</h2>
            <Badge variant="outline" className="ml-auto text-xs">{photos.length}/5</Badge>
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
                className="w-full gap-2 border-dashed border-lime-300 text-lime-700 hover:bg-lime-50 h-16"
              >
                <Upload className="h-5 w-5" />
                {photos.length === 0 ? "Agregar fotos de evidencia" : "Agregar más fotos"}
              </Button>
            </>
          )}
        </Card>

        {/* Enviar */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white h-12 text-base font-semibold rounded-xl gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrando avistamiento...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Registrar Avistamiento (+50 pts)
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewSighting;
