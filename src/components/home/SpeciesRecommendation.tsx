import { Link, useLocation } from "react-router-dom";
import { Sparkles, ChevronRight, RefreshCw, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface DailySpecies {
  id: number;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  date: string;
}

// Custom hook to manage Daily Species with LocalStorage Cache
const useDailySpecies = () => {
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['daily_species', today],
    queryFn: async () => {
      // 1. Check Local Storage
      const cached = localStorage.getItem('daily_species');
      if (cached) {
        try {
          const parsed: DailySpecies = JSON.parse(cached);
          if (parsed.date === today) {
            return parsed;
          }
        } catch (e) {
          localStorage.removeItem('daily_species');
        }
      }

      // 2. Fetch New Random Species
      const { data } = await api.get('/api/taxa/explore/colombia', {
        params: {
          order_by: 'random',
          per_page: 1,
          enrich: 1
        }
      });

      const species = data.data[0];
      if (!species) throw new Error("No species found");

      // 3. Format & Cache
      const newDaily: DailySpecies = {
        id: species.id,
        name: species.common_name || species.scientific_name,
        scientificName: species.scientific_name,
        image: species.default_photo?.url?.replace('square', 'medium') || species.default_photo?.medium_url || species.default_photo?.url || "https://images.unsplash.com/photo-1518531933037-9a8473035e52?auto=format&fit=crop&w=800&h=500",
        description: species.wikipedia_summary || `Descubre la biodiversidad de Colombia con el ${species.common_name || species.scientific_name}.`,
        date: today
      };

      localStorage.setItem('daily_species', JSON.stringify(newDaily));
      return newDaily;
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2
  });
};

const SpeciesRecommendation = () => {
  const location = useLocation();
  const { data: species, isLoading, isError, refetch } = useDailySpecies();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between opacity-50">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <Card className="overflow-hidden border-0 shadow-xl h-[400px] bg-white animate-pulse">
          <div className="h-full grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-2 bg-gray-200"></div>
            <div className="lg:col-span-3 p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mt-auto"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isError || !species) {
    return (
      <Card className="p-8 text-center border-dashed border-2 border-lime-200 bg-lime-50/50">
        <h3 className="text-xl text-forest-800 font-semibold mb-2">Buscando especie del día...</h3>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-2">
          <RefreshCw className="h-4 w-4" /> Reintentar
        </Button>
      </Card>
    );
  }

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
            <p className="text-sm text-forest-600">Una nueva maravilla natural cada día</p>
          </div>
        </div>
        <Link to="/explorer?order_by=random">
          <Button variant="ghost" className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 gap-1">
            Explorar más
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Image Section */}
          <div className="lg:col-span-2 relative overflow-hidden bg-gray-100 min-h-[300px]">
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-lime-500 hover:bg-lime-600 text-white border-0 shadow-lg px-3 py-1.5 gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Hoy
              </Badge>
            </div>

            <img
              src={species.image}
              alt={species.name}
              className="h-full w-full object-cover aspect-[4/3] lg:aspect-auto transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="lg:col-span-3 p-8 bg-gradient-to-br from-white to-lime-50/30">
            <div className="h-full flex flex-col justify-between">
              <div>
                {/* Title */}
                <h3 className="text-3xl font-heading font-bold text-forest-950 mb-2 group-hover:text-lime-700 transition-colors capitalize">
                  {species.name}
                </h3>
                <p className="text-forest-600 italic text-lg mb-6 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-lime-500" />
                  {species.scientificName}
                </p>

                {/* Description */}
                <div
                  className="text-forest-700 leading-relaxed mb-6 line-clamp-4 prose prose-sm max-w-none prose-lime"
                  dangerouslySetInnerHTML={{ __html: species.description }}
                />

              </div>

              {/* CTA Button */}
              <Link to={`/taxa/${species.id}`} state={{ from: location }} className="mt-auto inline-block">
                <Button className="bg-lime-600 hover:bg-lime-700 text-white w-full sm:w-auto px-8 py-6 text-base shadow-lg shadow-lime-600/20 group-hover:translate-x-1 transition-all">
                  Ver Detalles
                  <ChevronRight className="h-5 w-5 ml-2" />
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
