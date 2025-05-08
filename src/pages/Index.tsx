import { Link } from "react-router-dom";
import { Calendar, Search, Eye, MapPin, BookOpen, Plus, Trophy, Award, Medal, Bird } from "lucide-react";
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
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

// Bird recommendation data
const recommendedBirds = [
  {
    id: 1,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    image: "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&h=500",
    description: "The vibrant red plumage of the male Northern Cardinal makes it one of the most recognizable birds in North America. Often found in woodlands and gardens, these birds are known for their beautiful whistling songs.",
    difficulty: "Easy to spot",
    bestTime: "Year-round",
    habitat: "Woodlands, Gardens, Parks"
  },
  {
    id: 2,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&h=500",
    description: "With its bright blue crest and bold personality, the Blue Jay is a striking presence in any backyard. Known for their intelligence and varied vocalizations, they're fascinating to observe.",
    difficulty: "Moderate",
    bestTime: "Spring, Summer",
    habitat: "Deciduous forests, suburban areas"
  }
];

const SpeciesRecommendation = () => {
  // For simplicity, we'll just pick a random bird from our sample data
  const randomIndex = Math.floor(Math.random() * recommendedBirds.length);
  const bird = recommendedBirds[randomIndex] || recommendedBirds[0];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bird className="h-5 w-5 text-lime-600" />
          <h2 className="text-xl font-heading font-bold text-forest-900">Species Recommendation</h2>
        </div>
        <Link to="/species" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
          Explore More Species
        </Link>
      </div>
      
      <Card className="overflow-hidden border-lime-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="md:col-span-1">
            <img 
              src={bird.image} 
              alt={bird.name} 
              className="h-full w-full object-cover aspect-square md:aspect-auto"
            />
          </div>
          <div className="md:col-span-2 p-6">
            <div className="mb-2">
              <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full text-xs">Recommended for you</span>
            </div>
            <h3 className="text-xl font-heading font-semibold text-forest-900 mb-1">{bird.name}</h3>
            <p className="text-forest-700 italic text-sm mb-3">{bird.scientificName}</p>
            <p className="text-forest-800 mb-4 line-clamp-3">{bird.description}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
              <div>
                <p className="text-forest-700">Difficulty:</p>
                <p className="font-medium text-forest-900">{bird.difficulty}</p>
              </div>
              <div>
                <p className="text-forest-700">Best time:</p>
                <p className="font-medium text-forest-900">{bird.bestTime}</p>
              </div>
              <div>
                <p className="text-forest-700">Habitat:</p>
                <p className="font-medium text-forest-900">{bird.habitat}</p>
              </div>
            </div>
            
            <Link to={`/species/${bird.id}`}>
              <Button className="w-full md:w-auto bg-lime-500 hover:bg-lime-600 text-white rounded-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

const birdGallery = [
  {
    id: 1,
    name: "Flamingo",
    image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=500&h=500",
    funFact: "Flamingos get their pink coloration from the beta-carotene in their diet of brine shrimp and blue-green algae."
  },
  {
    id: 2,
    name: "Barn Owl",
    image: "https://images.unsplash.com/photo-1548430075-47e8ecb8c55b?auto=format&fit=crop&w=500&h=500",
    funFact: "Barn Owls can detect and capture prey in complete darkness using only their hearing, which is so precise they can locate mice under snow or vegetation."
  },
  {
    id: 3,
    name: "Peacock",
    image: "https://images.unsplash.com/photo-1602170284347-f9c28856c744?auto=format&fit=crop&w=500&h=500",
    funFact: "A peacock's tail feathers (known as a train) make up about 60% of its body length and contain a complex pattern of eyespots that help attract mates."
  },
  {
    id: 4,
    name: "Toucan",
    image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=500&h=500",
    funFact: "Despite its large size, a toucan's beak is lightweight and made of keratin with a hollow honeycomb structure inside, which helps regulate body temperature."
  },
  {
    id: 5,
    name: "Hummingbird",
    image: "https://images.unsplash.com/photo-1590143640485-b927afbc3d42?auto=format&fit=crop&w=500&h=500",
    funFact: "Hummingbirds are the only birds that can fly backwards and hover in mid-air. Their wings beat about 70 times per second!"
  }
];

const SpeciesGallery = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bird className="h-5 w-5 text-lime-600" />
          <h2 className="text-xl font-heading font-bold text-forest-900">Fascinating Species</h2>
        </div>
        <Link to="/species" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
          Discover More Birds
        </Link>
      </div>
      
      {/* Mobile view - carousel */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {birdGallery.map((bird) => (
              <CarouselItem key={bird.id}>
                <FlipCard bird={bird} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
      
      {/* Desktop view - grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-4">
        {birdGallery.map((bird) => (
          <FlipCard key={bird.id} bird={bird} />
        ))}
      </div>
    </div>
  );
};

const FlipCard = ({ bird }) => {
  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <AspectRatio ratio={1}>
            <img 
              src={bird.image} 
              alt={bird.name}
              className="object-cover w-full h-full transition-transform duration-300"
            />
          </AspectRatio>
          <div className="p-2 text-center bg-white">
            <h3 className="font-medium text-forest-900">{bird.name}</h3>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white border-lime-200 p-0 overflow-hidden">
        <div className="p-4 bg-lime-50 space-y-3">
          <h4 className="font-heading font-semibold text-forest-900">Fun Fact</h4>
          <p className="text-forest-800 text-sm">{bird.funFact}</p>
        </div>
        <div className="p-3 bg-white flex justify-end">
          <Link to={`/species/${bird.id}`}>
            <Button variant="link" className="text-lime-600 p-0 h-auto">
              Learn more
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

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
          <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Welcome to Logo Here</h1>
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
      
      {/* Species Recommendation */}
      <SpeciesRecommendation />
      
      {/* Species Gallery with flip cards */}
      <SpeciesGallery />
      
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
