import { BookOpen, Camera, ExternalLink, Leaf, Map as MapIcon, Network, ShieldCheck, TreePine, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providerName } from "@/lib/sources";
import { Card } from "@/components/ui/card";
import type { SpeciesLabels } from "./ConservationBadges";
import type { EcologicalImportance, EcologyText } from "./EcologicalImportanceCard";

interface ProviderText {
  provider?: string | null;
  rights_holder?: string | null;
  license?: string | null;
}

interface Credit {
  key: string;
  icon: LucideIcon;
  title: string;
  detail: string;
  url?: string | null;
}

interface SpeciesAttributionProps {
  scientificName: string;
  labels?: SpeciesLabels | null;
  ecologyText?: EcologyText | null;
  ecologicalImportance?: EcologicalImportance | null;
  summarySource?: string | null;
  ecologyTexts: { label: string; data?: ProviderText | null }[];
  taxonomySource?: string | null;
  hasPhotos: boolean;
  gbifKey?: string | number | null;
  inatId?: string | number | null;
  wikipediaUrl?: string | null;
  eolUrl?: string | null;
  local?: { attribution?: string | null; taxonAuthor?: string | null; inventoryAuthor?: string | null; records?: number | null };
}

/** "http://creativecommons.org/licenses/by-nc-sa/3.0/" → "CC BY-NC-SA 3.0" */
const licenseName = (license: string) => {
  const match = license.match(/creativecommons\.org\/(?:licenses|publicdomain)\/([a-z-]+)\/([\d.]+)/i);
  if (!match) return license;
  return match[1] === "zero" ? `CC0 ${match[2]}` : `CC ${match[1].toUpperCase()} ${match[2]}`;
};

const providerLine = (data: ProviderText) =>
  [data.provider && providerName(data.provider), data.rights_holder].filter(Boolean).join(" · ") +
  (data.license ? ` (${licenseName(data.license)})` : "");

/**
 * Pestaña "Atribución": de dónde sale cada dato de la ficha (etiquetas,
 * textos, fotos, mapa, clasificación e interacciones) y enlaces a las fuentes.
 */
const SpeciesAttribution = (props: SpeciesAttributionProps) => {
  const { labels, ecologyText, ecologicalImportance } = props;
  const credits: Credit[] = [];

  if (labels?.origin) {
    credits.push({ key: "origin", icon: Leaf, title: `Origen: ${labels.origin.label}`, detail: labels.origin.source });
  }
  for (const category of [labels?.national, labels?.global]) {
    if (category) {
      credits.push({
        key: `threat-${category.scope}`,
        icon: ShieldCheck,
        title: `Amenaza ${category.scope === "Colombia" ? "en Colombia" : "global"}: ${category.label} (${category.code})`,
        detail: category.source,
        url: category.url,
      });
    }
  }

  if (props.summarySource) {
    credits.push({ key: "summary", icon: BookOpen, title: "Descripción", detail: props.summarySource, url: props.wikipediaUrl });
  }
  if (ecologyText) {
    credits.push({
      key: "ecology-text",
      icon: Leaf,
      title: "Importancia ecológica",
      detail: ecologyText.reviewed
        ? "Revisado por el equipo de EcoIses"
        : `Redactado con IA a partir de ${ecologyText.sources.length ? ecologyText.sources.join(", ") : "datos verificados"}`,
    });
  }
  for (const { label, data } of props.ecologyTexts) {
    if (data?.provider) {
      credits.push({ key: `eol-${label}`, icon: TreePine, title: label, detail: providerLine(data), url: props.eolUrl });
    }
  }
  if (ecologicalImportance) {
    credits.push({
      key: "interactions",
      icon: Network,
      title: "Interacciones con otras especies",
      detail: ecologicalImportance.source.name,
      url: ecologicalImportance.source.url,
    });
  }
  if (props.hasPhotos) {
    credits.push({ key: "photos", icon: Camera, title: "Fotografías", detail: "iNaturalist · cada foto indica su autor y licencia" });
  }
  credits.push({ key: "map", icon: MapIcon, title: "Mapa de ocurrencias", detail: "GBIF (registros con coordenadas)" });
  if (props.taxonomySource) {
    credits.push({ key: "taxonomy", icon: BookOpen, title: "Clasificación", detail: props.taxonomySource });
  }

  const local = props.local;
  const hasLocal = !!(local && (local.attribution || local.taxonAuthor || local.inventoryAuthor || (local.records ?? 0) > 0));

  const links = [
    {
      label: "iNaturalist",
      url: props.inatId
        ? `https://www.inaturalist.org/taxa/${props.inatId}`
        : `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(props.scientificName)}`,
    },
    props.gbifKey ? { label: "GBIF", url: `https://www.gbif.org/species/${props.gbifKey}` } : null,
    props.wikipediaUrl ? { label: "Wikipedia", url: props.wikipediaUrl } : null,
    { label: "Encyclopedia of Life", url: props.eolUrl || `https://eol.org/search?q=${encodeURIComponent(props.scientificName)}` },
  ].filter((link): link is { label: string; url: string } => !!link);

  return (
    <Card className="space-y-6 border-lime-200 p-5">
      <section aria-labelledby="attribution-sources" className="space-y-3">
        <h3 id="attribution-sources" className="text-xs font-bold uppercase tracking-widest text-forest-700">
          De dónde salen los datos
        </h3>
        <ul className="space-y-2">
          {credits.map((credit) => (
            <li key={credit.key} className="flex items-start gap-3 rounded-xl bg-lime-50/60 p-3 ring-1 ring-lime-100">
              <span className="rounded-lg bg-white p-2 text-lime-700 shadow-sm ring-1 ring-lime-100">
                <credit.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-forest-900">{credit.title}</p>
                <p className="text-xs text-forest-600">
                  {credit.url ? (
                    <a href={credit.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-2 hover:text-forest-900 hover:underline">
                      {credit.detail}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    credit.detail
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {hasLocal && local && (
        <section aria-labelledby="attribution-local" className="space-y-3">
          <h3 id="attribution-local" className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Inventario y registro local
          </h3>
          <div className="space-y-2 rounded-xl bg-lime-50/60 p-3 text-xs text-forest-800 ring-1 ring-lime-100">
            {local.attribution && <p className="italic leading-relaxed">{local.attribution}</p>}
            {local.taxonAuthor && <p><span className="font-semibold text-forest-900">Autor de la descripción: </span>{local.taxonAuthor}</p>}
            {local.inventoryAuthor && <p><span className="font-semibold text-forest-900">Registrado por: </span>{local.inventoryAuthor}</p>}
            {(local.records ?? 0) > 0 && (
              <p>
                <span className="font-semibold text-forest-900">Registros en campus: </span>
                {local.records} {local.records === 1 ? "registro documentado" : "registros documentados"}
              </p>
            )}
          </div>
        </section>
      )}

      <section aria-labelledby="attribution-links" className="space-y-3">
        <h3 id="attribution-links" className="text-xs font-bold uppercase tracking-widest text-forest-700">
          Ver en las fuentes
        </h3>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Button key={link.label} asChild variant="outline" className="h-10 gap-2 rounded-xl border-lime-300 text-lime-700 hover:bg-lime-50 hover:text-lime-800">
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          ))}
        </div>
      </section>
    </Card>
  );
};

export default SpeciesAttribution;
