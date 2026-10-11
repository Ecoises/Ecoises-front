import { Link, useLocation } from "react-router-dom";
import { CornerRightDown, MapPin, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ExplorerSpecies } from "@/types/explorer";
import { groupIcon } from "./groups";

const conservationBadge: Record<string, string> = {
  CR: "bg-red-100 text-red-800 border-red-200",
  EN: "bg-orange-100 text-orange-800 border-orange-200",
  VU: "bg-yellow-100 text-yellow-800 border-yellow-200",
  NT: "bg-lime-100 text-lime-800 border-lime-200",
};

const establishment = (species: ExplorerSpecies) => {
  if (species.is_endemic) return { label: "Endémica", icon: Sparkles, className: "bg-lime-800 text-white border-lime-900" };
  if (species.is_near_endemic) return { label: "Casi endémica", icon: MapPin, className: "bg-lime-600 text-white border-lime-700" };
  if (species.is_native) return { label: "Nativa", icon: Star, className: "bg-lime-300 text-forest-900 border-lime-400" };
  if (species.is_introduced) return { label: "Introducida", icon: CornerRightDown, className: "bg-pink-100 text-pink-800 border-pink-200" };
  return null;
};

const sourceInfo = {
  inaturalist: { label: "Ciencia ciudadana (iNaturalist)", className: "bg-lime-500" },
  gbif: { label: "Registro científico (GBIF)", className: "bg-teal-500" },
};

export const SpeciesCard = ({ species }: { species: ExplorerSpecies }) => {
  const location = useLocation();
  const badge = establishment(species);
  const status = species.conservation_status?.toUpperCase();
  const statusClass = status ? conservationBadge[status] : undefined;
  const source = sourceInfo[species.source];
  const GroupIcon = groupIcon(species.group);
  const name = species.common_name || species.scientific_name;

  return (
    <Link
      to={`/taxa/${species.id}`}
      state={{ from: location, explorerCommonName: species.common_name }}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
    >
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-lime-100/60 bg-white transition-shadow duration-200 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-lime-50">
          {species.default_photo?.url ? (
            <img
              src={species.default_photo.url}
              alt={name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-forest-400">
              <GroupIcon className="h-8 w-8" aria-hidden="true" />
              <span className="text-[11px]">Sin fotografía</span>
            </div>
          )}

          {badge && (
            <span className={`absolute left-2 top-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-sm ${badge.className}`}>
              <badge.icon className="h-3 w-3" aria-hidden="true" />
              {badge.label}
            </span>
          )}
          {statusClass && (
            <span
              className={`absolute right-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-sm ${statusClass}`}
              title={species.conservation_scope === "Colombia" ? "Amenaza en Colombia (Res. 0126 de 2024)" : "Lista Roja de la UICN (global)"}
            >
              {status}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-3 md:p-4">
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-tight text-forest-950 transition-colors group-hover:text-lime-700 md:text-base">
            {name}
          </h3>
          <p className="line-clamp-1 text-xs italic text-forest-600/80 md:text-sm">{species.scientific_name}</p>
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] text-forest-600" title={source.label}>
            <span className={`h-2 w-2 shrink-0 rounded-full ${source.className}`} aria-hidden="true" />
            <span className="truncate">{species.source === "gbif" ? "Registro científico" : "Ciencia ciudadana"}</span>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export const SpeciesCardSkeleton = () => (
  <Card className="overflow-hidden border-lime-100/50 bg-white">
    <div className="aspect-[4/3] animate-pulse bg-lime-50" />
    <div className="space-y-2 p-3 md:p-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
    </div>
  </Card>
);
