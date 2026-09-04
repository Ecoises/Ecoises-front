import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, CheckCircle2, Clock3, GraduationCap, Sparkles, Trophy } from "lucide-react";
import { getLearningDashboard, LearningDashboardData, LearningEnrollment } from "@/api/services/learningDashboardService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const contentPath = (enrollment: LearningEnrollment) => `/learn/${enrollment.content.type}/${enrollment.content.slug}`;

const LearningCard = ({ enrollment }: { enrollment: LearningEnrollment }) => (
  <article className="rounded-2xl border border-lime-100 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Badge variant="secondary" className="mb-2 capitalize">{enrollment.content.type}</Badge>
        <h3 className="truncate font-semibold text-forest-950">{enrollment.content.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-forest-700">{enrollment.content.description}</p>
      </div>
      <span className="shrink-0 text-sm font-bold text-lime-700">{Math.round(enrollment.progress_percentage)}%</span>
    </div>
    <Progress value={enrollment.progress_percentage} className="my-4 h-2" />
    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
      <span>{enrollment.points_earned} puntos obtenidos</span>
      <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-lime-300">
        <Link to={contentPath(enrollment)}>Continuar</Link>
      </Button>
    </div>
  </article>
);

const Profile = () => {
  const [dashboard, setDashboard] = useState<LearningDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = () => {
    setLoading(true);
    setError(false);
    getLearningDashboard()
      .then(setDashboard)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(loadDashboard, []);

  if (loading) {
    return <div className="space-y-5 py-6"><Skeleton className="h-44 rounded-3xl" /><Skeleton className="h-28 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div>;
  }

  if (error || !dashboard) {
    return <div className="py-20 text-center"><p className="mb-4 text-muted-foreground">No pudimos cargar tu progreso.</p><Button onClick={loadDashboard}>Reintentar</Button></div>;
  }

  const { learner, stats } = dashboard;
  const initials = learner.name?.split(" ").map(part => part[0]).slice(0, 2).join("") || "EC";

  return (
    <div className="space-y-8 pb-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 to-lime-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 border-4 border-white/20">
            <AvatarImage src={learner.avatar} alt={learner.name} />
            <AvatarFallback className="bg-lime-100 text-xl font-bold text-forest-900">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-lime-100">Mi espacio de aprendizaje</p>
            <h1 className="truncate text-3xl font-bold">{learner.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white hover:bg-white/20">{learner.level?.icon || "🌱"} {learner.level?.name || "Explorador"}</Badge>
              <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-300"><Trophy className="mr-1 h-3.5 w-3.5" />{learner.total_points} puntos</Badge>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-lime-100">
            <span>Progreso de nivel</span>
            <span>{learner.next_level ? `${learner.next_level.points_remaining} puntos para ${learner.next_level.name}` : "Nivel máximo alcanzado"}</span>
          </div>
          <Progress value={learner.level_progress} className="h-2.5 bg-white/20" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [BookOpen, "Iniciados", stats.enrolled],
          [GraduationCap, "En progreso", stats.in_progress],
          [CheckCircle2, "Completados", stats.completed],
          [Clock3, "Minutos aprendiendo", stats.time_spent_minutes],
        ].map(([Icon, label, value]) => (
          <div key={label as string} className="rounded-2xl border border-lime-100 bg-white p-4 shadow-sm">
            <Icon className="mb-3 h-5 w-5 text-lime-700" />
            <p className="text-2xl font-bold text-forest-950">{value as number}</p>
            <p className="text-xs text-muted-foreground">{label as string}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div><p className="text-sm font-medium text-lime-700">Tu ruta actual</p><h2 className="text-2xl font-bold text-forest-950">Continúa aprendiendo</h2></div>
          <Button asChild variant="ghost"><Link to="/learn">Explorar contenidos</Link></Button>
        </div>
        {dashboard.continue_learning.length ? (
          <div className="grid gap-4 md:grid-cols-2">{dashboard.continue_learning.map(item => <LearningCard key={item.id} enrollment={item} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-lime-200 p-8 text-center text-forest-700">No tienes contenidos pendientes. Explora el centro de aprendizaje para comenzar.</div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-forest-950"><Award className="h-5 w-5 text-amber-500" />Logros recientes</h2>
          <div className="space-y-3">
            {dashboard.achievements.slice(0, 5).map(achievement => (
              <div key={`${achievement.id}-${achievement.earned_at}`} className="flex items-center gap-3 rounded-xl bg-amber-50 p-3">
                <span className="text-2xl">{achievement.icon_url || "🏅"}</span>
                <div><p className="font-semibold text-forest-950">{achievement.name}</p><p className="text-xs text-forest-700">{achievement.description}</p></div>
              </div>
            ))}
            {!dashboard.achievements.length && <p className="py-6 text-center text-sm text-muted-foreground">Completa actividades para desbloquear tu primer logro.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-forest-950"><Sparkles className="h-5 w-5 text-lime-600" />Actividad de puntos</h2>
          <div className="space-y-3">
            {dashboard.recent_points.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between gap-3 border-b border-lime-50 pb-3 last:border-0">
                <div><p className="text-sm font-medium text-forest-900">{transaction.description || "Actividad educativa"}</p><p className="text-xs text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString("es-CO")}</p></div>
                <span className="font-bold text-lime-700">+{transaction.points}</span>
              </div>
            ))}
            {!dashboard.recent_points.length && <p className="py-6 text-center text-sm text-muted-foreground">Aquí aparecerán los puntos obtenidos en tus actividades.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
