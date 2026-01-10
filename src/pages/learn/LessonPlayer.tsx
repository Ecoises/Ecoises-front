import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEducationalContent, EducationalContent, completeLesson } from "@/api/services/educationalContentService";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, Menu, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivitiesSection } from "@/components/activities/ActivitiesSection";
import { LessonContent } from "@/components/learn/LessonContent";
import { References } from "@/components/learn/References";

const LessonPlayer = () => {
    const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<EducationalContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
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
        fetchContent();
    }, [courseSlug]);

    if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
    if (!course) return <div className="h-screen flex items-center justify-center">Curso no encontrado</div>;

    const currentLesson = course.lessons?.find(l => l.id === Number(lessonId));
    const currentLessonIndex = course.lessons?.findIndex(l => l.id === Number(lessonId)) ?? -1;
    const nextLesson = course.lessons?.[currentLessonIndex + 1];
    const previousLesson = course.lessons?.[currentLessonIndex - 1];

    if (!currentLesson) return <div className="h-screen flex items-center justify-center">Lección no encontrada</div>;

    const handleLessonComplete = async () => {
        setCompleting(true);
        try {
            await completeLesson(currentLesson.id);
            // Refresh course data to update sidebar progress
            const updatedCourse = await getEducationalContent(courseSlug!);
            setCourse(updatedCourse);

            if (nextLesson) {
                navigate(`/learn/course/${courseSlug}/lesson/${nextLesson.id}`);
            } else {
                // Course fully completed or last lesson
                navigate(`/learn/course/${courseSlug}`);
            }
        } catch (error) {
            console.error("Error completing lesson:", error);
        } finally {
            setCompleting(false);
        }
    };

    const isLessonCompleted = (lessonId: number) => {
        return course.lesson_progress?.[lessonId]?.status === 'completed';
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Top Bar */}
            <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/learn/course/${courseSlug}`}>
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="font-semibold text-lg truncate max-w-[200px] md:max-w-md hidden md:block">
                        {course.title}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2 hidden md:block">
                        Progreso: {Math.round(course.enrollment?.progress_percentage || 0)}%
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                        <Menu className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <aside className={cn(
                    "absolute md:relative z-10 h-full bg-muted/30 border-r w-80 transition-transform duration-300 md:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="p-4 border-b">
                        <h3 className="font-medium">Contenido del Curso</h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-60px)]">
                        {course.lessons?.map((lesson, idx) => {
                            const active = lesson.id === currentLesson.id;
                            const completed = isLessonCompleted(lesson.id);
                            const locked = !completed && idx > 0 && !isLessonCompleted(course.lessons![idx - 1].id);

                            return (
                                <Link
                                    key={lesson.id}
                                    to={locked ? '#' : `/learn/course/${courseSlug}/lesson/${lesson.id}`}
                                    className={cn(
                                        "flex items-center gap-3 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer",
                                        active && "bg-primary/5 border-l-4 border-l-primary",
                                        locked && "opacity-50 cursor-not-allowed pointer-events-none"
                                    )}
                                >
                                    <div className="shrink-0">
                                        {completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : locked ? (
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                        ) : active ? (
                                            <PlayCircle className="w-5 h-5 text-primary" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs">
                                                {idx + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn("text-sm font-medium truncate", active ? "text-primary" : "text-foreground")}>
                                            {lesson.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{lesson.estimated_duration} min</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background w-full">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-display font-bold">{currentLesson.title}</h2>
                            {isLessonCompleted(currentLesson.id) && (
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Completada
                                </div>
                            )}
                        </div>

                        {/* Lesson Media (Video support can be added later, assuming audio/text for now or generic media) */}
                        {currentLesson.media_url && (
                            <div className="aspect-video bg-black rounded-xl mb-8 flex items-center justify-center">
                                <p className="text-white">Video Player Placeholder: {currentLesson.media_url}</p>
                            </div>
                        )}

                        {/* Lesson Content */}
                        <LessonContent htmlContent={currentLesson.content_text || ''} />

                        {/* Activities */}
                        {currentLesson.activities && currentLesson.activities.length > 0 && (
                            <ActivitiesSection
                                activities={currentLesson.activities}
                                lessonTitle={currentLesson.title}
                            />
                        )}

                        {/* References */}
                        <References references={currentLesson.references} />

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t">
                            {/* Previous Button - hidden on first lesson */}
                            <div className="flex gap-2">
                                {previousLesson && (
                                    <Button variant="outline" onClick={() => navigate(`/learn/course/${courseSlug}/lesson/${previousLesson.id}`)}>
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </Button>
                                )}
                            </div>

                            {/* Next/Complete Buttons */}
                            <div className="flex gap-2">
                                {!isLessonCompleted(currentLesson.id) && (
                                    <Button
                                        variant="outline"
                                        onClick={handleLessonComplete}
                                        disabled={completing}
                                    >
                                        {completing ? "Completando..." : "Marcar como Completada"}
                                    </Button>
                                )}
                                {nextLesson && (
                                    <Button
                                        onClick={() => navigate(`/learn/course/${courseSlug}/lesson/${nextLesson.id}`)}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Siguiente Lección
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LessonPlayer;
