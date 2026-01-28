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
                    {/* Main Content - Mobile: First (Top), Desktop: First (Left) */}
                    <article className="flex-1 min-w-0">
                        <LessonContent
                            htmlContent={content.article_details?.content_text || ''}
                            className="animate-slide-up"
                        />

                        {/* References */}
                        <References references={content.article_details?.references} className="animate-slide-up" />
                    </article>

                    {/* Sidebar - Mobile: Second (Bottom), Desktop: Second (Right) */}
                    <aside className="lg:w-80 shrink-0 space-y-8">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Author Card - Compact */}
                            {content.author && (
                                <div className="bg-white/80 backdrop-blur-sm p-5 text-center border border-lime-100 rounded-2xl shadow-lg shadow-lime-500/5 relative overflow-hidden group">
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
                                </div>
                            )}

                            {/* Info Card - Details & Tags */}
                            <div className="bg-white/60 backdrop-blur-sm p-5 space-y-4 border border-gray-100 rounded-2xl shadow-sm">
                                <h4 className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2 mb-2">Detalles</h4>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 group">
                                        <div className="p-2 bg-lime-100/50 text-lime-700 rounded-lg group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Tiempo de lectura</p>
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
                            </div>

                            {/* Audio Card */}
                            {content.article_details?.audio_url && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 border border-purple-100 rounded-2xl shadow-inner relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 bg-purple-200/50 w-24 h-24 rounded-full blur-2xl"></div>
                                    <div className="flex items-center gap-3 mb-4 relative z-10">
                                        <div className="p-2 bg-white shadow-sm rounded-lg text-purple-600">
                                            <Volume2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-purple-900">Versión de Audio</p>
                                            <p className="text-xs text-purple-700">Escucha mientras exploras</p>
                                        </div>
                                    </div>

                                    <audio controls className="w-full relative z-10 rounded-lg shadow-sm" style={{ height: '32px' }}>
                                        <source src={content.article_details.audio_url} type="audio/mpeg" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
