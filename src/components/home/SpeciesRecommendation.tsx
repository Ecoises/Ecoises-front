import { Link } from "react-router-dom";
import { Bird, Clock, MapPin, Eye, Sparkles, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const randomIndex = Math.floor(Math.random() * recommendedBirds.length);
  const bird = recommendedBirds[randomIndex] || recommendedBirds[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg shadow-lime-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-forest-900">
              Especie del día
            </h2>
            <p className="text-sm text-forest-600">Aprende algo nuevo sobre esta especie</p>
          </div>
        </div>
        <Link to="/taxa">
          <Button variant="ghost" className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 gap-1">
            Ver Más
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Image Section */}
          <div className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-lime-500 hover:bg-lime-600 text-white border-0 shadow-lg px-3 py-1.5 gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Recomendada
              </Badge>
            </div>
            <img
              src={bird.image}
              alt={bird.name}
              className="h-full w-full object-cover aspect-[4/3] lg:aspect-auto transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="lg:col-span-3 p-8 bg-gradient-to-br from-white to-lime-50/30">
            <div className="h-full flex flex-col justify-between">
              <div>
                {/* Title */}
                <h3 className="text-3xl font-heading font-bold text-forest-900 mb-2 group-hover:text-lime-700 transition-colors">
                  {bird.name}
                </h3>
                <p className="text-forest-600 italic text-base mb-6 flex items-center gap-2">
                  
                  {bird.scientificName}
                </p>

                {/* Description */}
                <p className="text-forest-700 leading-relaxed mb-6 line-clamp-3">
                  {bird.description}
                </p>

                {/* Info Pills */}

              </div>

              {/* CTA Button */}
              <Link to={`/taxa/${bird.id}`} className="mt-auto">
                <Button className="bg-lime-500 hover:bg-lime-600 w-full sm:w-auto px-6 py-3 text-sm sm:text-base">
                  Ver Detalles
                  <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpeciesRecommendation;