import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, Camera, Search, Loader2, CheckCircle2,
  X, Calendar, Upload, Leaf, Star, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { taxonService, Taxon } from "@/api/services/TaxonService";
import { observationService } from "@/api/services/ObservationService";
import LocationMapModal from "@/components/observations/LocationMapModal";
import { getStorageUrl } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatISOToLocalDatetime(isoString: string | null): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
    <div className="relative group">
      <img
        src={url}
        alt={`Nueva Foto ${index + 1}`}
        className="h-24 w-24 object-cover rounded-xl border-2 border-dashed border-lime-300"
      />
      <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-[8px] rounded px-1 font-semibold">
        Nueva
      </span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export const ObservationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de carga e integridad
  const [loadingObs, setLoadingObs] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Especie
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesResults, setSpeciesResults] = useState<Taxon[]>([]);
  const [searchingSpecies, setSearchingSpecies] = useState(false);
  const [selectedTaxon, setSelectedTaxon] = useState<Taxon | null>(null);

  // Formulario de edición
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [locationName, setLocationName] = useState("");
  const [observedAt, setObservedAt] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Fotos existentes y nuevas
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  // Estados del mapa y de envío
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Cargar Observación Original ──────────────────────────────────────────
  useEffect(() => {
    const fetchObservation = async () => {
      if (!id) return;
      try {
        setLoadingObs(true);
        const obs = await observationService.getById(id);
        if (!obs) {
          toast({
            title: "Observación no encontrada",
            description: "No se pudo recuperar los detalles de este avistamiento.",
            variant: "destructive",
          });
          navigate("/sightings");
          return;
        }

        // Validar si el usuario autenticado es el propietario
        if (obs.user_id !== currentUser?.id) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para modificar este avistamiento.",
            variant: "destructive",
          });
          navigate(`/observations/${id}`);
          return;
        }

        setIsOwner(true);
        // Cargar datos en el formulario
        setLatitude(obs.latitude != null ? String(obs.latitude) : "");
        setLongitude(obs.longitude != null ? String(obs.longitude) : "");
        setLocationName(obs.location_name || "");
        setObservedAt(formatISOToLocalDatetime(obs.observed_at || obs.created_at));
        setDescription(obs.description || "");
        setNotes(obs.notes || "");
        setIsPublic(obs.is_public);
        setExistingPhotos(obs.photos || []);

        if (obs.taxon) {
          setSelectedTaxon({
            id: obs.taxon.id,
            name: obs.taxon.common_name || obs.taxon.scientific_name,
            scientific_name: obs.taxon.scientific_name,
            common_name: obs.taxon.common_name,
          });
          setSpeciesQuery(obs.taxon.common_name || obs.taxon.scientific_name);
        }
      } catch (err) {
        toast({
          title: "Error al cargar la observación",
          description: "Ocurrió un problema de conexión al cargar la información.",
          variant: "destructive",
        });
        navigate("/sightings");
      } finally {
        setLoadingObs(false);
      }
    };

    if (currentUser) {
      fetchObservation();
    }
  }, [id, currentUser, navigate, toast]);

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
      description: "Coordenadas actualizadas en el formulario.",
    });
  };

  // ── Manejo de fotos existentes y nuevas ──────────────────────────────────
  const handleMarkPhotoForDeletion = (photoId: number) => {
    setPhotosToDelete((prev) => [...prev, photoId]);
    setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast({
      title: "Foto marcada para eliminar",
      description: "La foto se borrará al guardar los cambios del formulario.",
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrent = existingPhotos.length + newPhotos.length;
    const remaining = 5 - totalCurrent;
    const toAdd = files.slice(0, remaining);
    setNewPhotos((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const handleRemoveNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Envío del formulario ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !id) return;

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
      const response = await observationService.update(id, {
        taxon_id: selectedTaxon?.id ?? null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location_name: locationName || undefined,
        observed_at: observedAt ? new Date(observedAt).toISOString() : undefined,
        description: description || undefined,
        notes: notes || undefined,
        is_public: isPublic,
        photos: newPhotos.length > 0 ? newPhotos : undefined,
        delete_photos: photosToDelete.length > 0 ? photosToDelete : undefined,
      });

      if (response.success) {
        setSubmitted(true);
        toast({
          title: "¡Cambios guardados!",
          description: "La observación ha sido modificada correctamente.",
        });
        setTimeout(() => navigate(`/observations/${id}`), 2000);
      } else {
        throw new Error(response.message || "Fallo al guardar.");
      }
    } catch (err: any) {
      toast({
        title: "Error al actualizar el avistamiento",
        description: err?.message || "Intenta de nuevo en unos momentos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingObs) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-forest-750 font-medium flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-600 animate-ping" />
          Cargando datos de la observación...
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return null; // Redirección ya ejecutada en useEffect
  }

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
        <h2 className="text-2xl font-bold text-forest-900">¡Observación modificada!</h2>
        <p className="text-sm text-forest-550">Redirigiendo a los detalles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={`/observations/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-lime-50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-forest-950 font-heading">Editar Avistamiento</h1>
          <p className="text-sm text-forest-600">Modifica los detalles y ubicación de tu observación</p>
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

          <div
            onClick={() => setMapModalOpen(true)}
            className="border-2 border-dashed border-lime-250 hover:border-lime-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-lime-50/10 hover:bg-lime-50/30 flex flex-col items-center justify-center gap-3 group"
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
                Haz clic para mover el pin o buscar la dirección exacta
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-forest-700 mb-1 block">Nombre descriptivo del lugar</label>
              <Input
                placeholder="Ej: Jardín Botánico UNAL La Paz"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="border-lime-200 focus:border-lime-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-forest-700 mb-1 block">Latitud</label>
                <Input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="border-lime-200 focus:border-lime-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-forest-700 mb-1 block">Longitud</label>
                <Input
                  type="number"
                  step="any"
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
              placeholder="¿Qué viste? Describe comportamiento, entorno..."
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
              placeholder="Notas de referencia privada..."
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
            <h2 className="font-semibold text-forest-900">Fotos de evidencia</h2>
            <Badge variant="outline" className="ml-auto text-xs bg-lime-50/50">
              {existingPhotos.length + newPhotos.length}/5
            </Badge>
          </div>

          {/* Fotos Existentes */}
          {existingPhotos.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wider block">Fotos guardadas</span>
              <div className="flex flex-wrap gap-3">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={getStorageUrl(photo.photo_url)}
                      alt="Existente"
                      className="h-24 w-24 object-cover rounded-xl border border-lime-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleMarkPhotoForDeletion(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow shadow-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevas Fotos */}
          {newPhotos.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wider block">Nuevas fotos</span>
              <div className="flex flex-wrap gap-3">
                {newPhotos.map((file, i) => (
                  <PhotoPreview key={i} file={file} index={i} onRemove={handleRemoveNewPhoto} />
                ))}
              </div>
            </div>
          )}

          {existingPhotos.length + newPhotos.length < 5 && (
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
                className="w-full gap-2 border-dashed border-lime-300 text-lime-700 hover:bg-lime-50 h-16 rounded-xl"
              >
                <Upload className="h-5 w-5" />
                Agregar más fotos
              </Button>
            </>
          )}
        </Card>

        {/* Guardar cambios */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white h-12 text-base font-semibold rounded-xl gap-2 shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Guardando cambios...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Guardar Cambios
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

export default ObservationEdit;
