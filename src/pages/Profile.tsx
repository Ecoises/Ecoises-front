import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs from '@/components/profile/ProfileTabs';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  
  // Si no hay userId en la URL, es el perfil del usuario actual
  const isOwnProfile = !userId || userId === user?.id?.toString();
  
  // Mock data para el perfil
  const profileData = {
    id: isOwnProfile ? user?.id : parseInt(userId || '1'),
    full_name: isOwnProfile ? user?.full_name : 'Usuario Ejemplo',
    email: isOwnProfile ? user?.email : 'usuario@ejemplo.com',
    bio: 'Apasionado por la observación de aves y la conservación de la naturaleza.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop',
    observations_count: 45,
    followers_count: 128,
    following_count: 87,
    badges_count: 12,
    is_following: false,
    location: 'Costa Rica',
    joined_date: '2023-01-15'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pb-8">
        <ProfileHeader 
          profile={profileData} 
          isOwnProfile={isOwnProfile}
        />
        <div className="px-4 md:px-6">
          <ProfileStats profile={profileData} />
          <ProfileTabs 
            profile={profileData} 
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;