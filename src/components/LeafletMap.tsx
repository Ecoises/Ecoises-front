import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const birdIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hotspotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface SightingData {
  id: number;
  birdName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
  observer: string;
  category: string;
}

interface HotspotData {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
  birdCount: number;
  topSpecies: string[];
}

interface LeafletMapProps {
  sightings: SightingData[];
  hotspots: HotspotData[];
  activeTab: 'sightings' | 'hotspots';
}

// Component to fit bounds when data changes
const FitBounds = ({ sightings, hotspots, activeTab }: LeafletMapProps) => {
  const map = useMap();

  useEffect(() => {
    const data = activeTab === 'sightings' ? sightings : hotspots;
    if (data.length > 0) {
      const coordinates = data.map(item => [item.coordinates.lat, item.coordinates.lng] as [number, number]);
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, sightings, hotspots, activeTab]);

  return null;
};

const LeafletMap = ({ sightings, hotspots, activeTab }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="h-[500px] w-full relative">
      <MapContainer
        center={[40.7589, -73.9851]} // New York City center
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds sightings={sightings} hotspots={hotspots} activeTab={activeTab} />
        
        {activeTab === 'sightings' && sightings.map(sighting => (
          <Marker 
            key={sighting.id} 
            position={[sighting.coordinates.lat, sighting.coordinates.lng]}
            icon={birdIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-forest-900">{sighting.birdName}</h3>
                <p className="text-sm text-forest-700 mb-1">{sighting.location}</p>
                <div className="text-xs text-forest-600">
                  <p>{sighting.date} at {sighting.time}</p>
                  <p>Observed by: {sighting.observer}</p>
                  <span className="inline-block bg-lime-100 text-lime-800 px-2 py-1 rounded-full mt-1">
                    {sighting.category}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {activeTab === 'hotspots' && hotspots.map(hotspot => (
          <Marker 
            key={hotspot.id} 
            position={[hotspot.coordinates.lat, hotspot.coordinates.lng]}
            icon={hotspotIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-forest-900">{hotspot.name}</h3>
                <p className="text-sm text-forest-700 mb-2">{hotspot.birdCount} species recorded</p>
                <div className="text-xs">
                  <p className="text-forest-600 mb-1">Top species:</p>
                  <div className="flex flex-wrap gap-1">
                    {hotspot.topSpecies.map((species, index) => (
                      <span key={index} className="bg-forest-100 text-forest-800 px-1 py-0.5 rounded text-xs">
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;