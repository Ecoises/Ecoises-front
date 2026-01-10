import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEducationalContent, EducationalContent } from "@/api/services/educationalContentService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Tag, Volume2, ChevronLeft } from "lucide-react";
import { LessonContent } from "@/components/learn/LessonContent";
import { References } from "@/components/learn/References";

const ArticleDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<EducationalContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!slug) return;
            try {
                const data = await getEducationalContent(slug);
                setContent(data);
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!content) {
        return <div className="min-h-screen flex items-center justify-center">Artículo no encontrado</div>;
    }

    const imageUrl = content.thumbnail_url
        ? (content.thumbnail_url.startsWith('http') ? content.thumbnail_url : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${content.thumbnail_url}`)
        : "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400";

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

            <div className="container mx-auto px-6 py-8 sm:py-12">
                {/* Header Section (Title + Image) - Full Width */}
                <header className="mb-8 lg:mb-12 animate-fade-in max-w-5xl mx-auto">
                    <div className="flex gap-3 mb-6 flex-wrap">
                        {content.categories?.map(cat => (
                            <span key={cat.id} className="px-3 py-1 text-xs font-medium bg-secondary rounded-full text-secondary-foreground">
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                        {content.title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                        {content.description}
                    </p>

                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-video lg:aspect-[2/1]">
                        <img src={imageUrl} alt={content.title} className="w-full h-full object-cover" />
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
                    {/* Sidebar - Mobile: First, Desktop: Second (Right) */}
                    <aside className="lg:w-80 shrink-0 lg:order-2">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {content.author && (
                                <div className="glass-card p-6 text-center border rounded-xl bg-white/50">
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

                            <div className="glass-card p-6 space-y-4 border rounded-xl bg-white/50">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Est. duración</p>
                                        <p className="font-medium text-foreground">{content.estimated_duration} min</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nivel</p>
                                        <p className="font-medium text-foreground capitalize">{content.difficulty_level}</p>
                                    </div>
                                </div>
                            </div>

                            {content.article_details?.audio_url && (
                                <div className="glass-card p-6 border-accent/30 border rounded-xl bg-white/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Volume2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Escuchar Artículo</p>
                                        </div>
                                    </div>

                                    <audio controls className="w-full">
                                        <source src={content.article_details.audio_url} type="audio/mpeg" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content - Mobile: Second, Desktop: First (Left) */}
                    <article className="flex-1 lg:order-1 min-w-0">
                        <LessonContent
                            htmlContent={content.article_details?.content_text || ''}
                            className="animate-slide-up"
                        />

                        {/* References */}
                        <References references={content.article_details?.references} className="animate-slide-up" />
                    </article>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
