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
      <div className="relative">
        {/* Cover Photo */}
        <div 
          className="h-48 md:h-64 w-full bg-cover bg-center rounded-b-xl"
          style={{ backgroundImage: `url(${profile.cover})` }}
        >
          <div className="absolute inset-0 bg-black/20 rounded-b-xl" />
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={profile.avatar} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Editar perfil
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                className="gap-2"
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

          {/* User Info */}
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-foreground">
              {profile.full_name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Se unió en {formatDate(profile.joined_date)}</span>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-foreground max-w-2xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Observador activo</Badge>
              <Badge variant="secondary">Experto en aves</Badge>
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