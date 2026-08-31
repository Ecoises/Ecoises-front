import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Download, ExternalLink, FileText, Images } from "lucide-react";
import { EducationalAsset, EducationalContent, getEducationalContent } from "@/api/services/educationalContentService";
import { Button } from "@/components/ui/button";
import { ContentFeedback } from "@/components/learn/ContentFeedback";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

const assetUrl = (asset: EducationalAsset) => {
  if (asset.external_url) return asset.external_url;
  if (!asset.file_path) return "";
  return asset.file_path.startsWith("http") ? asset.file_path : `${apiUrl}/storage/${asset.file_path}`;
};

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getEducationalContent(slug)
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando recurso…</div>;
  if (!content) return <div className="py-24 text-center">Recurso no encontrado</div>;

  const visualAssets = content.assets?.filter(asset => asset.asset_type === "image" || asset.asset_type === "infographic") ?? [];
  const linkedAssets = content.assets?.filter(asset => asset.asset_type === "document" || asset.asset_type === "external_link") ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-14">
      <Link to="/learn">
        <Button variant="ghost" size="sm" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Volver al Centro de Aprendizaje
        </Button>
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-lime-700">
          <Images className="h-4 w-4" /> Recurso multimedia
        </div>
        <h1 className="text-3xl font-bold text-forest-950 md:text-5xl">{content.title}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-forest-700">{content.description}</p>
      </header>

      {visualAssets.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2">
          {visualAssets.map(asset => (
            <figure key={asset.id} className="overflow-hidden rounded-2xl border border-lime-100 bg-white shadow-sm">
              <img src={assetUrl(asset)} alt={asset.title} className="h-auto w-full object-contain" />
              <figcaption className="space-y-1 p-4">
                <h2 className="font-semibold text-forest-900">{asset.title}</h2>
                {asset.description && <p className="text-sm text-muted-foreground">{asset.description}</p>}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {linkedAssets.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-forest-900">Material para consultar</h2>
          {linkedAssets.map(asset => (
            <a
              key={asset.id}
              href={assetUrl(asset)}
              target="_blank"
              rel="noreferrer"
              download={asset.asset_type === "document" && asset.is_downloadable ? true : undefined}
              className="flex items-center justify-between gap-4 rounded-xl border border-lime-200 bg-white p-4 transition hover:border-lime-400 hover:shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-6 w-6 shrink-0 text-lime-700" />
                <div className="min-w-0">
                  <p className="font-semibold text-forest-900">{asset.title}</p>
                  {asset.description && <p className="text-sm text-muted-foreground">{asset.description}</p>}
                </div>
              </div>
              {asset.asset_type === "external_link" ? <ExternalLink className="h-5 w-5 shrink-0" /> : <Download className="h-5 w-5 shrink-0" />}
            </a>
          ))}
        </section>
      )}

      <ContentFeedback
        contentId={content.id}
        initialRating={content.enrollment?.user_rating}
        initialComment={content.enrollment?.user_feedback}
      />
    </div>
  );
};

export default ResourceDetail;
