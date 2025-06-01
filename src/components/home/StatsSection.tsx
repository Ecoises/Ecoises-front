
import { Calendar, Search, Eye, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  color: string;
}) => (
  <Card className="flex items-center p-4 gap-4 card-hover">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-forest-700 text-sm">{label}</p>
      <p className="text-forest-900 font-heading font-bold text-xl">{value}</p>
    </div>
  </Card>
);

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Eye} label="Total Sightings" value="124" color="bg-lime-500" />
      <StatCard icon={Search} label="Species Identified" value="47" color="bg-lime-600" />
      <StatCard icon={Calendar} label="Active Streak" value="12 days" color="bg-forest-800" />
      <StatCard icon={MapPin} label="Locations Visited" value="18" color="bg-forest-700" />
    </div>
  );
};

export default StatsSection;
