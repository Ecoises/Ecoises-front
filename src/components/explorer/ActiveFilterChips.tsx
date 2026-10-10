import { X } from "lucide-react";
import type { ExplorerFilters } from "@/types/explorer";
import { groupLabel } from "./groups";

type Chip = { key: string; label: string; clear: Partial<ExplorerFilters> };

const activeChips = (filters: ExplorerFilters, locationName?: string | null): Chip[] => {
  const chips: Chip[] = [];
  if (filters.lat != null) chips.push({ key: "location", label: `${locationName || "Ubicación"} · ${filters.radius ?? 25} km`, clear: { lat: undefined, lng: undefined } });
  if (filters.q) chips.push({ key: "q", label: `"${filters.q}"`, clear: { q: undefined } });
  if (filters.group) chips.push({ key: "group", label: groupLabel(filters.group) ?? filters.group, clear: { group: undefined } });
  if (filters.endemic) chips.push({ key: "endemic", label: "Endémicas", clear: { endemic: false } });
  if (filters.native) chips.push({ key: "native", label: "Nativas", clear: { native: false } });
  if (filters.threatened) chips.push({ key: "threatened", label: "Amenazadas", clear: { threatened: false } });
  return chips;
};

export const countActiveFilters = (filters: ExplorerFilters) =>
  [filters.group, filters.endemic, filters.native, filters.threatened].filter(Boolean).length;

/**
 * Filtros aplicados como chips removibles + total de especies.
 * En el celular la fila se desliza de lado.
 */
export const ActiveFilterChips = ({
  filters,
  total,
  locationName,
  onClear,
}: {
  filters: ExplorerFilters;
  total?: number;
  locationName?: string | null;
  onClear: (changes: Partial<ExplorerFilters>) => void;
}) => {
  const chips = activeChips(filters, locationName);

  return (
    <div className="flex items-center gap-3">
      <ul className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
        {chips.map((chip) => (
          <li key={chip.key} className="shrink-0">
            <button
              type="button"
              onClick={() => onClear(chip.clear)}
              className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-lime-300 bg-lime-50 pl-3 pr-2 text-xs font-medium text-lime-800 transition-colors duration-200 hover:bg-lime-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
              aria-label={`Quitar filtro ${chip.label}`}
            >
              <span className="max-w-[12rem] truncate">{chip.label}</span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      {typeof total === "number" && (
        <span className="shrink-0 text-xs text-forest-600 tabular-nums" aria-live="polite">
          {total.toLocaleString("es-CO")} especies
        </span>
      )}
    </div>
  );
};
