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
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
            <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;