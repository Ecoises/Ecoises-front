import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeciesDistributionMapProps {
  /** Clave de la especie en GBIF. Sin clave se muestra un aviso en lugar del mapa. */
  gbifKey?: string | number | null;
  speciesName: string;
}

type Scope = "colombia" | "mundo";

const COLOMBIA: { center: [number, number]; zoom: number } = { center: [4.5709, -74.2973], zoom: 5 };
const WORLD: { center: [number, number]; zoom: number } = { center: [10, -40], zoom: 2 };

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

/**
 * Mapa de ocurrencias reales registradas en GBIF (museos, colecciones,
 * monitoreos y ciencia ciudadana validada). Las capas son imágenes que GBIF
 * genera ya listas, así que cargan directo en el navegador, sin pasar por el
 * backend y sin clave de API.
 */
const SpeciesDistributionMap = ({ gbifKey, speciesName }: SpeciesDistributionMapProps) => {
  const [scope, setScope] = useState<Scope>("colombia");

  if (!gbifKey) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-lime-200 bg-lime-50/40 p-6 text-center">
        <MapPinOff className="h-8 w-8 text-lime-500" aria-hidden="true" />
        <p className="text-sm text-forest-700">Todavía no encontramos registros de ocurrencia de {speciesName} en GBIF.</p>
      </div>
    );
  }

  const country = scope === "colombia" ? "&country=CO" : "";
  const occurrencesUrl = `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?srs=EPSG:3857&taxonKey=${gbifKey}${country}&style=orange.marker`;
  const gbifLink = `https://www.gbif.org/occurrence/search?taxon_key=${gbifKey}${scope === "colombia" ? "&country=CO" : ""}`;

  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-xl border border-lime-200 shadow-md">
      <MapContainer center={COLOMBIA.center} zoom={COLOMBIA.zoom} scrollWheelZoom={false} className="h-full w-full" zoomControl>
        {/* Mapa base de GBIF: gratuito, sin clave y pensado para mostrar ocurrencias encima. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.openmaptiles.org/">OpenMapTiles</a>, GBIF'
          url="https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=gbif-light"
          maxZoom={18}
        />
        <TileLayer
          key={occurrencesUrl}
          url={occurrencesUrl}
          attribution='Ocurrencias: <a href="https://www.gbif.org">GBIF.org</a>'
          maxZoom={18}
        />
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

      {/* Leyenda */}
      <div className="absolute bottom-8 left-3 z-[400] flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5 text-xs text-forest-800 shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" aria-hidden="true" />
        Registros de ocurrencia (GBIF)
        <a href={gbifLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-lime-700 underline-offset-2 hover:underline">
          Ver datos <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default SpeciesDistributionMap;
