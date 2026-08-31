import { useEffect, useState } from "react";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { Announcement, getAnnouncements } from "@/api/services/educationalContentService";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements(3)
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && announcements.length === 0) return null;

  return (
    <section aria-labelledby="announcements-title" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-lime-100 p-2 text-lime-700"><Megaphone className="h-5 w-5" /></div>
        <div>
          <h2 id="announcements-title" className="text-xl font-bold text-forest-950">Novedades de Ecoises</h2>
          <p className="text-sm text-forest-700">Actividades, convocatorias y contenidos destacados.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {loading ? [...Array(3)].map((_, index) => <Card key={index} className="h-40 animate-pulse bg-lime-50" />) : announcements.map(announcement => {
          const cover = announcement.cover_image
            ? (announcement.cover_image.startsWith("http") ? announcement.cover_image : `${apiUrl}/storage/${announcement.cover_image}`)
            : null;

          return (
            <Card key={announcement.id} className="overflow-hidden border-lime-100 bg-white">
              {cover && <img src={cover} alt="" className="h-32 w-full object-cover" />}
              <div className="space-y-3 p-4">
                <h3 className="font-bold text-forest-900">{announcement.title}</h3>
                {announcement.summary && <p className="line-clamp-3 text-sm text-forest-700">{announcement.summary}</p>}
                <div className="flex flex-wrap gap-3">
                  <Link to={`/announcements/${announcement.slug}`} className="text-sm font-semibold text-lime-700 hover:text-lime-800">
                    Leer anuncio
                  </Link>
                  {announcement.cta_url && (
                    <a href={announcement.cta_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900">
                      {announcement.cta_label || "Conocer más"} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
