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

const ImageCard = ({ bird, isFeature = false }) => {
  return (
    <div className="relative rounded-xl overflow-hidden h-full">
      <AspectRatio ratio={1}>
        <img 
          src={bird.image} 
          alt={bird.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div className="text-white">
            <h3 className="font-heading font-bold text-lg md:text-xl">{bird.name}</h3>
            {isFeature && <p className="text-sm text-white/80 line-clamp-2 mt-1">{bird.funFact}</p>}
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

const TextCard = ({ title, description }) => {
  return (
    <div className="bg-lime-500 text-white h-full rounded-xl p-6 flex flex-col justify-center">
      <h3 className="font-heading font-bold text-xl md:text-2xl mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

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
            <CarouselItem>
              <TextCard 
                title="Fascinating Birds" 
                description="Discover the beautiful diversity of bird species from around the world" 
              />
            </CarouselItem>
            {birdGallery.map((bird) => (
              <CarouselItem key={bird.id}>
                <ImageCard bird={bird} isFeature={true} />
              </CarouselItem>
            ))}
            <CarouselItem>
              <TextCard 
                title="Bird Conservation" 
                description="Learn how you can help protect these amazing creatures" 
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
      
      {/* Desktop view - grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-3 gap-4">
        <TextCard 
          title="Fascinating Birds" 
          description="Discover the beautiful diversity of bird species from around the world" 
        />
        <div className="col-span-1">
          <ImageCard bird={birdGallery[0]} />
        </div>
        <div className="col-span-1">
          <ImageCard bird={birdGallery[1]} />
        </div>
        <div className="col-span-1">
          <ImageCard bird={birdGallery[2]} isFeature={true} />
        </div>
        <div className="col-span-1">
          <ImageCard bird={birdGallery[3]} />
        </div>
        <TextCard 
          title="Bird Conservation" 
          description="Learn how you can help protect these amazing creatures" 
        />
      </div>
    </div>
  );
};

const Index = () => {
  // Get top 3 for the podium
  const topThree = leaderboardData.slice(0, 3);
  // Get the rest for the table
  const restOfLeaderboard = leaderboardData.slice(3);
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-12">
        <div className="bg-lime-100 rounded-lg overflow-hidden">
          <div className="container max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-forest-950 mb-4">Bienvenido a Avoga</h1>
              <p className="text-forest-700 text-lg mb-6">Track, explore, and discover the fascinating world of birds</p>
              <div className="flex gap-4">
                <Link to="/explorer">
                  <Button className="bg-lime-500 hover:bg-lime-600 text-white rounded-full">
                    Explorar Aves
                  </Button>
                </Link>
                <Link to="/sightings/new">
                  <Button variant="outline" className="border-lime-400 text-forest-800 rounded-full">
                    Registrar Avistamiento
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="/images/ilustracion.png"
                alt="Bird illustration" 
                className="max-h-72 md:max-h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

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
      
      {/* Species Gallery with image cards and text overlays */}
      <SpeciesGallery />
      
      {/* Leaderboard Section */}
      <div className="space-y-6">
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
      
      {/* Recent Sightings Section - Now as a separate section with cards */}
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
