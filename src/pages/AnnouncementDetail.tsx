import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, Megaphone } from "lucide-react";
import { Announcement, getAnnouncement } from "@/api/services/educationalContentService";
import { LessonContent } from "@/components/learn/LessonContent";
import { Button } from "@/components/ui/button";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

const AnnouncementDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getAnnouncement(slug)
      .then(setAnnouncement)
      .catch(() => setAnnouncement(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando anuncio…</div>;
  if (!announcement) return <div className="py-24 text-center">Este anuncio no está disponible.</div>;

  const cover = announcement.cover_image
    ? (announcement.cover_image.startsWith("http") ? announcement.cover_image : `${apiUrl}/storage/${announcement.cover_image}`)
    : null;

  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-14">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Volver al inicio
        </Button>
      </Link>

      <header className="space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-lime-700">
          <Megaphone className="h-4 w-4" /> Novedad de Ecoises
        </div>
        <h1 className="text-3xl font-bold leading-tight text-forest-950 md:text-5xl">{announcement.title}</h1>
        {announcement.summary && <p className="text-xl leading-relaxed text-forest-700">{announcement.summary}</p>}
        {cover && <img src={cover} alt="" className="max-h-[520px] w-full rounded-2xl object-cover" />}
      </header>

      {announcement.body && <LessonContent htmlContent={announcement.body} />}

      {announcement.cta_url && (
        <a href={announcement.cta_url} target="_blank" rel="noreferrer">
          <Button className="gap-2">
            {announcement.cta_label || "Conocer más"} <ArrowUpRight className="h-4 w-4" />
          </Button>
        </a>
      )}
    </article>
  );
};

export default AnnouncementDetail;
