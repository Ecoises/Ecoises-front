import { useState } from "react";

const STORAGE_KEY = "ecoises.explorer.location.v1";
const TTL_MS = 24 * 60 * 60 * 1000;

type Coords = { lat: number; lng: number };
type StoredLocation = { coords: Coords; name: string; savedAt: number };

const readStored = (): StoredLocation | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as StoredLocation | null;
    const valid = parsed && Number.isFinite(parsed.coords?.lat) && Number.isFinite(parsed.coords?.lng);
    if (!valid || Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const store = (coords: Coords, name: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ coords, name, savedAt: Date.now() }));
  } catch {
    // Sin almacenamiento disponible: la ubicación dura solo esta visita.
  }
};

/**
 * Ubicación del explorador: GPS del navegador o punto elegido en el mapa.
 * Se recuerda 24 horas en este navegador y se puede quitar en cualquier momento.
 */
export const useExplorerLocation = () => {
  const [initial] = useState(readStored);
  const [coords, setCoords] = useState<Coords | null>(initial?.coords ?? null);
  const [name, setName] = useState<string | null>(initial?.name ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const apply = (next: Coords, nextName: string) => {
    setCoords(next);
    setName(nextName);
    setError(null);
    store(next, nextName);
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }

    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: position }) => {
        const next = { lat: position.latitude, lng: position.longitude };
        apply(next, "Tu ubicación");
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${next.lat}&lon=${next.lng}&zoom=10`
          );
          const { address = {} } = await response.json();
          apply(next, address.city || address.town || address.village || address.municipality || address.county || address.state || "Tu ubicación");
        } catch {
          // Se queda el nombre genérico.
        }
        setIsLocating(false);
      },
      () => {
        setError("No pudimos obtener tu ubicación. Revisa los permisos del navegador.");
        setIsLocating(false);
      }
    );
  };

  const choose = (point: { lat: number; lng: number; address?: string }) =>
    apply({ lat: point.lat, lng: point.lng }, point.address ? point.address.split(",").slice(0, 2).join(",") : "Punto elegido");

  const clear = () => {
    setCoords(null);
    setName(null);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
  };

  return { coords, name, error, isLocating, locate, choose, clear };
};
