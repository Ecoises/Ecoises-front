import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';

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
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Eye className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isOwnProfile ? 'No tienes observaciones aún' : 'No hay observaciones disponibles'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isOwnProfile 
            ? 'Comienza a explorar y registra tu primera observación'
            : 'Este usuario no ha compartido observaciones públicas'
          }
        </p>
        {isOwnProfile && (
          <Button>Crear primera observación</Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {observations.map((observation) => (
        <Card key={observation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            <img 
              src={observation.image} 
              alt={observation.species}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className={getStatusColor(observation.status)}>
                {observation.status}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{observation.species}</h3>
            <p className="text-sm text-muted-foreground italic mb-3">
              {observation.scientific_name}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{observation.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(observation.date).toLocaleDateString('es-ES')}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Badge className={getConfidenceColor(observation.confidence)}>
                Confianza: {observation.confidence}
              </Badge>
              <Button variant="ghost" size="sm">
                Ver detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileObservations;