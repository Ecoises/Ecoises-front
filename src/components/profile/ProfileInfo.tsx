import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Mail, UserPlus, UserMinus, Settings, Eye, Award, Users } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';

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
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      {/* Información principal */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="text-center">
            {/* Avatar */}
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/10">
              <AvatarImage src={profile.avatar} alt={profile.full_name} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>

            {/* Nombre */}
            <h1 className="text-xl font-bold text-foreground mb-2">
              {profile.full_name}
            </h1>

            {/* Biografía */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {profile.bio}
            </p>

            {/* Botón de acción */}
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(true)}
                className="w-full gap-2"
              >
                <Settings className="w-4 h-4" />
                Editar perfil
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                className="w-full gap-2"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Dejar de seguir
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Seguir
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Información de contacto */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
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

      {/* Estadísticas */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Estadísticas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-muted-foreground">Observaciones</span>
              </div>
              <span className="font-semibold text-foreground">{profile.observations_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-muted-foreground">Seguidores</span>
              </div>
              <span className="font-semibold text-foreground">{profile.followers_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-muted-foreground">Siguiendo</span>
              </div>
              <span className="font-semibold text-foreground">{profile.following_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-muted-foreground">Insignias</span>
              </div>
              <span className="font-semibold text-foreground">{profile.badges_count}</span>
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

      <EditProfileDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </div>
  );
};

export default ProfileInfo;