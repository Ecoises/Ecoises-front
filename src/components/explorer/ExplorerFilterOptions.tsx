import { ShieldAlert, Shuffle, Sparkles, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExplorerFilters } from "@/types/explorer";
import { EXPLORER_GROUPS } from "./groups";

type Update = (changes: Partial<ExplorerFilters>) => void;

const pill = (active: boolean) =>
  cn(
    "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500",
    active ? "border-lime-600 bg-lime-600 text-white" : "border-lime-200 bg-white text-forest-800 hover:border-lime-400 hover:bg-lime-50"
  );

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-2">
    <legend className="text-xs font-bold uppercase tracking-widest text-forest-900">{title}</legend>
    <div className="flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

/**
 * Opciones de filtro del explorador. Se usan igual en el panel de escritorio
 * y en el panel inferior del celular.
 */
export const ExplorerFilterOptions = ({ filters, onChange }: { filters: ExplorerFilters; onChange: Update }) => (
  <div className="space-y-5">
    <Section title="Grupo">
      <button type="button" className={pill(!filters.group)} aria-pressed={!filters.group} onClick={() => onChange({ group: undefined })}>
        Todos
      </button>
      {EXPLORER_GROUPS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={pill(filters.group === value)}
          aria-pressed={filters.group === value}
          onClick={() => onChange({ group: filters.group === value ? undefined : value })}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </Section>

    <Section title="Origen y estado">
      <button
        type="button"
        className={pill(!!filters.endemic)}
        aria-pressed={!!filters.endemic}
        onClick={() => onChange({ endemic: !filters.endemic, native: false })}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" /> Endémicas
      </button>
      <button
        type="button"
        className={pill(!!filters.native)}
        aria-pressed={!!filters.native}
        onClick={() => onChange({ native: !filters.native, endemic: false })}
      >
        <Star className="h-4 w-4" aria-hidden="true" /> Nativas
      </button>
      <button
        type="button"
        className={pill(!!filters.threatened)}
        aria-pressed={!!filters.threatened}
        onClick={() => onChange({ threatened: !filters.threatened })}
      >
        <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Amenazadas
      </button>
    </Section>

    <Section title="Orden">
      <button type="button" className={pill(filters.order === "popular")} aria-pressed={filters.order === "popular"} onClick={() => onChange({ order: "popular" })}>
        <TrendingUp className="h-4 w-4" aria-hidden="true" /> Más observadas
      </button>
      <button
        type="button"
        className={pill(filters.order === "random")}
        aria-pressed={filters.order === "random"}
        onClick={() => onChange({ order: "random", seed: String(Date.now()) })}
      >
        <Shuffle className="h-4 w-4" aria-hidden="true" /> Descubrir al azar
      </button>
    </Section>
  </div>
);
