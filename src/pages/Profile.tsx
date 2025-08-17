import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileContent from '@/components/profile/ProfileContent';

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
    bio: 'Apasionado por la observación de aves y la conservación de la naturaleza. Me especializo en aves migratorias de Centroamérica y participo activamente en proyectos de conservación comunitaria.',
    avatar:  isOwnProfile ? user?.avatar :'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    observations_count: 45,
    followers_count: 128,
    following_count: 87,
    badges_count: 12,
    is_following: false,
    location: 'San José, Costa Rica',
    joined_date: '2023-01-15',
    specializations: [
      'Aves migratorias',
      'Conservación',
      'Fotografía de naturaleza',
      'Ecosistemas tropicales'
    ],
    stats: {
      species_identified: 156,
      contributions: 89,
      verified_observations: 42
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header del perfil - Avatar, nombre y stats principales */}
        <ProfileHeader 
          profile={profileData} 
          isOwnProfile={isOwnProfile}
        />
        
        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Sidebar izquierda - Información personal */}
          <div className="lg:col-span-1">
            <ProfileInfo 
              profile={profileData} 
              isOwnProfile={isOwnProfile}
            />
          </div>
          
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            <ProfileContent 
              profile={profileData} 
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;