import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, X, BookOpen, CheckCircle2, Lock, PlayCircle, Clock, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEducationalContent, completeLesson, EducationalContent } from "@/api/services/educationalContentService";
import { ActivitiesSection } from "@/components/activities/ActivitiesSection";
import { LessonContent } from "@/components/learn/LessonContent";
import { References } from "@/components/learn/References";
import { CourseProgress } from "@/components/learn/CourseProgress";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const LessonPlayer = () => {
    const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<EducationalContent | null>(null);
    const [loading, setLoading] = useState(true);
    // Initialize sidebar based on width to prevent flash
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
    const [completing, setCompleting] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);
    const hasAutoSaved = useRef(false);
    const mainContentRef = useRef<HTMLElement>(null);
    const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);

    // Fetch course data function
    const fetchContent = async () => {
        if (!courseSlug) return;
        try {
            const data = await getEducationalContent(courseSlug);
            setCourse(data);
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load/refresh when course or lesson changes to keep progress in sync
    useEffect(() => {
        fetchContent();
    }, [courseSlug, lessonSlug]);

    useEffect(() => {
        // Scroll the main content container to top when lesson changes
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [lessonSlug]);

    // Auto-save removed to prevent 400 errors and rely on explicit navigation completion


    // Sidebar responsive behavior
    useEffect(() => {
        const handleResize = () => {
            // Only force open if moving to desktop.
            // On mobile, let user toggle it. Don't force close if user opened it on desktop then shrank?
            // Actually, standard behavior: Desktop -> Open, Mobile -> Closed by default
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNext = async () => {
        if (!course) return;
        const currentLesson = course.lessons?.find(l => l.slug === lessonSlug);
        if (!currentLesson) return;

        const isCompleted = course.lesson_progress?.[currentLesson.id]?.status === "completada";

        if (!isCompleted) {
            setCompleting(true);
            try {
                await completeLesson(currentLesson.slug);
                // Refresh data to sync enrollment progress and completed activities before navigating
                await fetchContent();
            } catch (error) {
                console.error("Error completing lesson:", error);

                // Show modal if the error message mentions activities
                // Assuming backend returns descriptive message, or generally prompt user
                setShowIncompleteDialog(true);

                setCompleting(false);
                return; // Stop navigation on error
            }
            setCompleting(false);
        }

        if (nextLesson) {
            navigate(`/learn/course/${courseSlug}/lesson/${nextLesson.slug}`);
        } else {
            navigate(`/learn/course/${courseSlug}`);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Curso no encontrado</p>
            </div>
        );
    }

    const currentLesson = course.lessons?.find(l => l.slug === lessonSlug);
    const currentLessonIndex = course.lessons?.findIndex(l => l.slug === lessonSlug) ?? -1;
    const nextLesson = course.lessons?.[currentLessonIndex + 1];
    const previousLesson = course.lessons?.[currentLessonIndex - 1];

    if (!currentLesson) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Lección no encontrada</p>
                <Link to={`/learn/course/${courseSlug}`}>
                    <Button variant="outline">Volver al curso</Button>
                </Link>
            </div>
        );
    }

    const isLessonCompleted = (id: number) => {
        return course.lesson_progress?.[id]?.status === "completada";
    };

    const isCurrentLessonCompleted = isLessonCompleted(currentLesson.id);
    const progressPercentage = course.enrollment?.progress_percentage || 0;
    const hasAudio = !!currentLesson.audio_url;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Top Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-30 h-14 sm:h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm shrink-0 supports-[backdrop-filter]:bg-background/60"
            >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden shrink-0"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>

                    <Link to={`/learn/course/${courseSlug}`} className="shrink-0">
                        <Button variant="ghost" size="sm" className="gap-1 sm:gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Volver</span>
                        </Button>
                    </Link>

                    <div className="hidden md:block h-6 w-px bg-border" />

                    <h1 className="font-semibold text-sm sm:text-base truncate hidden md:block max-w-[300px] lg:max-w-md">
                        {course.title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Lección {currentLessonIndex + 1} de {course.lessons?.length}</span>
                    </div>
                    <div className="hidden md:block w-32">
                        <CourseProgress progress={progressPercentage} />
                    </div>
                </div>
            </motion.header>

            <div className="flex flex-1 overflow-hidden">
                <motion.aside
                    initial={false}
                    animate={{ x: sidebarOpen ? 0 : "-100%" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    className={cn(
                        "w-80 border-r border-border bg-card flex flex-col shrink-0",
                        "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto lg:translate-x-0"
                        // removed "transition-transform" class to let motion handle it, except on desktop where it's relative
                    )}
                    style={{ x: sidebarOpen ? 0 : "-100%" }} // Force initial style for SSR/hydration if needed, but motion handles it
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-sm">Contenido del Curso</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <CourseProgress progress={progressPercentage} />
                    </div>

                    {/* Lessons List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {course.lessons?.map((lesson, index) => {
                            const isCompleted = isLessonCompleted(lesson.id);
                            const isCurrent = lesson.id === currentLesson.id;
                            const isLocked = index > 0 && !isLessonCompleted(course.lessons![index - 1].id);

                            return (
                                <Link
                                    key={lesson.id}
                                    to={isLocked ? '#' : `/learn/course/${courseSlug}/lesson/${lesson.slug}`}
                                    className={cn(
                                        "flex items-center gap-3 p-3 border border-border rounded-lg transition-all cursor-pointer",
                                        isCurrent && "bg-primary/10 border-primary",
                                        !isCurrent && !isLocked && "hover:bg-muted/50",
                                        isLocked && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={(e) => {
                                        if (isLocked) e.preventDefault();
                                        else if (!isCurrent) setSidebarOpen(false);
                                    }}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                        isCompleted && "bg-green-100 text-green-700",
                                        isCurrent && !isCompleted && "bg-primary/20 text-primary",
                                        !isCompleted && !isCurrent && !isLocked && "bg-muted text-muted-foreground",
                                        isLocked && "bg-muted text-muted-foreground"
                                    )}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : isLocked ? (
                                            <Lock className="w-4 h-4" />
                                        ) : isCurrent ? (
                                            <PlayCircle className="w-4 h-4" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm font-medium truncate",
                                            isCurrent && "text-primary",
                                            isLocked && "text-muted-foreground"
                                        )}>
                                            {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            <span>{lesson.estimated_duration} min</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </motion.aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main ref={mainContentRef} className="flex-1 overflow-y-auto flex flex-col min-w-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full">
                        {/* Lesson Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 sm:mb-8"
                        >
                            {/* Audio Button */}
                            {hasAudio && (
                                <button
                                    onClick={() => setIsAudioPlayerOpen(true)}
                                    className="group mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-lime-100 hover:bg-lime-200 text-lime-700 border border-lime-300 rounded-full transition-all duration-200"
                                >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    Escuchar
                                </button>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-sm text-primary font-medium mb-1">
                                        Lección {currentLessonIndex + 1}
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {currentLesson.title}
                                    </h2>
                                </div>
                                {isCurrentLessonCompleted && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium self-start sm:self-auto"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Completada
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Lesson Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <LessonContent htmlContent={currentLesson.content_text || ''} />
                        </motion.div>

                        {/* Activities */}
                        {currentLesson.activities && currentLesson.activities.length > 0 && (
                            <ActivitiesSection
                                activities={currentLesson.activities}
                                lessonTitle={currentLesson.title}
                                completedActivities={course.completed_activities || []}
                                onActivityComplete={fetchContent}
                            />
                        )}

                        {/* References */}
                        <References references={currentLesson.references} />

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t">
                            <div className="flex gap-2">
                                {previousLesson && (
                                    <Button variant="outline" onClick={() => navigate(`/learn/course/${courseSlug}/lesson/${previousLesson.slug}`)}>
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleNext}
                                    disabled={completing || autoSaving}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {completing ? "Procesando..." : nextLesson ? "Siguiente Lección" : "Finalizar Curso"}
                                    {nextLesson ? <ChevronRight className="w-4 h-4 ml-2" /> : <CheckCircle2 className="w-4 h-4 ml-2" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Audio Player */}
            {hasAudio && currentLesson.audio_url && (
                <AudioPlayer
                    audioUrl={currentLesson.audio_url}
                    isOpen={isAudioPlayerOpen}
                    onClose={() => setIsAudioPlayerOpen(false)}
                />
            )}

            <AlertDialog open={showIncompleteDialog} onOpenChange={setShowIncompleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Actividades Pendientes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Para avanzar a la siguiente lección, debes completar todas las actividades obligatorias de esta sección.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowIncompleteDialog(false)}>
                            Entendido
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default LessonPlayer;
