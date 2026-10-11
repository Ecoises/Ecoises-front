import { Link } from "react-router-dom";
import { BadgeCheck, Bug, Flower2, Leaf, Network, Sparkles, Sprout, Target, TreePine, Utensils, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface EcologicalRole {
  key: string;
  label: string;
  records: number;
  partner_count: number;
  examples: { scientific_name: string; common_name: string | null; taxon_id: number | null }[];
}

export interface EcologicalImportance {
  /** species = datos propios · genus/family = datos de su grupo */
  scope: "species" | "genus" | "family";
  scope_name: string;
  summary: string;
  roles: EcologicalRole[];
  records_total: number;
  source: { name: string; url: string; synced_at: string | null };
}

export interface EcologyText {
  text: string;
  sources: string[];
  reviewed: boolean;
  generated_at: string | null;
}

const roleIcons: Record<string, LucideIcon> = {
  seed_disperser: Sprout,
  pollinator: Flower2,
  insect_control: Bug,
  predator: Target,
  plant_feeder: Utensils,
  dispersed_by: TreePine,
  pollinated_by: Flower2,
  food_source: Network,
};

const scopeTitle = (data: EcologicalImportance) =>
  data.scope === "genus"
    ? `Interacciones registradas para su género, ${data.scope_name}`
    : data.scope === "family"
      ? `Interacciones registradas para su familia, ${data.scope_name}`
      : "Interacciones registradas";

/**
 * "Importancia ecológica" de la ficha:
 *  1. Párrafo de la especie (redactado con IA a partir de datos verificados, o revisado por una persona).
 *  2. Roles y especies con las que interactúa según GloBI (de la especie o, si no hay, de su grupo).
 */
const EcologicalImportanceCard = ({ data, text }: { data?: EcologicalImportance | null; text?: EcologyText | null }) => {
  if (!data && !text) return null;

  return (
    <Card className="mb-6 overflow-hidden border-lime-200 bg-gradient-to-br from-lime-50/90 to-emerald-50/70 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-lime-700 shadow-sm ring-1 ring-lime-100">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="font-heading font-semibold text-forest-950">Importancia ecológica</h3>
            {text ? (
              <>
                <p className="text-sm leading-relaxed text-forest-800">{text.text}</p>
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-forest-600">
                  {text.reviewed ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5 text-lime-700" aria-hidden="true" />
                      Revisado por el equipo de EcoIses
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                      Redactado con IA a partir de {text.sources.length ? text.sources.join(", ") : "datos verificados"}
                    </>
                  )}
                </p>
              </>
            ) : (
              data && <p className="text-sm leading-relaxed text-forest-800">{data.summary}</p>
            )}
          </div>
        </div>

        {data && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-forest-700">{scopeTitle(data)}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.roles.map((role) => {
                const Icon = roleIcons[role.key] ?? Leaf;
                return (
                  <div key={role.key} className="rounded-xl bg-white/80 p-3 ring-1 ring-lime-100">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-lime-700" aria-hidden="true" />
                      <span className="text-sm font-semibold text-forest-900">{role.label}</span>
                      <span className="ml-auto text-xs text-forest-600">
                        {role.partner_count} especie{role.partner_count === 1 ? "" : "s"}
                      </span>
                    </div>
                    {role.examples.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {role.examples.map((example) => {
                          const label = example.common_name || example.scientific_name;
                          const className = "rounded-full bg-lime-100/80 px-2 py-0.5 text-xs text-forest-800";
                          return (
                            <li key={example.scientific_name} title={example.scientific_name}>
                              {example.taxon_id ? (
                                <Link to={`/taxa/${example.taxon_id}`} className={`${className} underline-offset-2 hover:bg-lime-200 hover:underline`}>
                                  {label}
                                </Link>
                              ) : (
                                <span className={`${className} ${example.common_name ? "" : "italic"}`}>{label}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-forest-600">
              Basado en {data.records_total.toLocaleString("es-CO")} interacciones con otras especies registradas en estudios y observaciones publicadas.
              Fuente:{" "}
              <a href={data.source.url} target="_blank" rel="noreferrer" className="underline hover:text-forest-800">
                {data.source.name}
              </a>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EcologicalImportanceCard;
