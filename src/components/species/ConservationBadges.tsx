import { CornerRightDown, ExternalLink, MapPin, Sparkles, Star } from "lucide-react";

interface Category {
  code: string;
  label: string;
  scope: "Colombia" | "Global";
  source: string;
  url?: string;
}

interface Origin {
  status: "endemic" | "near_endemic" | "native" | "introduced";
  label: string;
  source: string;
}

export interface SpeciesLabels {
  national: Category | null;
  global: Category | null;
  origin: Origin | null;
}

const categoryClass: Record<string, string> = {
  EX: "bg-gray-900 text-white",
  EW: "bg-purple-100 text-purple-800",
  CR: "bg-red-100 text-red-800",
  EN: "bg-orange-100 text-orange-800",
  VU: "bg-yellow-100 text-yellow-800",
  NT: "bg-lime-100 text-lime-800",
  LC: "bg-green-100 text-green-800",
  DD: "bg-gray-100 text-gray-800",
};

const originStyle: Record<Origin["status"], { className: string; icon: typeof Star }> = {
  endemic: { className: "bg-lime-800 text-white", icon: Sparkles },
  near_endemic: { className: "bg-lime-600 text-white", icon: MapPin },
  native: { className: "bg-lime-300 text-forest-900", icon: Star },
  introduced: { className: "bg-pink-100 text-pink-800", icon: CornerRightDown },
};

const CategoryBadge = ({ category }: { category: Category }) => {
  const content = (
    <>
      {category.label} ({category.code}) · {category.scope}
      {category.url && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
    </>
  );
  const className = `inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${categoryClass[category.code] ?? "bg-gray-100 text-gray-800"}`;

  return category.url ? (
    <a href={category.url} target="_blank" rel="noreferrer" className={`${className} hover:opacity-90`} title={`Fuente: ${category.source}`}>
      {content}
    </a>
  ) : (
    <span className={className} title={`Fuente: ${category.source}`}>{content}</span>
  );
};

/**
 * Etiquetas oficiales de la especie: origen (endémica, nativa, introducida),
 * amenaza en Colombia (Res. 0126 de 2024) y amenaza global (UICN).
 * Cada etiqueta muestra su fuente al pasar el cursor y en la línea inferior.
 */
const ConservationBadges = ({ labels }: { labels?: SpeciesLabels | null }) => {
  if (!labels || (!labels.origin && !labels.national && !labels.global)) return null;

  const sources = [labels.origin?.source, labels.national?.source, labels.global?.source].filter(Boolean);
  const OriginIcon = labels.origin ? originStyle[labels.origin.status].icon : null;

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        {labels.origin && OriginIcon && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${originStyle[labels.origin.status].className}`}
            title={`Fuente: ${labels.origin.source}`}
          >
            <OriginIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {labels.origin.label}
          </span>
        )}
        {labels.national && <CategoryBadge category={labels.national} />}
        {labels.global && <CategoryBadge category={labels.global} />}
      </div>
      <p className="text-xs text-forest-600">Fuentes: {[...new Set(sources)].join(" · ")}</p>
    </div>
  );
};

export default ConservationBadges;
