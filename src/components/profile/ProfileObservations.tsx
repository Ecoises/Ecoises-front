import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye, Camera } from 'lucide-react';

interface ProfileObservationsProps {
  profile: any;
  isOwnProfile: boolean;
}

const ProfileObservations = ({ profile, isOwnProfile }: ProfileObservationsProps) => {
  // Mock data de observaciones
  const observations = [
    {
      id: 1,
      species: 'Quetzal Resplandeciente',
      scientific_name: 'Pharomachrus mocinno',
      location: 'Monteverde, Costa Rica',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop',
      confidence: 'Alta',
      status: 'Verificado'
    },
    {
      id: 2,
      species: 'Tucán Pico Iris',
      scientific_name: 'Ramphastos sulfuratus',
      location: 'Manuel Antonio, Costa Rica',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      confidence: 'Media',
      status: 'Pendiente'
    },
    {
      id: 3,
      species: 'Colibrí Garganta Rubí',
      scientific_name: 'Archilochus colubris',
      location: 'San José, Costa Rica',
      date: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
      confidence: 'Alta',
      status: 'Verificado'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verificado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'Alta':
        return 'bg-green-100 text-green-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (observations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-accent/30 rounded-full flex items-center justify-center">
          <Eye className="w-10 h-10 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">
          {isOwnProfile ? 'Aún no tienes observaciones' : 'Sin observaciones públicas'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {observations.map((observation) => (
        <article key={observation.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
          {/* Post header */}
          <div className="p-4 pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{observation.species}</h3>
                  <p className="text-sm text-muted-foreground italic">{observation.scientific_name}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(observation.status)} text-xs`}>
                {observation.status}
              </Badge>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative aspect-[4/3] bg-accent/20">
            <img 
              src={observation.image} 
              alt={observation.species}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Post content */}
          <div className="p-4">
            {/* Location and date */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{observation.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(observation.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {/* Actions and confidence */}
            <div className="flex items-center justify-between">
              <Badge className={`${getConfidenceColor(observation.confidence)} text-xs`}>
                Confianza {observation.confidence}
              </Badge>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                Ver detalles
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProfileObservations;