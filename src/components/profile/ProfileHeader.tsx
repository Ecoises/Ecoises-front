import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, UserPlus, UserMinus, Settings } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';

interface ProfileHeaderProps {
  profile: {
    id: number;
    full_name: string;
    email: string;
    bio: string;
    avatar: string;
    cover: string;
    location: string;
    joined_date: string;
    is_following?: boolean;
  };
  isOwnProfile: boolean;
}

const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // Aquí implementarías la llamada a la API
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
    <>
      <div className="relative mb-8">
        {/* Cover area with gradient */}
        <div className="h-32 md:h-40 w-full bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>

        {/* Profile content */}
        <div className="relative px-4 md:px-6">
          {/* Avatar and action button container */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-12">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.full_name} />
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              
              {/* User info on mobile */}
              <div className="sm:hidden flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground truncate">
                  {profile.full_name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {profile.location && (
                    <>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{profile.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {isOwnProfile ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditOpen(true)}
                  className="gap-2 h-9"
                >
                  <Settings className="w-4 h-4" />
                  Editar perfil
                </Button>
              ) : (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                  className="gap-2 h-9"
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
          </div>

          {/* User info on desktop */}
          <div className="hidden sm:block mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {profile.full_name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Miembro desde {formatDate(profile.joined_date)}</span>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-foreground/80 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="text-xs">Observador activo</Badge>
              <Badge variant="secondary" className="text-xs">Experto en aves</Badge>
            </div>
          </div>

          {/* Bio on mobile */}
          <div className="sm:hidden mt-4">
            {profile.bio && (
              <p className="text-sm text-foreground/80 leading-relaxed">
                {profile.bio}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>Miembro desde {formatDate(profile.joined_date)}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <Badge variant="secondary" className="text-xs">Observador activo</Badge>
              <Badge variant="secondary" className="text-xs">Experto en aves</Badge>
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </>
  );
};

export default ProfileHeader;