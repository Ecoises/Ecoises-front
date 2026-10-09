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
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-lime-100/90 text-forest-800 border border-lime-200/70 w-fit">
          <Megaphone className="h-3.5 w-3.5 text-forest-700 fill-lime-200" />
          <span>{announcement.is_pinned ? "ANUNCIO ESPECIAL" : "NOVEDAD"} • {announcement.audience === "authenticated" ? "MIEMBROS" : "COMUNIDAD"}</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-forest-950 md:text-5xl font-heading tracking-tight">{announcement.title}</h1>
        {announcement.summary && <p className="text-xl leading-relaxed text-forest-700">{announcement.summary}</p>}
        {cover && <img src={cover} alt={announcement.title} className="max-h-[520px] w-full rounded-3xl object-cover shadow-md" />}
      </header>

      {announcement.body && <LessonContent htmlContent={announcement.body} />}

      {announcement.cta_url && (
        <div className="pt-4">
          <a href={announcement.cta_url} target="_blank" rel="noreferrer">
            <Button className="gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold text-white bg-[#005c3b] hover:bg-[#00482e] shadow-md shadow-green-950/15 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              {announcement.cta_label || "Participar en la Expedición"} <ArrowUpRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      )}
    </article>
  );
};

export default AnnouncementDetail;
