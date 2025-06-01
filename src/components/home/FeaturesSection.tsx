
import { Link } from "react-router-dom";
import { Search, MapPin, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  linkTo 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  linkTo: string;
}) => (
  <Link to={linkTo}>
    <Card className="h-full p-6 card-hover flex flex-col">
      <div className="mb-4 bg-lime-100 h-12 w-12 rounded-xl flex items-center justify-center">
        <Icon className="h-6 w-6 text-lime-600" />
      </div>
      <h3 className="text-forest-900 font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-forest-700 text-sm">{description}</p>
    </Card>
  </Link>
);

const FeaturesSection = () => {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-forest-900 mb-4">Explore Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard 
          icon={Search} 
          title="Bird Explorer" 
          description="Search and discover different bird species with beautiful imagery and detailed information."
          linkTo="/explorer"
        />
        <FeatureCard 
          icon={MapPin} 
          title="Sightings Map" 
          description="Visualize bird sightings on an interactive map and explore hotspots in your area."
          linkTo="/map"
        />
        <FeatureCard 
          icon={BookOpen} 
          title="Species Guide" 
          description="Access comprehensive information about bird species, including habitat, behavior, and calls."
          linkTo="/species"
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
