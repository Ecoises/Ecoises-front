import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LocateFixed, Loader2, Compass, Map, Layers } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useToast } from "@/hooks/use-toast";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLat?: number | null;
  initialLng?: number | null;
  initialLocationName?: string;
  onConfirm: (coords: { lat: number; lng: number; address?: string }) => void;
}

// Helper component to update map view
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Helper component to handle map clicks
const MapEvents = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

export const LocationMapModal = ({
  open,
  onOpenChange,
  initialLat,
  initialLng,
  initialLocationName = "",
  onConfirm,
}: LocationMapModalProps) => {
  const { toast } = useToast();
  
  // Default to Bogotá, Colombia if no initial coords
  const defaultLat = 4.60971;
  const defaultLng = -74.08175;

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    initialLat || defaultLat,
    initialLng || defaultLng,
  ]);
  const [zoom, setZoom] = useState<number>(initialLat && initialLng ? 16 : 13);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState(initialLocationName);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

  // Geocoding reverso: obtener nombre del lugar basado en coordenadas
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      if (data && data.display_name) {
        // Extraemos una versión más corta para el nombre de la ubicación si es muy larga
        const name = data.name || data.address.road || data.address.suburb || data.address.city || "Ubicación seleccionada";
        const fullAddress = data.display_name;
        setResolvedAddress(fullAddress);
        return { name, fullAddress };
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
    return null;
  }, []);

  // Seleccionar punto en el mapa
  const handleMapClick = useCallback(async (latlng: L.LatLng) => {
    const coords = { lat: latlng.lat, lng: latlng.lng };
    setMarkerPos(coords);
    setMapCenter([latlng.lat, latlng.lng]);
    setResolvedAddress("Buscando dirección...");
    
    const geocodeResult = await reverseGeocode(latlng.lat, latlng.lng);
    if (geocodeResult) {
      setResolvedAddress(geocodeResult.fullAddress);
    } else {
      setResolvedAddress(`Coordenadas: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
    }
  }, [reverseGeocode]);

  // Geolocalización del usuario
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocalización no disponible en tu navegador", variant: "destructive" });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setMarkerPos({ lat: latitude, lng: longitude });
        setZoom(17);
        setGettingLocation(false);
        toast({ title: "📍 Ubicación detectada", description: "El mapa se ha centrado en tu posición." });

        const geocodeResult = await reverseGeocode(latitude, longitude);
        if (geocodeResult) {
          setResolvedAddress(geocodeResult.fullAddress);
        } else {
          setResolvedAddress(`Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      },
      (err) => {
        setGettingLocation(false);
        let errorMsg = "No pudimos obtener tu ubicación actual.";
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Permiso de geolocalización denegado.";
        }
        toast({ title: "Error de geolocalización", description: errorMsg, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [toast, reverseGeocode]);


  // Buscar dirección usando Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        setMapCenter([lat, lng]);
        setMarkerPos({ lat, lng });
        setZoom(16);
        
        const name = first.display_name;
        setResolvedAddress(name);
      } else {
        toast({ title: "No se encontraron resultados para esa búsqueda", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error al realizar la búsqueda de dirección", variant: "destructive" });
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleConfirm = () => {
    if (!markerPos) {
      toast({ title: "Ubicación requerida", description: "Por favor selecciona un punto en el mapa antes de confirmar.", variant: "destructive" });
      return;
    }
    onConfirm({
      lat: markerPos.lat,
      lng: markerPos.lng,
      address: resolvedAddress,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col overflow-hidden rounded-3xl border-lime-200 bg-white">
        
        <DialogHeader className="p-5 border-b border-lime-100 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-forest-950 font-heading">
            Seleccionar Ubicación
          </DialogTitle>
          <DialogDescription className="text-xs text-forest-600 mt-0.5">
            Busca un lugar o haz clic en el mapa para definir el centro de exploración
          </DialogDescription>
        </DialogHeader>

        {/* Search and control bar */}
        <div className="px-5 py-3 bg-lime-50/50 border-b border-lime-100/60 flex-shrink-0 flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
              <Input
                placeholder="Buscar ciudad, calle, parque o coordenadas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-lime-200 bg-white focus:border-lime-400"
              />
            </div>
            <Button
              type="submit"
              disabled={searchingAddress}
              className="bg-lime-500 hover:bg-lime-600 text-white font-medium gap-1"
            >
              {searchingAddress ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGeolocate}
              disabled={gettingLocation}
              className="border-lime-300 text-lime-700 hover:bg-lime-50 gap-1.5"
            >
              {gettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              Mi ubicación
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setMapType(prev => prev === "standard" ? "satellite" : "standard")}
              className="border-lime-300 text-lime-700 hover:bg-lime-50 gap-1.5 hidden sm:flex"
            >
              <Layers className="h-4 w-4" />
              {mapType === "standard" ? "Satélite" : "Estándar"}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full bg-lime-50/20 relative min-h-0 z-10">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            className="h-full w-full"
            zoomControl={true}
          >
            <ChangeView center={mapCenter} zoom={zoom} />
            <MapEvents onClick={handleMapClick} />
            
            {mapType === "standard" ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            ) : (
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}

            {markerPos && (
              <Marker position={[markerPos.lat, markerPos.lng]}>
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-lime-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Marcador colocado
                    </p>
                    <p className="font-medium mt-1 text-gray-700 max-w-[150px] truncate-3-lines">
                      {resolvedAddress || "Ubicación de la observación"}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 font-mono">
                      {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Quick info absolute overlay */}
          {resolvedAddress && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-lime-100 max-w-sm z-[1000] animate-fade-in flex gap-2.5 items-start">
              <Compass className="h-5 w-5 text-lime-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-lime-700 uppercase tracking-wider">Dirección Seleccionada</p>
                <p className="text-xs text-forest-900 font-semibold mt-0.5 line-clamp-2 leading-relaxed">
                  {resolvedAddress}
                </p>
                {markerPos && (
                  <p className="text-[9px] font-mono text-forest-600 mt-1">
                    Lat: {markerPos.lat.toFixed(6)} | Lng: {markerPos.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-lime-100 flex-shrink-0 flex justify-end gap-3 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-lime-200 hover:bg-lime-50 text-forest-700 rounded-full px-6"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-lime-500 hover:bg-lime-600 text-white rounded-full px-6 font-semibold"
          >
            Confirmar ubicación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMapModal;
