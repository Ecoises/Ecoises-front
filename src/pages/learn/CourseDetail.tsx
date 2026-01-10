import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEducationalContent, EducationalContent, startContent } from "@/api/services/educationalContentService";
import { Button } from "@/components/ui/button";
import { Clock, Tag, ChevronLeft, BookOpen, Trophy, PlayCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      try {
        const data = await getEducationalContent(slug);
        setContent(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  const handleStartContinue = async () => {
    if (!content) return;
    setStarting(true);
    try {
      if (!content.enrollment) {
        await startContent(content.slug);
      }
      // Navigate to the player with the first lesson or the last accessed one
      // Ideally, we'd find the first incomplete lesson
      let targetLessonId;
      if (content.lessons && content.lessons.length > 0) {
        // Find first incomplete
        const firstIncomplete = content.lessons.find(l => {
          const progress = content.lesson_progress?.[l.id];
          return !progress || progress.status !== 'completed';
        });
        targetLessonId = firstIncomplete ? firstIncomplete.id : content.lessons[0].id;
      }

      if (targetLessonId) {
        navigate(`/learn/course/${content.slug}/lesson/${targetLessonId}`);
      } else {
        // If no lessons, just stay or show alert (should not happen for valid course)
        console.warn("No lessons found for this course.");
      }

    } catch (error) {
      console.error("Error starting content:", error);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Curso no encontrado</div>;
  }

  const imageUrl = content.thumbnail_url
    ? (content.thumbnail_url.startsWith('http') ? content.thumbnail_url : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${content.thumbnail_url}`)
    : "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400";

  const totalLessons = content.lessons?.length || 0;
  const isEnrolled = !!content.enrollment;
  const progressPercentage = content.enrollment?.progress_percentage || 0;

  return (
    <div className="min-h-screen bg-background pb-12">
      <nav className="bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/learn">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Volver al Centro de Aprendizaje
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-muted/30 pt-12 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex gap-3">
                {content.categories?.map(cat => (
                  <span key={cat.id} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {cat.name}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {content.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {content.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{content.estimated_duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalLessons} lecciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{content.difficulty_level}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" onClick={handleStartContinue} disabled={starting} className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20">
                  {starting ? "Cargando..." : (isEnrolled ? "Continuar Aprendiendo" : "Comenzar Gratis")}
                </Button>
                {isEnrolled && (
                  <div className="mt-4 max-w-xs">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Tu progreso</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group">
              <img src={imageUrl} alt={content.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About Content - Using articleDetails content or standard description if needed */}
            <div className="glass-card p-8 rounded-2xl bg-white space-y-4">
              <h3 className="font-display text-2xl font-bold">Acerca de este curso</h3>
              <div className="prose text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.article_details?.content_text || content.description }} />
            </div>

            {/* Lessons List */}
            <div className="glass-card p-8 rounded-2xl bg-white">
              <h3 className="font-display text-2xl font-bold mb-6">Contenido del Curso</h3>
              <div className="space-y-4">
                {content.lessons?.map((lesson, index) => {
                  const lessonProgress = content.lesson_progress?.[lesson.id];
                  const isCompleted = lessonProgress?.status === 'completed';
                  const isLocked = !isEnrolled && index > 0; // Simple logic: if not enrolled, only first preview? Actually usually lock if previous not done, but here we keep simple.
                  // Better logic: Locked if previous lesson not completed AND not enrolled? 
                  // Or generally, if Enrolled, strict sequence? 
                  // Let's assume linear progression for enrolled users.

                  return (
                    <div key={lesson.id} className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-muted/50",
                      isCompleted ? "border-green-200 bg-green-50/50" : "border-border"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                        isCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.estimated_duration} min</p>
                      </div>
                      {isCompleted && (
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Completado
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Author Card */}
            {content.author && (
              <div className="glass-card p-6 text-center border rounded-xl bg-white">
                <img
                  src={content.author.avatar
                    ? (content.author.avatar.startsWith('http')
                      ? content.author.avatar
                      : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${content.author.avatar}`)
                    : '/placeholder-avatar.png'}
                  alt={content.author.full_name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-accent/50 object-cover"
                />
                <h3 className="font-display font-semibold text-foreground mb-1">{content.author.full_name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Educador</p>
              </div>
            )}

            {/* Course Details Sidebox */}
            {content.course_details && (
              <div className="glass-card p-6 border rounded-xl bg-white space-y-6">
                {content.course_details.goals && (
                  <div>
                    <h4 className="font-semibold mb-3">Lo que aprenderás</h4>
                    <ul className="space-y-2">
                      {content.course_details.goals.map((goal, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-bold text-foreground">{content.course_details.completion_points} Puntos</p>
                      <p className="text-xs text-muted-foreground">al completar el curso</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
