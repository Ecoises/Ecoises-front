
import { Link } from "react-router-dom";
import { Calendar, Search, Eye, MapPin, BookOpen, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

const RecentSighting = ({ 
  bird, 
  location, 
  date, 
  image 
}: { 
  bird: string; 
  location: string; 
  date: string;
  image: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-lime-50 transition-colors">
    <img 
      src={image} 
      alt={bird} 
      className="h-12 w-12 rounded-lg object-cover"
    />
    <div>
      <h3 className="font-medium text-forest-900">{bird}</h3>
      <div className="flex items-center text-xs text-forest-700">
        <MapPin className="h-3 w-3 mr-1" /> 
        <span>{location}</span>
        <span className="mx-2">•</span>
        <span>{date}</span>
      </div>
    </div>
  </div>
);

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

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Welcome to Avian Voyager</h1>
          <p className="text-forest-700">Track, explore, and discover the fascinating world of birds</p>
        </div>
        <Link to="/sightings/new">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Record Sighting
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Sightings" value="124" color="bg-lime-500" />
        <StatCard icon={Search} label="Species Identified" value="47" color="bg-lime-600" />
        <StatCard icon={Calendar} label="Active Streak" value="12 days" color="bg-forest-800" />
        <StatCard icon={MapPin} label="Locations Visited" value="18" color="bg-forest-700" />
      </div>
      
      {/* Recent Sightings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-forest-900">Recent Sightings</h2>
          <Link to="/sightings" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <Card className="p-4">
          <div className="divide-y divide-lime-100">
            <RecentSighting 
              bird="American Robin" 
              location="Central Park" 
              date="Today, 10:23 AM"
              image="https://images.unsplash.com/photo-1555284223-28889a2e698e?auto=format&fit=crop&w=300&h=300"
            />
            <RecentSighting 
              bird="Northern Cardinal" 
              location="Riverside Trail" 
              date="Yesterday"
              image="https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=300&h=300"
            />
            <RecentSighting 
              bird="Blue Jay" 
              location="Oakwood Park" 
              date="May 3, 2023"
              image="https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=300&h=300"
            />
          </div>
        </Card>
      </div>
      
      {/* Features */}
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
    </div>
  );
};

export default Index;
