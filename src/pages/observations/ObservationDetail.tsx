import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, Heart, MessageCircle, Send, Star, Cloud, Eye, Share2, User, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Observation, Comment, ApiObservation } from "@/types/observation";
import { useToast } from "@/hooks/use-toast";
import RecentObservations from "@/components/observations/RecentObservations";
import { observationService } from "@/api/services/ObservationService";

const CURRENT_USER_ID = 999;

// Convierte ApiObservation → formato Observation que usa el render existente
function mapApiToObservation(api: ApiObservation): Observation {
  const primaryPhoto = api.photos?.find((p) => p.is_primary) ?? api.photos?.[0];
  const observedDate = api.observed_at ? new Date(api.observed_at) : new Date(api.created_at);

  return {
    id: api.id,
    species_name: api.taxon?.common_name || api.taxon?.scientific_name || "Especie no identificada",
    scientific_name: api.taxon?.scientific_name,
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
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border border-lime-200">
          <AvatarImage src={comment.user.avatar} alt={`${comment.user.name} avatar`} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-forest-900">{comment.user.name}</span>
            <span className="text-xs text-forest-600">{formattedDate}</span>
          </div>
          <p className="text-sm text-forest-700">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

const ObservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [observation, setObservation] = useState<Observation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

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
        title: !previousState ? "Added to favorites" : "Removed from favorites",
        description: !previousState 
          ? "Observation added to your favorites" 
          : "Observation removed from your favorites",
      });
    } catch (error) {
      setIsFavorite(previousState);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
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
        id: CURRENT_USER_ID,
        name: "Current User",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      content: trimmedComment,
      created_at: new Date().toISOString()
    };

    setComments(prev => [...prev, tempComment]);
    setNewComment("");

    try {
      toast({
        title: "Comment added",
        description: "Your comment has been added to this observation",
      });
    } catch (error) {
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
      setNewComment(trimmedComment);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  }, [newComment, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-forest-700">Loading observation...</div>
      </div>
    );
  }

  if (error || !observation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-forest-900 mb-4">
          {error ? "Error Loading Observation" : "Observation Not Found"}
        </h2>
        <p className="text-forest-700 mb-6">
          {error || "We couldn't find this observation."}
        </p>
        <Link to="/sightings">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white">Back to Sightings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/sightings" 
          className="text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sightings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image and Comments */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="relative overflow-hidden border rounded-xl shadow-md">
            <img
              src={observation.image}
              alt={`${observation.species_name} observation by ${observation.user.name}`}
              className="w-full aspect-[4/3] md:aspect-[4/4] object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-xs text-white font-medium">
                Photo by: {observation.user.name}
              </p>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="border-lime-200 p-4">
            <h3 className="font-semibold text-lg text-forest-950 mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments.length})
            </h3>
            
            {/* Add Comment */}
            <div className="space-y-3 mb-4">
              <Textarea
                placeholder="Share your thoughts about this observation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] border-lime-200 focus:border-lime-400"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-forest-600">
                  {newComment.length}/500 characters
                </span>
                <Button 
                  onClick={handleAddComment}
                  className="gap-2 bg-lime-500 hover:bg-lime-600 text-white"
                  disabled={!newComment.trim() || newComment.length > 500}
                >
                  <Send className="h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="divide-y divide-lime-100">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle className="h-8 w-8 text-forest-400 mx-auto mb-2" />
                <p className="text-forest-700 mb-1">No comments yet</p>
                <p className="text-sm text-forest-600">Be the first to share your thoughts!</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-forest-950 mb-1">{observation.species_name}</h1>
            <p className="text-forest-700 italic mb-4">{observation.scientific_name}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorite}
                className={`gap-2 rounded-full ${isFavorite ? 'bg-lime-500 hover:bg-lime-600' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </Button>
              
              <Button variant="outline" className="gap-2 rounded-full">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <p className="text-forest-800 mb-6">{observation.description}</p>
          </div>

          <Card className="border-lime-200 p-4">
            <h3 className="font-semibold text-lg text-forest-950 mb-4">Observation Details</h3>
            
            {/* Observer Info */}
            <div className="mb-6">
              <h4 className="font-medium text-forest-900 mb-3">Observed by</h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-lime-200">
                  <AvatarImage src={observation.user.avatar} alt={observation.user.name} />
                  <AvatarFallback className="bg-lime-100 text-lime-700 font-bold">
                    {observation.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-forest-900">{observation.user.name}</p>
                  <p className="text-sm text-forest-600">Observer & Naturalist</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Observation Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-lime-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">Location</h3>
                  <p className="text-forest-700">{observation.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-lime-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">Date</h3>
                  <p className="text-forest-700">{observation.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-lime-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-medium text-forest-900">Time</h3>
                  <p className="text-forest-700">{observation.time}</p>
                </div>
              </div>

              {observation.weather && (
                <div className="flex items-start gap-3">
                  <div className="bg-lime-100 p-2 rounded-lg">
                    <Cloud className="h-5 w-5 text-lime-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-forest-900">Weather</h3>
                    <p className="text-forest-700">{observation.weather}</p>
                  </div>
                </div>
              )}
            </div>
            
            
              <div className="mt-6">
                <h3 className="font-medium text-forest-900 mb-2">Field Notes</h3>
                <div className="bg-lime-50 p-3 rounded-lg">
                  <p className="text-forest-700 text-sm italic"><audio src="/audio/prueba_timestamps.mp3" controls />
                  </p>
                </div>
              </div>
          
          </Card>
        </div>
      </div>

      {/* Species Actions Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-forest-950 mb-6">About This Species</h2>
        <Card className="border-lime-200 p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="gap-2 rounded-full">
              <Star className="h-4 w-4" />
              View Species Guide
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <Eye className="h-4 w-4" />
              Similar Observations
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <Music className="h-4 w-4" />
              Listen to Call
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <MapPin className="h-4 w-4" />
              View on Map
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Observations Section */}
      <RecentObservations speciesName={observation.species_name} />
    </div>
  );
};

export default ObservationDetail;