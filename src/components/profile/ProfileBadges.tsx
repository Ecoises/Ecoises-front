import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Target, Camera, Users, Trophy } from 'lucide-react';

interface ProfileBadgesProps {
  profile: any;
}

const ProfileBadges = ({ profile }: ProfileBadgesProps) => {
  // Mock data de insignias
  const badges = [
    {
      id: 1,
      name: 'Primer Observador',
      description: 'Realizó su primera observación',
      icon: Camera,
      color: 'bg-blue-100 text-blue-600',
      earned_date: '2024-01-01',
      rarity: 'Común'
    },
    {
      id: 2,
      name: 'Explorador Dedicado',
      description: 'Completó 50 observaciones',
      icon: Target,
      color: 'bg-green-100 text-green-600',
      earned_date: '2024-01-15',
      rarity: 'Raro'
    },
    {
      id: 3,
      name: 'Experto en Aves',
      description: 'Identificó correctamente 25 especies diferentes',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
      earned_date: '2024-01-20',
      rarity: 'Épico'
    },
    {
      id: 4,
      name: 'Influencer de la Naturaleza',
      description: 'Obtuvo 100 seguidores',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      earned_date: '2024-01-25',
      rarity: 'Raro'
    },
    {
      id: 5,
      name: 'Maestro Observador',
      description: 'Completó 100 observaciones verificadas',
      icon: Trophy,
      color: 'bg-amber-100 text-amber-600',
      earned_date: '2024-01-30',
      rarity: 'Legendario'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Común':
        return 'bg-gray-100 text-gray-800';
      case 'Raro':
        return 'bg-blue-100 text-blue-800';
      case 'Épico':
        return 'bg-purple-100 text-purple-800';
      case 'Legendario':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Award className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay insignias aún</h3>
        <p className="text-muted-foreground">
          Las insignias se obtienen al completar diferentes logros en la plataforma
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge) => {
        const IconComponent = badge.icon;
        return (
          <Card key={badge.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${badge.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{badge.name}</h3>
                    <Badge className={getRarityColor(badge.rarity)}>
                      {badge.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {badge.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Obtenida el {new Date(badge.earned_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileBadges;