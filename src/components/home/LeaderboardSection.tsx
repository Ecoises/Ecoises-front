
import { Link } from "react-router-dom";
import { Trophy, Award, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const LeaderboardSection = () => {
  // Get top 3 for the podium
  const topThree = leaderboardData.slice(0, 3);
  // Get the rest for the table
  const restOfLeaderboard = leaderboardData.slice(3);
  
  return (
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
  );
};

export default LeaderboardSection;
