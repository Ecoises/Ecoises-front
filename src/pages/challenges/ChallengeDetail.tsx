import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle2, Clock, Leaf, Loader2, Trophy, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useChallenge } from "@/hooks/useChallenges";
import { useAuth } from "@/contexts/AuthContext";
import type { ChallengeEvidence } from "@/api/services/challengeService";
import { taxonDisplayName, taxonPhotoUrl } from "@/lib/taxon";
import { getStorageUrl } from "@/lib/utils";

const statusBadge: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Aprobada", className: "bg-lime-100 text-lime-800", icon: CheckCircle2 },
  rejected: { label: "Rechazada", className: "bg-red-100 text-red-700", icon: XCircle },
  pending: { label: "En revisión", className: "bg-amber-100 text-amber-800", icon: Clock },
};

const EvidenceItem = ({ evidence }: { evidence: ChallengeEvidence }) => {
  const status = statusBadge[evidence.verification_status ?? "pending"];
  const photo = getStorageUrl(evidence.photos?.[0]?.photo_url);

  return (
    <Link to={`/observations/${evidence.id}`} className="flex gap-3 items-center p-3 rounded-xl border border-lime-100 hover:bg-lime-50">
      {photo ? (
        <img src={photo} alt="" className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
      ) : (
        <div className="h-14 w-14 rounded-lg bg-lime-50 flex items-center justify-center">
          <Camera className="h-5 w-5 text-lime-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-forest-900 truncate">{evidence.location_name || "Sin ubicación"}</p>
        <p className="text-xs text-forest-600">
          {evidence.observed_at ? new Date(evidence.observed_at).toLocaleDateString("es-CO") : "Sin fecha"}
        </p>
        {evidence.verification_status === "rejected" && evidence.review_note && (
          <p className="text-xs text-red-600 mt-1">{evidence.review_note}</p>
        )}
      </div>
      <Badge className={`${status.className} gap-1 hover:${status.className}`}>
        <status.icon className="h-3 w-3" /> {status.label}
      </Badge>
    </Link>
  );
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: challenge, isLoading, isError } = useChallenge(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
      </div>
    );
  }

  if (isError || !challenge) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-forest-700">No encontramos este reto.</p>
        <Link to="/retos"><Button variant="outline">Volver a los retos</Button></Link>
      </div>
    );
  }

  const photo = taxonPhotoUrl(challenge.taxon?.default_photo);
  const progress = Math.min(challenge.my_progress?.progress ?? 0, challenge.target);
  const completed = challenge.my_progress?.completed ?? false;
  const submitUrl = `/observations/create?reto=${challenge.id}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <Link to="/retos" className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900">
        <ArrowLeft className="h-4 w-4" /> Retos de campo
      </Link>

      <Card className="overflow-hidden">
        <div className="relative h-64 bg-lime-50">
          {photo ? (
            <img src={photo} alt={challenge.taxon ? taxonDisplayName(challenge.taxon) : ""} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center"><Leaf className="h-16 w-16 text-lime-400" /></div>
          )}
          <Badge className="absolute top-4 right-4 bg-amber-400 text-forest-950 hover:bg-amber-400 text-base gap-1 px-3 py-1">
            <Trophy className="h-4 w-4" /> {challenge.reward_points} puntos
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-forest-950 font-heading">{challenge.title}</h1>
            {challenge.taxon && (
              <Link to={`/taxa/${challenge.taxon.id}`} className="text-forest-600 italic hover:underline">
                {challenge.taxon.common_name ? `${challenge.taxon.common_name} · ` : ""}{challenge.taxon.scientific_name}
              </Link>
            )}
          </div>

          {challenge.description && <p className="text-forest-800 whitespace-pre-line">{challenge.description}</p>}

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-forest-700">
              <span>Tu progreso</span>
              <span>{progress} de {challenge.target}</span>
            </div>
            <Progress value={(progress / challenge.target) * 100} className="h-3" />
          </div>

          <ul className="text-sm text-forest-700 list-disc pl-5 space-y-1">
            <li>Necesitas {challenge.target} avistamiento{challenge.target === 1 ? "" : "s"} de la especie del reto.</li>
            {challenge.requires_photo && <li>Cada avistamiento debe incluir al menos una foto.</li>}
            {challenge.end_date && <li>Disponible hasta el {new Date(challenge.end_date).toLocaleDateString("es-CO")}.</li>}
          </ul>

          {completed ? (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-lime-50 text-lime-800 font-medium">
              <CheckCircle2 className="h-5 w-5" /> ¡Completaste este reto y ganaste {challenge.reward_points} puntos!
            </div>
          ) : (
            // Si no hay sesión, ProtectedRoute lleva al login y regresa aquí después.
            <Link to={submitUrl}>
              <Button className="w-full h-12 bg-lime-500 hover:bg-lime-600 text-white text-base gap-2 rounded-xl">
                <Camera className="h-5 w-5" /> {user ? "Subir mi avistamiento" : "Inicia sesión para participar"}
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {challenge.my_observations.length > 0 && (
        <Card className="p-5 space-y-3">
          <h2 className="font-semibold text-forest-900">Tus evidencias</h2>
          {challenge.my_observations.map((evidence) => (
            <EvidenceItem key={evidence.id} evidence={evidence} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default ChallengeDetail;
