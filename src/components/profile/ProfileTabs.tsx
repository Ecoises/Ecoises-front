import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileObservations from './ProfileObservations';
import ProfileBadges from './ProfileBadges';
import { Camera, Award, Activity } from 'lucide-react';

interface ProfileTabsProps {
  profile: any;
  isOwnProfile: boolean;
}

const ProfileTabs = ({ profile, isOwnProfile }: ProfileTabsProps) => {
  return (
    <div className="px-6">
      <Tabs defaultValue="observations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="observations" className="gap-2">
            <Camera className="w-4 h-4" />
            Observaciones
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Award className="w-4 h-4" />
            Insignias
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="observations" className="mt-6">
          <ProfileObservations profile={profile} isOwnProfile={isOwnProfile} />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <ProfileBadges profile={profile} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>La sección de actividad estará disponible próximamente</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;