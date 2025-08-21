import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Clock, Heart, MessageCircle, Send, Star, Cloud } from "lucide-react";
import { Observation, Comment } from "@/types/observation";
import { useToast } from "@/hooks/use-toast";

// Mock data - en una app real vendría de una API
const mockObservation: Observation = {
  id: 101,
  species_name: "American Robin",
  scientific_name: "Turdus migratorius",
  image: "https://images.unsplash.com/photo-1621105249905-39e9d9b1367f?auto=format&fit=crop&w=800&h=600",
  location: "Central Park, New York",
  date: "May 15, 2024",
  time: "10:23 AM",
  user: {
    id: 1,
    name: "Maria García",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  description: "Spotted this beautiful American Robin gathering nesting materials early in the morning. It was very active and seemed undisturbed by my presence. The bird showed typical territorial behavior and was singing loudly from a nearby branch.",
  weather: "Sunny, slight breeze, 18°C",
  notes: "Bird was singing loudly and displaying territorial behavior. Nest building activity observed.",
  is_favorite: false,
  comments: [
    {
      id: 1,
      user: {
        id: 2,
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      content: "Great observation! I've been seeing increased robin activity in this area too.",
      created_at: "2024-05-15T14:30:00Z"
    },
    {
      id: 2,
      user: {
        id: 3,
        name: "Emma Johnson",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      },
      content: "The nesting behavior is fascinating at this time of year. Did you notice if there was a mate nearby?",
      created_at: "2024-05-15T16:45:00Z"
    }
  ]
};

const ObservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [observation, setObservation] = useState<Observation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      // En una app real, aquí harías la llamada a la API
      setObservation(mockObservation);
      setIsFavorite(mockObservation.is_favorite || false);
      setComments(mockObservation.comments || []);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Observation removed from your favorites" : "Observation added to your favorites",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      user: {
        id: 999, // ID del usuario actual
        name: "Current User",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      content: newComment,
      created_at: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been added to this observation",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading observation...</div>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Observation Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find this observation.</p>
        <Link to="/sightings">
          <Button>Back to Sightings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link to="/sightings" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Sightings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="overflow-hidden">
            <img
              src={observation.image}
              alt={`${observation.species_name} observation`}
              className="w-full aspect-video object-cover"
            />
          </Card>

          {/* Species Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{observation.species_name}</CardTitle>
                  {observation.scientific_name && (
                    <p className="text-muted-foreground italic text-lg">{observation.scientific_name}</p>
                  )}
                </div>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={handleToggleFavorite}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{observation.description}</p>
              
              {observation.notes && (
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{observation.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts about this observation..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} className="gap-2" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                  Add Comment
                </Button>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Observer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={observation.user.avatar} />
                  <AvatarFallback>{observation.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{observation.user.name}</p>
                  <p className="text-sm text-muted-foreground">Observer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{observation.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{observation.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">{observation.time}</p>
                </div>
              </div>

              {observation.weather && (
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Weather</p>
                    <p className="text-sm text-muted-foreground">{observation.weather}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Star className="h-4 w-4" />
                View Species Details
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="h-4 w-4" />
                View on Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ObservationDetail;