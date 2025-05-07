import { Link } from "react-router-dom";
import { Calendar, Search, Eye, MapPin, BookOpen, Plus, Trophy, Award, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const TopWinnerCard = ({ 
  position, 
  name, 
  sightings, 
  species, 
  avatar,
  isFirst = false
}: { 
  position: number; 
  name: string; 
  sightings: number; 
  species: number;
  avatar: string;
  isFirst?: boolean;
}) => {
  // Determine which icon to use based on position
  let PositionIcon = Medal;
  let positionColor = "bg-lime-100 text-forest-800";
  
  if (position === 1) {
    PositionIcon = Trophy;
    positionColor = "bg-yellow-500 text-white";
  } else if (position === 2) {
    positionColor = "bg-gray-300 text-forest-800";
  } else if (position === 3) {
    positionColor = "bg-amber-700 text-white";
  }
  
  return (
    <Card className={`p-4 text-center flex flex-col items-center ${isFirst ? 'bg-lime-50 shadow-lg border-lime-200' : ''}`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${positionColor}`}>
        <PositionIcon className="h-5 w-5" />
      </div>
      
      <Avatar className={`h-16 w-16 ${isFirst ? 'h-20 w-20' : ''} mb-2`}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      
      <h3 className="font-heading font-semibold text-forest-900">{name}</h3>
      <div className="text-sm text-forest-700 mt-1">
        <span className="font-medium">{sightings}</span> sightings
      </div>
      <div className="text-sm text-forest-700">
        <span className="font-medium">{species}</span> species
      </div>
    </Card>
  );
};

// Datos de ejemplo para el leaderboard
const leaderboardData = [
  { position: 1, name: "Carlos Méndez", sightings: 245, species: 78, avatar: "https://i.pravatar.cc/150?img=11" },
  { position: 2, name: "Elena García", sightings: 187, species: 65, avatar: "https://i.pravatar.cc/150?img=5" },
  { position: 3, name: "Juan Pérez", sightings: 152, species: 59, avatar: "https://i.pravatar.cc/150?img=12" },
  { position: 4, name: "Sofía Martínez", sightings: 134, species: 47, avatar: "https://i.pravatar.cc/150?img=9" },
  { position: 5, name: "Miguel Rodríguez", sightings: 98, species: 34, avatar: "https://i.pravatar.cc/150?img=22" },
];

const Index = () => {
  // Get top 3 for the podium
  const topThree = leaderboardData.slice(0, 3);
  // Get the rest for the table
  const restOfLeaderboard = leaderboardData.slice(3);
  
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
      
      {/* Main content grid with recent sightings and leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sightings */}
        <div className="lg:col-span-1">
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
        
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-lime-600" />
              <h2 className="text-xl font-heading font-bold text-forest-900">Top Bird Watchers</h2>
            </div>
            <Link to="/leaderboard" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
              View Complete Ranking
            </Link>
          </div>
          
          {/* Top 3 Podium */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4">
              {/* Second place */}
              <div className="self-end">
                <TopWinnerCard {...topThree[1]} />
              </div>
              
              {/* First place - center, larger */}
              <div className="transform -translate-y-4">
                <TopWinnerCard {...topThree[0]} isFirst={true} />
              </div>
              
              {/* Third place */}
              <div className="self-end">
                <TopWinnerCard {...topThree[2]} />
              </div>
            </div>
          </div>
          
          {/* Rest of Leaderboard */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Observer</TableHead>
                  <TableHead className="text-center">Sightings</TableHead>
                  <TableHead className="text-center">Species</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restOfLeaderboard.map((entry) => (
                  <TableRow key={entry.position} className="hover:bg-lime-50">
                    <TableCell className="font-medium">
                      <div className="flex justify-center items-center w-8 h-8 rounded-full bg-lime-100 text-forest-800">
                        {entry.position}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={entry.avatar} 
                          alt={entry.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{entry.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{entry.sightings}</TableCell>
                    <TableCell className="text-center">{entry.species}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
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
