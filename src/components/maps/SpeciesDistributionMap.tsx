import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeciesDistributionMapProps {
  /** Clave de la especie en GBIF (fuente principal). */
  gbifKey?: string | number | null;
  /** ID de la especie en iNaturalist (respaldo si GBIF no tiene registros). */
  inatId?: string | number | null;
  speciesName: string;
}

type Scope = "colombia" | "mundo";

const COLOMBIA: { center: [number, number]; zoom: number } = { center: [4.5709, -74.2973], zoom: 5 };
const WORLD: { center: [number, number]; zoom: number } = { center: [10, -40], zoom: 2 };
const INAT_COLOMBIA_PLACE = 7196;

/** Reencuadra el mapa al cambiar entre Colombia y el mundo. */
function FitScope({ scope }: { scope: Scope }) {
  const map = useMap();
  useEffect(() => {
    const view = scope === "colombia" ? COLOMBIA : WORLD;
    map.setView(view.center, view.zoom);
    setTimeout(() => map.invalidateSize(), 100);
  }, [scope, map]);
  return null;
}

/** Número de ocurrencias en GBIF para el alcance elegido (una consulta liviana, en caché). */
const useGbifCount = (gbifKey: string | number | null | undefined, scope: Scope) =>
  useQuery({
    queryKey: ["gbif-count", gbifKey, scope],
    queryFn: async () => {
      const country = scope === "colombia" ? "&country=CO" : "";
      const response = await fetch(`https://api.gbif.org/v1/occurrence/count?taxonKey=${gbifKey}${country}`);
      return Number(await response.text());
    },
    enabled: !!gbifKey,
    staleTime: 24 * 60 * 60 * 1000,
  });

/**
 * Mapa de ocurrencias. Fuente principal: GBIF (museos, colecciones, monitoreos
 * y ciencia ciudadana validada). Si GBIF no tiene registros de la especie en el
 * alcance elegido, se muestran las observaciones de iNaturalist.
 * Las capas son imágenes ya preparadas por cada fuente: cargan directo en el
 * navegador, sin pasar por el backend y sin clave de API.
 */
const SpeciesDistributionMap = ({ gbifKey, inatId, speciesName }: SpeciesDistributionMapProps) => {
  const [scope, setScope] = useState<Scope>("colombia");
  const { data: gbifCount, isLoading } = useGbifCount(gbifKey, scope);

  const useGbif = !!gbifKey && (isLoading || (gbifCount ?? 0) > 0);
  const useInat = !useGbif && !!inatId;

  if (!useGbif && !useInat) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-lime-200 bg-lime-50/40 p-6 text-center">
        <MapPinOff className="h-8 w-8 text-lime-500" aria-hidden="true" />
        <p className="text-sm text-forest-700">Todavía no hay registros de {speciesName} en GBIF ni en iNaturalist.</p>
      </div>
    );
  }

  const layer = useGbif
    ? {
        url: `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?srs=EPSG:3857&taxonKey=${gbifKey}${scope === "colombia" ? "&country=CO" : ""}&style=orange.marker`,
        attribution: 'Ocurrencias: <a href="https://www.gbif.org">GBIF.org</a>',
        legend: typeof gbifCount === "number" && gbifCount > 0
          ? `${gbifCount.toLocaleString("es-CO")} registros de ocurrencia (GBIF)`
          : "Registros de ocurrencia (GBIF)",
        link: `https://www.gbif.org/occurrence/search?taxon_key=${gbifKey}${scope === "colombia" ? "&country=CO" : ""}`,
      }
    : {
        url: `https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?taxon_id=${inatId}${scope === "colombia" ? `&place_id=${INAT_COLOMBIA_PLACE}` : ""}&color=%23f56a14`,
        attribution: 'Observaciones: <a href="https://www.inaturalist.org">iNaturalist</a>',
        legend: "Observaciones de ciencia ciudadana (iNaturalist)",
        link: `https://www.inaturalist.org/observations?taxon_id=${inatId}${scope === "colombia" ? `&place_id=${INAT_COLOMBIA_PLACE}` : ""}`,
      };

  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-xl border border-lime-200 shadow-md">
      <MapContainer center={COLOMBIA.center} zoom={COLOMBIA.zoom} scrollWheelZoom={false} className="h-full w-full" zoomControl>
        {/* Mapa base de GBIF: gratuito, sin clave y pensado para mostrar ocurrencias encima. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.openmaptiles.org/">OpenMapTiles</a>, GBIF'
          url="https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-light"
          maxZoom={18}
        />
        <TileLayer key={layer.url} url={layer.url} attribution={layer.attribution} maxZoom={18} />
        <FitScope scope={scope} />
      </MapContainer>

      {/* Alcance del mapa */}
      <div className="absolute right-3 top-3 z-[400] flex rounded-full border border-lime-200 bg-white/95 p-1 shadow-sm" role="group" aria-label="Alcance del mapa">
        {(["colombia", "mundo"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={scope === value}
            onClick={() => setScope(value)}
            className={cn(
              "min-h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition-colors duration-200",
              scope === value ? "bg-lime-600 text-white" : "text-forest-700 hover:bg-lime-50"
            )}
          >
            {value === "colombia" ? "Colombia" : "Mundo"}
          </button>
        ))}
      </div>

      {/* Leyenda con la fuente que se está mostrando */}
      <div className="absolute bottom-8 left-3 right-3 z-[400] flex w-fit max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs text-forest-800 shadow-sm">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
        <span>{layer.legend}</span>
        <a href={layer.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-lime-700 underline-offset-2 hover:underline">
          Ver datos <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default SpeciesDistributionMap;
