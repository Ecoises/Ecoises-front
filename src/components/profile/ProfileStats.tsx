import { Card } from '@/components/ui/card';

interface ProfileStatsProps {
  profile: {
    observations_count: number;
    followers_count: number;
    following_count: number;
    badges_count: number;
  };
}

const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      label: 'Observaciones',
      value: profile.observations_count,
      color: 'text-blue-600'
    },
    {
      label: 'Seguidores',
      value: profile.followers_count,
      color: 'text-green-600'
    },
    {
      label: 'Siguiendo',
      value: profile.following_count,
      color: 'text-purple-600'
    },
    {
      label: 'Insignias',
      value: profile.badges_count,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;