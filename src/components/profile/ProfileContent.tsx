import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Camera, 
  Award, 
  Activity, 
  MapPin, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ProfileContentProps {
  profile: any;
  isOwnProfile: boolean;
}

const ProfileContent = ({ profile, isOwnProfile }: ProfileContentProps) => {
  // Mock data de observaciones con formato de posts sociales
  const observations = [
    {
      id: 1,
      species: 'Quetzal Resplandeciente',
      scientific_name: 'Pharomachrus mocinno',
      location: 'Monteverde, Costa Rica',
      date: '2024-01-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=600&h=400&fit=crop',
      description: 'Increíble avistamiento de este majestuoso quetzal durante mi caminata matutina. Se encontraba alimentándose en un aguacatillo silvestre. La luz era perfecta para capturar sus colores iridiscentes.',
      confidence: 'Alta',
      status: 'Verificado',
      likes: 24,
      comments: 8,
      verified: true
    },
    {
      id: 2,
      species: 'Tucán Pico Iris',
      scientific_name: 'Ramphastos sulfuratus',
      location: 'Manuel Antonio, Costa Rica',
      date: '2024-01-10T14:15:00Z',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      description: 'Una pareja de tucanes compartiendo frutos en las copas de los árboles. Su comportamiento social es fascinante de observar.',
      confidence: 'Media',
      status: 'Pendiente',
      likes: 18,
      comments: 12,
      verified: false
    },
    {
      id: 3,
      species: 'Colibrí Garganta Rubí',
      scientific_name: 'Archilochus colubris',
      location: 'San José, Costa Rica',
      date: '2024-01-05T07:45:00Z',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop',
      description: 'Este pequeño colibrí visitó mi jardín durante varios días. Es increíble su agilidad y la velocidad de sus alas.',
      confidence: 'Alta',
      status: 'Verificado',
      likes: 31,
      comments: 15,
      verified: true
    }
  ];

  // Mock data de insignias
  const badges = [
    {
      id: 1,
      name: 'Observador Experto',
      description: '50+ observaciones verificadas',
      icon: '🏆',
      earned_date: '2024-01-01',
      rarity: 'rare'
    },
    {
      id: 2,
      name: 'Fotógrafo Naturalista',
      description: 'Fotos de alta calidad',
      icon: '📸',
      earned_date: '2023-12-15',
      rarity: 'common'
    },
    {
      id: 3,
      name: 'Guardián del Bosque',
      description: 'Contribución a la conservación',
      icon: '🌳',
      earned_date: '2023-11-20',
      rarity: 'epic'
    },
    {
      id: 4,
      name: 'Explorador Tropical',
      description: 'Observaciones en múltiples ecosistemas',
      icon: '🗺️',
      earned_date: '2023-10-10',
      rarity: 'rare'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `hace ${diffInHours}h`;
    } else if (diffInHours < 168) { // 7 días
      return `hace ${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verificado':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'Pendiente':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'common':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  return (
    <Tabs defaultValue="observations" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted">
        <TabsTrigger value="observations" className="gap-2">
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Observaciones</span>
          <span className="sm:hidden">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="badges" className="gap-2">
          <Award className="w-4 h-4" />
          Insignias
        </TabsTrigger>
        <TabsTrigger value="activity" className="gap-2">
          <Activity className="w-4 h-4" />
          Actividad
        </TabsTrigger>
      </TabsList>

      <TabsContent value="observations" className="mt-0">
        <div className="space-y-6">
          {observations.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/30 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {isOwnProfile ? 'Aún no tienes observaciones' : 'Sin observaciones públicas'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile 
                    ? 'Comienza tu aventura como observador de la naturaleza'
                    : 'Este usuario aún no ha compartido observaciones'
                  }
                </p>
                {isOwnProfile && (
                  <Button className="gap-2">
                    <Camera className="w-4 h-4" />
                    Crear primera observación
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            observations.map((observation) => (
              <Card key={observation.id} className="border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
                {/* Header del post */}
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={profile.avatar} alt={profile.full_name} />
                          <AvatarFallback>{profile.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{profile.full_name}</h4>
                            {observation.verified && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{observation.location}</span>
                            <span>•</span>
                            <span>{formatDate(observation.date)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(observation.status)}`}>
                        {observation.status === 'Verificado' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {observation.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Imagen */}
                  <div className="aspect-[3/2] relative bg-accent/20">
                    <img 
                      src={observation.image} 
                      alt={observation.species}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Contenido del post */}
                  <div className="p-4 space-y-3">
                    {/* Información de la especie */}
                    <div>
                      <h3 className="text-base font-bold text-foreground mb-1">
                        {observation.species}
                      </h3>
                      <p className="text-xs text-muted-foreground italic mb-2">
                        {observation.scientific_name}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {observation.description}
                      </p>
                    </div>

                    {/* Confianza */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Confianza {observation.confidence}
                      </Badge>
                    </div>

                    {/* Acciones del post */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{observation.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{observation.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="badges" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="border-border bg-card hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getBadgeRarityColor(badge.rarity)}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {badge.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Obtenida el {new Date(badge.earned_date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="activity" className="mt-0">
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-30 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2 text-foreground">Próximamente</h3>
            <p className="text-sm text-muted-foreground">
              La sección de actividad estará disponible pronto
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileContent;