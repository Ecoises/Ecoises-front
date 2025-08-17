import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, UserMinus, Settings, Eye, Award, Users } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';

interface ProfileHeaderProps {
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

const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(profile.is_following || false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex justify-center sm:justify-start">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src={profile.avatar} alt={profile.full_name} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Información principal */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          {/* Nombre y botón de acción */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.full_name}
            </h1>
            
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(true)}
                className="gap-2 self-center sm:self-auto"
              >
                <Settings className="w-4 h-4" />
                Editar perfil
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                className="gap-2 self-center sm:self-auto"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Siguiendo
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

          {/* Estadísticas principales */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-foreground">
                  {formatNumber(profile.observations_count)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Observaciones</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xl font-bold text-foreground">
                  {formatNumber(profile.followers_count)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Seguidores</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xl font-bold text-foreground">
                  {formatNumber(profile.badges_count)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Medallas</p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog 
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </div>
  );
};

export default ProfileHeader;