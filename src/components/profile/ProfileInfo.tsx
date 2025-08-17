import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Mail, Eye, Award, Users } from 'lucide-react';

interface ProfileInfoProps {
  profile: {
    id: number;
    full_name: string;
    email: string;
    bio: string;
    avatar: string;
    location: string;
    joined_date: string;
    is_following?: boolean;
    observations_count: number;
    followers_count: number;
    following_count: number;
    badges_count: number;
    specializations: string[];
    stats: {
      species_identified: number;
      contributions: number;
      verified_observations: number;
    };
  };
  isOwnProfile: boolean;
}

const ProfileInfo = ({ profile, isOwnProfile }: ProfileInfoProps) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      {/* Información personal */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Información personal</h3>
          
          {/* Biografía */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Miembro desde {formatDate(profile.joined_date)}</span>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas detalladas */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Estadísticas detalladas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground">Siguiendo</span>
              </div>
              <span className="font-semibold text-foreground">{profile.following_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm text-muted-foreground">Especies identificadas</span>
              </div>
              <span className="font-semibold text-foreground">{profile.stats.species_identified}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm text-muted-foreground">Contribuciones</span>
              </div>
              <span className="font-semibold text-foreground">{profile.stats.contributions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="text-sm text-muted-foreground">Observaciones verificadas</span>
              </div>
              <span className="font-semibold text-foreground">{profile.stats.verified_observations}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especializaciones */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Especializaciones</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logros destacados */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Logros</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Especies identificadas</span>
              <span className="font-medium text-foreground">{profile.stats.species_identified}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contribuciones</span>
              <span className="font-medium text-foreground">{profile.stats.contributions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Observaciones verificadas</span>
              <span className="font-medium text-foreground">{profile.stats.verified_observations}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;