import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Tag,
  ChevronLeft,
  BookOpen,
  Trophy,
  PlayCircle,
  CheckCircle2,
  Users,
  Star,
  Award
} from "lucide-react";
import { getEducationalContent, startContent, EducationalContent } from "@/api/services/educationalContentService";
import { CourseProgress } from "@/components/learn/CourseProgress";
import { LessonCard } from "@/components/learn/LessonCard";
import { useAuth } from "@/contexts/AuthContext";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setStarting(true);
    try {
      if (!content.enrollment) {
        await startContent(content.slug);
      }

      let targetLessonId;
      if (content.lessons && content.lessons.length > 0) {
        const firstIncomplete = content.lessons.find(l => {
          const progress = content.lesson_progress?.[l.id];
          return !progress || progress.status !== "completada";
        });
        targetLessonId = firstIncomplete ? firstIncomplete.id : content.lessons[0].id;
      }

      if (targetLessonId) {
        navigate(`/learn/course/${content.slug}/lesson/${targetLessonId}`);
      }
    } catch (error) {
      console.error("Error starting content:", error);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <BookOpen className="w-16 h-16 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">Curso no encontrado</p>
        <Link to="/learn">
          <Button variant="outline">Volver al Centro de Aprendizaje</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = content.thumbnail_url
    ? (content.thumbnail_url.startsWith('http')
      ? content.thumbnail_url
      : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${content.thumbnail_url}`)
    : "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400";

  const totalLessons = content.lessons?.length || 0;
  const isEnrolled = !!content.enrollment;
  const progressPercentage = content.enrollment?.progress_percentage || 0;
  const completedLessons = Object.values(content.lesson_progress || {}).filter(
    p => p.status === "completada"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-[3.5rem] sm:top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/learn">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Centro de Aprendizaje</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 order-2 lg:order-1"
            >
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {content.categories?.map(cat => (
                  <motion.span
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-full"
                  >
                    {cat.name}
                  </motion.span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {content.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{content.estimated_duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{totalLessons} lecciones</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="capitalize">{content.difficulty_level}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 space-y-4">
                <Button
                  size="lg"
                  onClick={handleStartContinue}
                  disabled={starting}
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {starting ? "Cargando..." : isEnrolled ? "Continuar Aprendiendo" : "Comenzar Gratis"}
                </Button>

                {isEnrolled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-sm"
                  >
                    <CourseProgress progress={progressPercentage} />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completedLessons} de {totalLessons} lecciones completadas
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={imageUrl}
                  alt={content.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border p-6 sm:p-8 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Contenido del Curso</h3>
                <span className="text-sm text-muted-foreground">
                  {totalLessons} lecciones • {content.estimated_duration} min
                </span>
              </div>
              <div className="space-y-3">
                {content.lessons?.map((lesson, index) => {
                  const lessonProgress = content.lesson_progress?.[lesson.id];
                  const isCompleted = lessonProgress?.status === "completada";
                  // Sequentially lock future lessons: Locked if not first AND (User not enrolled OR Previous not completed)
                  // Actually, if Enrolled, strict sequential locking. If not enrolled, only first is free (if that's the model, or all locked). 
                  // Assuming user must enroll to play. If enrolled, enforce sequence.
                  // If Enrolled: Locked = index > 0 && Previous != Completed
                  // If Not Enrolled: Locked = index > 0 (Preview mode?)
                  const previousLessonProgress = index > 0 ? content.lesson_progress?.[content.lessons![index - 1].id] : null;
                  const isLocked = index > 0 && (!isEnrolled || previousLessonProgress?.status !== 'completada');

                  const isCurrent = !isCompleted && !isLocked && (index === 0 || previousLessonProgress?.status === "completada");

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      isCompleted={isCompleted}
                      isLocked={isLocked}
                      isCurrent={isCurrent}
                      onClick={() => navigate(`/learn/course/${content.slug}/lesson/${lesson.id}`)}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Author Card - Compact */}
            {content.author && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm p-5 text-center border border-lime-100 rounded-2xl shadow-lg shadow-lime-500/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 to-emerald-500"></div>

                <div className="flex items-center gap-4 text-left">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-lime-400 to-emerald-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <img
                      src={content.author.avatar
                        ? (content.author.avatar.startsWith('http')
                          ? content.author.avatar
                          : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${content.author.avatar}`)
                        : '/placeholder-avatar.png'}
                      alt={content.author.full_name}
                      className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover relative z-10"
                    />
                    {/* Verified Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white z-20" title="Verificado">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.751zM11 8a1 1 0 01-1 1H9v2a1 1 0 11-2 0V9a1 1 0 011-1h1a1 1 0 011 1zm0 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-forest-900 leading-tight">{content.author.full_name}</h3>
                    <p className="text-xs font-medium text-lime-600 mt-1">Educador Verificado</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Card - Details & Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/60 backdrop-blur-sm p-5 space-y-4 border border-gray-100 rounded-2xl shadow-sm"
            >
              <h4 className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2 mb-2">Detalles del Curso</h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-lime-100/50 text-lime-700 rounded-lg group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Duración Total</p>
                    <p className="font-bold text-sm text-forest-900">{content.estimated_duration} min</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-blue-100/50 text-blue-700 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Nivel</p>
                    <p className="font-bold text-sm text-forest-900 capitalize">{content.difficulty_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-amber-100/50 text-amber-700 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Lecciones</p>
                    <p className="font-bold text-sm text-forest-900">{totalLessons} lecciones</p>
                  </div>
                </div>

                {/* Categories / Tags */}
                {content.categories && content.categories.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 mt-2">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Etiquetas</p>
                    <div className="flex flex-wrap gap-2">
                      {content.categories.map(cat => (
                        <span key={cat.id} className="px-2 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-md border border-secondary">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Goals Card */}
            {content.course_details?.goals && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border p-6 rounded-2xl"
              >
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Lo que aprenderás
                </h4>
                <ul className="space-y-3">
                  {content.course_details.goals.map((goal, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Points Card */}
            {content.course_details?.completion_points && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-primary to-primary/80 p-6 rounded-2xl text-primary-foreground"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{content.course_details.completion_points}</p>
                    <p className="text-sm opacity-90">Puntos al completar</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
