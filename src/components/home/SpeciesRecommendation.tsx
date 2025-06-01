
import { Link } from "react-router-dom";
import { Bird } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default SpeciesRecommendation;
