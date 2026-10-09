import { Link } from "react-router-dom";
import { CalendarClock, CheckCircle2, Leaf, Loader2, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChallenges } from "@/hooks/useChallenges";
import type { Challenge } from "@/api/services/challengeService";
import { taxonDisplayName, taxonPhotoUrl } from "@/lib/taxon";
import RecentObservations from "@/components/observations/RecentObservations";

const daysLeft = (endDate: string | null): string | null => {
  if (!endDate) return null;
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "Termina hoy";
  return days === 1 ? "Queda 1 día" : `Quedan ${days} días`;
};

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const photo = taxonPhotoUrl(challenge.taxon?.default_photo);
  const progress = challenge.my_progress?.progress ?? 0;
  const completed = challenge.my_progress?.completed ?? false;
  const remaining = daysLeft(challenge.end_date);

  return (
    <Link to={`/retos/${challenge.id}`}>
      <Card className="overflow-hidden card-hover h-full flex flex-col">
        <div className="relative h-44 bg-lime-50">
          {photo ? (
            <img src={photo} alt={challenge.taxon ? taxonDisplayName(challenge.taxon) : challenge.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Leaf className="h-12 w-12 text-lime-400" />
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-amber-400 text-forest-950 hover:bg-amber-400 gap-1">
            <Trophy className="h-3.5 w-3.5" /> {challenge.reward_points} pts
          </Badge>
          {completed && (
            <Badge className="absolute top-3 left-3 bg-lime-600 hover:bg-lime-600 gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completado
            </Badge>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 flex-grow">
          <div>
            <h3 className="font-heading font-bold text-forest-900 text-lg leading-tight">{challenge.title}</h3>
            {challenge.taxon && (
              <p className="text-sm text-forest-600 italic">{challenge.taxon.scientific_name}</p>
            )}
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex justify-between text-xs text-forest-700">
              <span>
                {Math.min(progress, challenge.target)} de {challenge.target} avistamiento{challenge.target === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {challenge.participant_count}
              </span>
            </div>
            <Progress value={(Math.min(progress, challenge.target) / challenge.target) * 100} className="h-2" />
            {remaining && (
              <p className="text-xs text-forest-600 flex items-center gap-1">
                <CalendarClock className="h-3 w-3" /> {remaining}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

const Challenges = () => {
  const { data: challenges = [], isLoading, isError } = useChallenges();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Retos de campo</h1>
        <p className="text-forest-700">
          Sal a buscar estas especies, sube la foto de tu avistamiento y gana puntos.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
        </div>
      )}

      {isError && <p className="text-red-600">No pudimos cargar los retos. Intenta de nuevo en un momento.</p>}

      {!isLoading && !isError && challenges.length === 0 && (
        <Card className="p-10 text-center text-forest-700">
          <Trophy className="h-10 w-10 mx-auto mb-3 text-lime-500" />
          No hay retos activos por ahora. ¡Vuelve pronto!
        </Card>
      )}

      {challenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}

      <RecentObservations showViewAll={false} />
    </div>
  );
};

export default Challenges;
