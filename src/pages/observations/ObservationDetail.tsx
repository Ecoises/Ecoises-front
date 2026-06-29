import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Calendar, Clock, Heart, MessageCircle, Send, Star, Cloud, Eye, NotepadText, Share2, Music, Sparkles, X, Maximize2, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Observation, Comment, ApiObservation, ObservationPhoto } from "@/types/observation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import RecentObservations from "@/components/observations/RecentObservations";
import { observationService } from "@/api/services/ObservationService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AnimatePresence, motion } from "framer-motion";
import ReportModal from "@/components/observations/ReportModal";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ExtendedObservation extends Observation {
  points_awarded?: number;
  latitude?: number | null;
  longitude?: number | null;
  photos?: ObservationPhoto[];
}

// Convierte ApiObservation → formato Observation que usa el render
function mapApiToObservation(api: ApiObservation): ExtendedObservation {
  const primaryPhoto = api.photos?.find((p) => p.is_primary) ?? api.photos?.[0];
  const observedDate = api.observed_at ? new Date(api.observed_at) : new Date(api.created_at);

  return {
    id: api.id,
    species_name: api.taxon?.common_name || api.taxon?.scientific_name || "Especie no identificada",
    scientific_name: api.taxon?.scientific_name,
    points_awarded: api.points_awarded,
    image: primaryPhoto?.photo_url || "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=800",
    location: api.location_name || (api.latitude != null ? `${api.latitude?.toFixed(4)}, ${api.longitude?.toFixed(4)}` : "Ubicación no registrada"),
    date: observedDate.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
    time: observedDate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    user: {
      id: api.user?.id ?? 0,
      name: api.user?.name ?? "Usuario",
      avatar: api.user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(api.user?.name ?? "U")}&background=84cc16&color=fff`,
    },
    description: api.description || "",
    notes: api.notes || undefined,
    is_favorite: false,
    comments: (api.comments ?? []).map((c: any) => ({
      id: c.id,
      user: {
        id: c.user?.id ?? 0,
        name: c.user?.name ?? "Usuario",
        avatar: c.user?.avatar ?? "",
      },
      content: c.content ?? "",
      created_at: c.created_at ?? new Date().toISOString(),
    })),
    photos: api.photos || [],
    latitude: api.latitude,
    longitude: api.longitude,
  };
}

// Componente para un comentario individual
const CommentItem = ({ comment }: { comment: Comment }) => {
  const formattedDate = useMemo(() => {
    return new Date(comment.created_at).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [comment.created_at]);

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 border border-lime-200">
          <AvatarImage src={comment.user.avatar} alt={`${comment.user.name} avatar`} />
          <AvatarFallback className="bg-lime-50 text-lime-700 font-bold text-xs">{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-forest-900">{comment.user.name}</span>
            <span className="text-[10px] font-medium text-forest-500 bg-lime-50 px-2 py-0.5 rounded-full">{formattedDate}</span>
          </div>
          <p className="text-sm text-forest-800 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

const ObservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [observation, setObservation] = useState<ExtendedObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeImage, setActiveImage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Acciones y modales
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { toast } = useToast();

  const handleDelete = async () => {
    if (!id || deleting) return;
    setDeleting(true);
    try {
      const response = await observationService.delete(id);
      if (response.success) {
        toast({
          title: "Observación eliminada",
          description: "El avistamiento ha sido eliminado de la base de datos.",
        });
        navigate("/sightings");
      } else {
        throw new Error(response.message || "No se pudo eliminar.");
      }
    } catch (err: any) {
      toast({
        title: "Error al eliminar",
        description: err?.message || "No se pudo eliminar el registro.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Cerrar con tecla escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const loadObservation = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("ID de observación no válido");

        const apiObs = await observationService.getById(id);
        if (!apiObs) throw new Error("Observación no encontrada");

        const mapped = mapApiToObservation(apiObs);
        setObservation(mapped);
        setIsFavorite(false);
        setComments(mapped.comments || []);

        // Establecer imagen activa inicial
        const primaryPhoto = apiObs.photos?.find((p) => p.is_primary) ?? apiObs.photos?.[0];
        setActiveImage(primaryPhoto?.photo_url || "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=800");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar la observación");
      } finally {
        setLoading(false);
      }
    };

    loadObservation();
  }, [id]);

  const handleToggleFavorite = useCallback(async () => {
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);
    
    try {
      toast({
        title: !previousState ? "Guardado en favoritos" : "Quitado de favoritos",
        description: !previousState 
          ? "El avistamiento ha sido añadido a tus favoritos" 
          : "El avistamiento ha sido removido de tus favoritos",
      });
    } catch (error) {
      setIsFavorite(previousState);
      toast({
        title: "Error",
        description: "No se pudo actualizar los favoritos. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  }, [isFavorite, toast]);

  const handleAddComment = useCallback(async () => {
    const trimmedComment = newComment.trim();
    
    if (!trimmedComment || trimmedComment.length > 500) return;

    const tempComment: Comment = {
      id: Date.now(),
      user: {
        id: currentUser?.id ?? 999,
        name: currentUser?.full_name ?? currentUser?.email ?? "Usuario Ecoises",
        avatar: currentUser?.avatar ?? "",
      },
      content: trimmedComment,
      created_at: new Date().toISOString()
    };

    setComments(prev => [...prev, tempComment]);
    setNewComment("");

    try {
      toast({
        title: "Comentario agregado",
        description: "Tu comentario ha sido publicado exitosamente.",
      });
    } catch (error) {
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      setNewComment(trimmedComment);
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  }, [newComment, currentUser, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-forest-750 font-medium flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-600 animate-ping" />
          Cargando detalles de la observación...
        </div>
      </div>
    );
  }

  if (error || !observation) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-2">Error al cargar la observación</h2>
          <p className="text-sm text-red-650 mb-6">{error || "No pudimos encontrar este registro en la base de datos."}</p>
          <Link to="/sightings">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full">
              Volver a Avistamientos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Botón Volver */}
      <div className="mb-4">
        <Link 
          to="/sightings" 
          className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Avistamientos
        </Link>
      </div>

      {/* Grid General con reordenación en móviles vía display: contents */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA EN DESKTOP (contents en móviles para ordenar de forma personalizada) */}
        <div className="contents lg:flex lg:flex-col lg:col-span-7 lg:gap-6">
          
          {/* 1. Tarjeta de Imagen (order-1 en móviles) */}
          <div className="order-1 lg:order-none space-y-4">
            <Card 
              className="relative overflow-hidden border rounded-3xl shadow-md cursor-zoom-in group bg-white"
              onClick={() => setIsFullscreen(true)}
            >
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-lime-50/50">
                <img
                  src={activeImage || "/placeholder.svg"}
                  alt={`Avistamiento de ${observation.species_name} por ${observation.user.name}`}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Overlay hint */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm pointer-events-none">
                <Maximize2 className="h-5 w-5" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex items-center justify-between pointer-events-none">
                <p className="text-xs text-white/90 font-medium">
                  Foto por: <span className="font-semibold text-white">{observation.user.name}</span>
                </p>
                {observation.points_awarded ? (
                  <Badge className="bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-full border-none shadow-sm gap-1 pointer-events-auto">
                    <Sparkles className="h-3 w-3 fill-current" />
                    +{observation.points_awarded} pts
                  </Badge>
                ) : null}
              </div>
            </Card>

            {/* Gallery thumbnails */}
            {observation.photos && observation.photos.length > 1 && (
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-x-visible md:pb-0 md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {observation.photos.map((photo, index) => {
                  return (
                    <button
                      key={photo.id || index}
                      onClick={() => setActiveImage(photo.photo_url)}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105 w-20 md:w-auto flex-shrink-0 snap-start ${
                        activeImage === photo.photo_url
                          ? "border-lime-500 ring-2 ring-lime-500/50"
                          : "border-gray-200 hover:border-lime-500/50"
                      }`}
                    >
                      <img
                        src={photo.photo_url}
                        alt={`Imagen ${index + 1} del avistamiento`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Notas de Campo e Información Adicional (order-3 en móviles) */}
          <div className="order-3 lg:order-none">
            <Card className="border border-lime-100 rounded-3xl bg-white shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-forest-950 flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-lime-500" />
                  Descripción del Avistamiento
                </h3>
                <p className="text-forest-800 text-sm leading-relaxed text-justify bg-lime-50/20 p-4 rounded-2xl border border-lime-100/30">
                  {observation.description || "El observador no ha añadido ninguna descripción detallada sobre este avistamiento."}
                </p>
              </div>

              {observation.notes && (
                <div>
                  <h3 className="text-sm font-bold text-forest-900 uppercase tracking-wider mb-2">Notas del observador</h3>
                  <div className="bg-amber-50/30 border border-amber-100/50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 shrink-0">
                      <NotepadText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <p className="text-forest-800 text-sm italic">"{observation.notes}"</p>
                      
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* 5. Comentarios (order-5 en móviles) */}
          <div className="order-5 lg:order-none">
            <Card className="border border-lime-100 rounded-3xl bg-white shadow-sm p-6">
              <h3 className="font-bold text-xl text-forest-950 mb-6 flex items-center gap-2">
                <MessageCircle className="h-5.5 w-5.5 text-lime-600" />
                Comentarios ({comments.length})
              </h3>
              
              {/* Agregar Comentario */}
              <div className="space-y-3 mb-6 bg-lime-50/30 p-4 rounded-2xl border border-lime-100/30">
                <Textarea
                  placeholder="Comparte tus observaciones o ayuda a identificar esta especie..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[85px] border-lime-200 focus:border-lime-400 bg-white rounded-xl resize-none text-sm"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-forest-600">
                    {newComment.length}/500 caracteres
                  </span>
                  <Button 
                    onClick={handleAddComment}
                    className="gap-1.5 bg-lime-500 hover:bg-lime-600 text-white rounded-full px-5 py-1.5 h-auto text-xs font-semibold shadow-sm"
                    disabled={!newComment.trim() || newComment.length > 500}
                  >
                    <Send className="h-3 w-3" />
                    Comentar
                  </Button>
                </div>
              </div>

              <Separator className="my-5 border-lime-100/60" />

              {/* Lista de Comentarios */}
              {comments.length > 0 ? (
                <div className="divide-y divide-lime-100/60">
                  {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-10 w-10 text-lime-600/35 mx-auto mb-3" />
                  <p className="text-forest-900 font-bold text-sm mb-1">Sin comentarios aún</p>
                  <p className="text-xs text-forest-650">¡Sé el primero en compartir tu opinión o validar este avistamiento!</p>
                </div>
              )}
            </Card>
          </div>

        </div>

        {/* COLUMNA DERECHA EN DESKTOP (contents en móviles para ordenar de forma personalizada) */}
        <div className="contents lg:flex lg:flex-col lg:col-span-5 lg:gap-6">
          
          {/* 2. Títulos, Datos y Perfil del Observador (order-2 en móviles) */}
          <div className="order-2 lg:order-none space-y-6">
            
            {/* Header de Especie */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">Avistamiento Registrado</span>
                <h1 className="text-3xl font-extrabold text-forest-950 leading-tight">{observation.species_name}</h1>
                {observation.scientific_name && (
                  <p className="text-forest-650 italic text-base font-medium">{observation.scientific_name}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={handleToggleFavorite}
                  className={`gap-1.5 rounded-full px-5 py-1.5 h-auto text-xs font-semibold border-lime-200 ${
                    isFavorite 
                      ? 'bg-lime-500 hover:bg-lime-600 text-white border-none' 
                      : 'hover:bg-lime-50 text-forest-800'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "En Favoritos" : "Agregar a Favoritos"}
                </Button>
                
                <Button variant="outline" className="gap-1.5 rounded-full px-5 py-1.5 h-auto text-xs font-semibold border-lime-200 hover:bg-lime-50 text-forest-800">
                  <Share2 className="h-3.5 w-3.5" />
                  Compartir
                </Button>

                {currentUser && observation.user.id === currentUser.id && (
                  <>
                    <Link to={`/observations/edit/${observation.id}`}>
                      <Button className="gap-1.5 rounded-full px-5 py-1.5 h-auto text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 transition-transform shadow-sm">
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="gap-1.5 rounded-full px-5 py-1.5 h-auto text-xs font-semibold bg-red-600 hover:bg-red-700 text-white hover:scale-102 transition-transform shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </Button>
                  </>
                )}

                {currentUser && observation.user.id !== currentUser.id && (
                  <Button
                    onClick={() => setReportModalOpen(true)}
                    className="gap-1.5 rounded-full px-5 py-1.5 h-auto text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white hover:scale-102 transition-transform shadow-sm"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Reportar
                  </Button>
                )}
              </div>
            </div>

            {/* Perfil del Observador */}
            <Card className="border border-lime-100 rounded-3xl bg-white shadow-sm p-4">
              <span className="text-[10px] font-bold text-forest-600 uppercase tracking-widest block mb-3">Registrado por</span>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-lime-200 shadow-sm bg-lime-100">
                  <AvatarImage src={observation.user.avatar} alt={observation.user.name} />
                  <AvatarFallback className="bg-lime-200 text-lime-800 font-bold text-base">
                    {observation.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-forest-950 text-base leading-tight">{observation.user.name}</p>
                  <p className="text-xs text-forest-600 mt-1">Explorador Ecoises • Nivel 1</p>
                </div>
              </div>
            </Card>

            {/* Datos Técnicos del Avistamiento */}
            <Card className="border border-lime-100 rounded-3xl bg-white shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-sm text-forest-950 uppercase tracking-widest pb-2 border-b border-lime-50">
                Detalles del Registro
              </h3>
              
              <div className="grid grid-cols-1 gap-3.5">
                
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-lime-50/30 border border-lime-100/40 hover:bg-lime-50/70 transition-colors">
                  <div className="bg-lime-100/80 p-2 rounded-xl text-lime-700 shrink-0">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[10px] font-bold text-forest-600 uppercase tracking-wider leading-none mb-1">Ubicación</h4>
                    <p className="text-xs font-semibold text-forest-900 truncate">{observation.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-lime-50/30 border border-lime-100/40 hover:bg-lime-50/70 transition-colors">
                  <div className="bg-lime-100/80 p-2 rounded-xl text-lime-700 shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-forest-600 uppercase tracking-wider leading-none mb-1">Fecha</h4>
                    <p className="text-xs font-semibold text-forest-900">{observation.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-lime-50/30 border border-lime-100/40 hover:bg-lime-50/70 transition-colors">
                  <div className="bg-lime-100/80 p-2 rounded-xl text-lime-700 shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-forest-600 uppercase tracking-wider leading-none mb-1">Hora</h4>
                    <p className="text-xs font-semibold text-forest-900">{observation.time}</p>
                  </div>
                </div>

                {observation.weather && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-lime-50/30 border border-lime-100/40 hover:bg-lime-50/70 transition-colors">
                    <div className="bg-lime-100/80 p-2 rounded-xl text-lime-700 shrink-0">
                      <Cloud className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-forest-600 uppercase tracking-wider leading-none mb-1">Clima</h4>
                      <p className="text-xs font-semibold text-forest-900">{observation.weather}</p>
                    </div>
                  </div>
                )}

              </div>
            </Card>

          </div>

          {/* 4. Mapa de Ubicación Exacta (order-4 en móviles) */}
          <div className="order-4 lg:order-none">
            <Card className="border border-lime-100 rounded-3xl bg-white shadow-sm p-5 overflow-hidden">
              <h3 className="font-bold text-sm text-forest-950 uppercase tracking-widest pb-2 border-b border-lime-50 mb-4">
                Ubicación del Registro
              </h3>
              <div className="h-[250px] w-full rounded-2xl overflow-hidden relative border border-lime-100 z-10">
                {observation.latitude != null && observation.longitude != null ? (
                  <MapContainer
                    center={[observation.latitude, observation.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[observation.latitude, observation.longitude]}>
                      <Popup>
                        <div className="text-xs">
                          <p className="font-bold">{observation.species_name}</p>
                          <p className="text-gray-500">{observation.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full w-full bg-lime-50/50 flex flex-col items-center justify-center text-center p-4">
                    <MapPin className="h-8 w-8 text-lime-600/50 mb-2" />
                    <p className="text-sm font-medium text-forest-800">Ubicación geográfica no disponible</p>
                    <p className="text-xs text-forest-650 mt-1">{observation.location}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>

      </div>

      {/* Observaciones Recientes */}
      <RecentObservations speciesName={observation.species_name} />

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
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage || "/placeholder.svg"}
                alt={observation.species_name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
              />

              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-auto">
                <span className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                  Foto por: {observation.user.name}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Reporte */}
      {observation && (
        <ReportModal
          open={reportModalOpen}
          onOpenChange={setReportModalOpen}
          observationId={observation.id}
          observationSpecies={observation.species_name}
        />
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-white border-red-100 rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <div className="mx-auto bg-red-100 text-red-700 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold font-heading text-center text-forest-950">
              ¿Estás seguro de eliminar este avistamiento?
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-forest-750">
              Esta acción no se puede deshacer y eliminará de forma permanente el avistamiento de <span className="font-semibold text-forest-900">{observation?.species_name}</span> junto con todas sus imágenes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex sm:justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteConfirmOpen(false)}
              className="border-lime-200 hover:bg-lime-50 text-forest-700 rounded-full px-5 h-10 text-sm font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5 h-10 text-sm font-semibold gap-1.5 shadow-sm"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Registro"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObservationDetail;