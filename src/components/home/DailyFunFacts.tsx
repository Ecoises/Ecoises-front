import { Link } from "react-router-dom";
import { Bird, Brain, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

const SpeciesCardSkeleton = () => {
  return (
    <div className="h-64 md:h-80 w-full rounded-xl overflow-hidden relative">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Skeleton className="h-6 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/20" />
      </div>
    </div>
  );
};

const FlippingCard = ({ species }) => {
  return (
    <div className="h-64 md:h-80">
      <div className="relative w-full h-full [perspective:1000px] group">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front side - Image */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden shadow-md">
            <AspectRatio ratio={1} className="h-full">
              <img
                src={species.image}
                alt={species.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/0 to-transparent flex items-end p-6">
                <div className="text-white w-full">
                  <h3 className="font-heading font-bold text-lg md:text-xl leading-tight">{species.name}</h3>
                  <p className="text-xs italic text-gray-300 font-medium tracking-wide opacity-90 mb-2">{species.scientificName}</p>
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Back side - Information */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-forest-900 text-white rounded-xl p-6 flex flex-col justify-center overflow-y-auto shadow-xl">
            <h3 className="font-heading font-bold text-lg mb-1 text-lime-400">{species.name}</h3>
            <p className="italic text-xs text-gray-300 mb-4 pb-2 border-b border-gray-600/50">{species.scientificName}</p>
            <p className="text-sm leading-relaxed mb-4 text-gray-100">{species.funFact}</p>
            {species.author && (
              <p className="text-[10px] text-gray-400 mt-auto pt-3 border-t border-gray-600/50 flex items-center gap-1">
                <span>📷</span> {species.author}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DailyFunFacts = () => {
  const [dailySpecies, setDailySpecies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailySpecies = async () => {
      try {
        const response = await apiClient.get('/daily-curiosities');
        setDailySpecies(response.data);
      } catch (error) {
        console.error("Error fetching daily species:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySpecies();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mt-4">
            <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg shadow-lime-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-forest-900">
                ¿Sabías que?
              </h2>
              <p className="text-sm text-forest-600">Datos interesantes del día (Powered by Gemini)</p>
            </div>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SpeciesCardSkeleton key={i} />
          ))}
        </div>
        <div className="block md:hidden">
          <SpeciesCardSkeleton />
        </div>
      </div>
    );
  }

  // If failed to load, show nothing or empty state? For now, we show what we have or nothing.
  if (dailySpecies.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mt-4">
          <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg shadow-lime-500/20">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-forest-900">
              ¿Sabías que?
            </h2>
            <p className="text-sm text-forest-600">Datos interesantes del día </p>
          </div>
        </div>
      </div>

      {/* Mobile view - carousel */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {dailySpecies.map((species) => (
              <CarouselItem key={species.id}>
                <FlippingCard species={species} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>

      {/* Desktop view - grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {dailySpecies.slice(0, 3).map((species) => (
          <FlippingCard key={species.id} species={species} />
        ))}
      </div>
    </div>
  );
};

export default DailyFunFacts;
