import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface SpeciesDistributionMapProps {
    taxonId: string | number;
    speciesName: string;
    center?: [number, number];
    zoom?: number;
}

// Component to handle map updates when taxonId changes
function MapUpdater({ taxonId }: { taxonId: string | number }) {
    const map = useMap();

    useEffect(() => {
        // Force map to invalidate size when taxonId changes
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [taxonId, map]);

    return null;
}

const SpeciesDistributionMap = ({
    taxonId,
    speciesName,
    center = [4.5709, -74.2973], // Colombia center (Bogotá)
    zoom = 6
}: SpeciesDistributionMapProps) => {

    // iNaturalist tile URL for heatmap with bright red/orange color for better visibility
    // Color: #FF4500 (OrangeRed) encoded as %23FF4500
    const iNatTileUrl = `https://api.inaturalist.org/v1/colored_heatmap/{z}/{x}/{y}.png?taxon_id=${taxonId}&color=%23FF4500`;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-lime-200 shadow-md">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={true}
            >
                {/* Base map layer - CartoDB Positron (light grayscale for better contrast) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={20}
                />

                {/* iNaturalist observation heatmap overlay with orange/red color */}
                <TileLayer
                    url={iNatTileUrl}
                    attribution='<a href="https://www.inaturalist.org">iNaturalist</a>'
                    opacity={0.75}
                />

                <MapUpdater taxonId={taxonId} />
            </MapContainer>
        </div>
    );
};

export default SpeciesDistributionMap;
