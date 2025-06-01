
import { Link } from "react-router-dom";
import { Eye, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RecentSightingCard = ({ 
  bird, 
  location, 
  date, 
  image, 
  observer,
  observerAvatar
}: { 
  bird: string; 
  location: string; 
  date: string;
  image: string;
  observer: string;
  observerAvatar: string;
}) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative">
      <img 
        src={image} 
        alt={bird} 
        className="h-44 w-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="font-medium text-forest-900 text-lg">{bird}</h3>
      <div className="flex items-center text-sm text-forest-700 mt-1">
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
      </div>
      <div className="text-sm text-forest-700 mt-1">
        <span>{date}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-lime-100 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={observerAvatar} />
          <AvatarFallback>{observer.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-forest-700">Observed by <span className="font-medium text-forest-800">{observer}</span></span>
      </div>
    </div>
  </Card>
);

// Recent sightings data
const recentSightingsData = [
  {
    id: 1,
    bird: "American Robin",
    location: "Central Park",
    date: "Today, 10:23 AM",
    image: "https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=300&h=300",
    observer: "María López",
    observerAvatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 2,
    bird: "Northern Cardinal",
    location: "Riverside Trail",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=300&h=300",
    observer: "Carlos Méndez",
    observerAvatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    bird: "Blue Jay",
    location: "Oakwood Park",
    date: "May 3, 2023",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=300&h=300",
    observer: "Juan Pérez",
    observerAvatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 4,
    bird: "Barn Owl",
    location: "Hillside Reserve",
    date: "May 1, 2023",
    image: "https://images.unsplash.com/photo-1548430075-47e8ecb8c55b?auto=format&fit=crop&w=300&h=300",
    observer: "Elena García",
    observerAvatar: "https://i.pravatar.cc/150?img=9"
  }
];

const RecentSightingsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-lime-600" />
          <h2 className="text-xl font-heading font-bold text-forest-900">Recent Sightings</h2>
        </div>
        <Link to="/sightings" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentSightingsData.map(sighting => (
          <RecentSightingCard
            key={sighting.id}
            bird={sighting.bird}
            location={sighting.location}
            date={sighting.date}
            image={sighting.image}
            observer={sighting.observer}
            observerAvatar={sighting.observerAvatar}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentSightingsSection;
