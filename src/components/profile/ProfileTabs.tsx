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
    <div>
      <Tabs defaultValue="observations" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="observations" className="gap-2 text-sm">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Observaciones</span>
            <span className="sm:hidden">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2 text-sm">
            <Award className="w-4 h-4" />
            Insignias
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="observations" className="mt-0">
          <ProfileObservations profile={profile} isOwnProfile={isOwnProfile} />
        </TabsContent>

        <TabsContent value="badges" className="mt-0">
          <ProfileBadges profile={profile} />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <div className="text-center py-16 text-muted-foreground">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">Próximamente</h3>
            <p className="text-sm">La sección de actividad estará disponible pronto</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;