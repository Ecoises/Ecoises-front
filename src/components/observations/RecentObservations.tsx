import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, ArrowLeft, Info, Eye } from "lucide-react";

type ObservationType = {
  id: number;
  image: string;
  location: string;
  date: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  weather: string;
  notes: string;
};

const mockObservations: ObservationType[] = [
  {
    id: 101,
    image: "https://images.unsplash.com/photo-1621105249905-39e9d9b1367f?auto=format&fit=crop&w=800&h=600",
    location: "Central Park, New York",
    date: "May 5, 2023",
    time: "10:23 AM",
    user: {
      name: "Maria García",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    description: "Spotted this beautiful American Robin gathering nesting materials early in the morning. It was very active and seemed undisturbed by my presence.",
    weather: "Sunny, slight breeze",
    notes: "Bird was singing loudly and displaying territorial behavior.",
  },
  {
    id: 102,
    image: "https://images.unsplash.com/photo-1591198936750-db8b93cb7491?auto=format&fit=crop&w=800&h=600",
    location: "Riverside Trail, Boston",
    date: "April 28, 2023", 
    time: "9:15 AM",
    user: {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    description: "Observed a pair of American Robins building a nest in a maple tree about 8 feet off the ground. They were taking turns bringing materials.",
    weather: "Cloudy, mild temperature",
    notes: "The pair seemed to be working together efficiently, suggesting they may have nested together before.",
  },
  {
    id: 103,
    image: "https://images.unsplash.com/photo-1550029402-226115b7c579?auto=format&fit=crop&w=800&h=600",
    location: "Oakwood Garden, Chicago",
    date: "April 15, 2023",
    time: "12:45 PM",
    user: {
      name: "Emma Johnson",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    description: "Found an American Robin foraging on the lawn after a light rain. It was pulling up earthworms with great success and seemed very healthy.",
    weather: "Partly cloudy, recent light rain",
    notes: "This individual had particularly vibrant coloring, possibly a mature male in breeding plumage.",
  }
];

interface RecentObservationsProps {
  speciesName?: string;
}

const RecentObservations = ({ speciesName = "this species" }: RecentObservationsProps) => {
  const [selectedObservation, setSelectedObservation] = useState<ObservationType | null>(null);

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-forest-950 mb-6">Observaciones Recientes</h2>
      
      {mockObservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockObservations.map((observation) => (
            <Dialog key={observation.id} onOpenChange={(open) => !open && setSelectedObservation(null)}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-lime-200"
                  onClick={() => setSelectedObservation(observation)}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={observation.image}
                      alt={`Observation by ${observation.user.name}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border-2 border-white/80">
                          <AvatarImage src={observation.user.avatar} alt={observation.user.name} />
                          <AvatarFallback className="text-xs">{observation.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-white text-sm">
                          <p className="font-medium">{observation.user.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-forest-600">
                        <MapPin className="h-4 w-4 text-lime-600" />
                        <span>{observation.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-forest-600">
                        <Calendar className="h-4 w-4 text-lime-600" />
                        <span>{observation.date}</span>
                        <Clock className="h-4 w-4 text-lime-600 ml-2" />
                        <span>{observation.time}</span>
                      </div>
                      <p className="text-forest-800 text-sm line-clamp-2">{observation.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-forest-950">Observation Details</DialogTitle>
                </DialogHeader>
                
                {selectedObservation && (
                  <div className="space-y-4">
                    <img
                      src={selectedObservation.image}
                      alt={`Observation by ${selectedObservation.user.name}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    
                    <div className="flex items-center gap-3 pb-2 border-b border-lime-200">
                      <Avatar className="h-12 w-12 border-2 border-lime-200">
                        <AvatarImage src={selectedObservation.user.avatar} alt={selectedObservation.user.name} />
                        <AvatarFallback className="bg-lime-100 text-lime-700 font-bold">
                          {selectedObservation.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-forest-900">{selectedObservation.user.name}</p>
                        <p className="text-sm text-forest-600">Observer & Naturalist</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-lime-600" />
                        <div>
                          <h3 className="font-medium text-forest-900">Location</h3>
                          <p className="text-forest-700">{selectedObservation.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-lime-600" />
                        <div>
                          <h3 className="font-medium text-forest-900">Date & Time</h3>
                          <p className="text-forest-700">{selectedObservation.date} at {selectedObservation.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-lime-600" />
                        <div>
                          <h3 className="font-medium text-forest-900">Weather</h3>
                          <p className="text-forest-700">{selectedObservation.weather}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-forest-900 mb-2">Description</h3>
                      <p className="text-forest-700">{selectedObservation.description}</p>
                    </div>
                    
                    {selectedObservation.notes && (
                      <div>
                        <h3 className="font-medium text-forest-900 mb-2">Field Notes</h3>
                        <div className="bg-lime-50 p-3 rounded-lg">
                          <p className="text-forest-700 text-sm italic">{selectedObservation.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <Card className="border-lime-200 text-center py-12">
          <div className="space-y-4">
            <Eye className="h-16 w-16 text-lime-500 mx-auto opacity-50" />
            <div>
              <h3 className="text-lg font-medium text-forest-900 mb-2">No observations yet</h3>
              <p className="text-forest-700 mb-4">Be the first to share an observation of {speciesName}!</p>
              <Button className="bg-lime-500 hover:bg-lime-600 text-white">
                Share Your Observation
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecentObservations;