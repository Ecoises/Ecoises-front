import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Megaphone, Sparkles, Leaf } from "lucide-react";
import { Announcement, getAnnouncements } from "@/api/services/educationalContentService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
};

const AnnouncementSkeleton = () => (
  <Card className="overflow-hidden border-lime-100/90 bg-white p-5 md:p-6 rounded-2xl shadow-sm animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
      <div className="md:col-span-7 lg:col-span-8 space-y-3">
        <Skeleton className="h-5 w-32 rounded-full bg-lime-100" />
        <Skeleton className="h-7 w-3/4 rounded-lg bg-forest-100/80" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded bg-forest-50" />
          <Skeleton className="h-3.5 w-5/6 rounded bg-forest-50" />
        </div>
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-32 rounded-md bg-lime-200/70" />
          <Skeleton className="h-9 w-28 rounded-md bg-forest-100/60" />
        </div>
      </div>
      <div className="md:col-span-5 lg:col-span-4">
        <Skeleton className="h-44 md:h-48 w-full rounded-xl bg-forest-100/50" />
      </div>
    </div>
  </Card>
);

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getAnnouncements(5)
      .then((data) => setAnnouncements(data || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-avance suave cuando hay más de un anuncio
  useEffect(() => {
    if (announcements.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [announcements.length, isPaused]);

  if (!loading && announcements.length === 0) return null;

  if (loading) {
    return <AnnouncementSkeleton />;
  }

  const current = announcements[currentIndex] || announcements[0];
  const coverUrl = current.cover_image
    ? (current.cover_image.startsWith("http")
        ? current.cover_image
        : `${apiUrl}/storage/${current.cover_image}`)
    : null;

  const description = current.summary?.trim() || stripHtml(current.body);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Card className="overflow-hidden border-lime-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-4 sm:p-5 md:p-6 items-center">
          
          {/* Columna de Información */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              
              {/* Badge y Controles */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="bg-lime-100 text-lime-800 hover:bg-lime-100 border-lime-200/80 px-2.5 py-0.5 text-xs font-semibold gap-1.5"
                >
                  <Megaphone className="h-3 w-3 text-lime-700" />
                  <span>{current.is_pinned ? "Anuncio Especial" : "Novedad"}</span>
                  {current.audience === "authenticated" && (
                    <span className="text-lime-700/80 font-normal">• Miembros</span>
                  )}
                </Badge>

                {/* Controles de navegación si hay múltiples anuncios */}
                {announcements.length > 1 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-forest-600 font-medium mr-1">
                      {currentIndex + 1} / {announcements.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrev}
                      className="h-7 w-7 rounded-full text-forest-700 hover:bg-lime-100 hover:text-forest-900"
                      aria-label="Anuncio anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      className="h-7 w-7 rounded-full text-forest-700 hover:bg-lime-100 hover:text-forest-900"
                      aria-label="Siguiente anuncio"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Título */}
              <Link to={`/announcements/${current.slug}`} className="block group/title">
                <h3 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-forest-950 leading-snug group-hover/title:text-lime-700 transition-colors line-clamp-2">
                  {current.title}
                </h3>
              </Link>

              {/* Resumen / Descripción */}
              {description && (
                <p className="text-xs sm:text-sm text-forest-700 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Acciones provenientes de la base de datos */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {current.cta_url && (
                <a href={current.cta_url} target="_blank" rel="noreferrer">
                  <Button
                    size="sm"
                    className="bg-lime-500 hover:bg-lime-600 text-white font-medium shadow-sm gap-1.5 transition-all"
                  >
                    <span>{current.cta_label || "Conocer más"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}

              <Link to={`/announcements/${current.slug}`}>
                <Button
                  variant={current.cta_url ? "outline" : "default"}
                  size="sm"
                  className={
                    current.cta_url
                      ? "border-lime-200 text-forest-800 hover:bg-lime-50 hover:text-forest-950 gap-1.5"
                      : "bg-lime-500 hover:bg-lime-600 text-white font-medium shadow-sm gap-1.5"
                  }
                >
                  <span>Leer publicación</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Columna de Imagen */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="w-full h-44 sm:h-48 md:h-52 rounded-xl overflow-hidden relative bg-forest-50 border border-lime-100/80">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={current.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-lime-50 to-forest-100 text-forest-700 p-4 text-center">
                  <Leaf className="h-8 w-8 text-lime-600 mb-1" />
                  <span className="text-xs font-semibold">Ecoises Comunidad</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Indicador inferior de puntos si hay múltiples anuncios */}
        {announcements.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 pb-3">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-lime-500" : "w-1.5 bg-lime-200 hover:bg-lime-300"
                }`}
                aria-label={`Ir al anuncio ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnnouncementsSection;
