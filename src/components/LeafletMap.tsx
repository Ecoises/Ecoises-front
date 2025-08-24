import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

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

interface SimpleMapProps {
  sightings: SightingData[];
  hotspots: HotspotData[];
  activeTab: 'sightings' | 'hotspots';
}

const SimpleMap = ({ sightings, hotspots, activeTab }: SimpleMapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  
  const data = activeTab === 'sightings' ? sightings : hotspots;
  
  // Calculate bounds for the map display
  const bounds = data.length > 0 ? {
    minLat: Math.min(...data.map(item => item.coordinates.lat)),
    maxLat: Math.max(...data.map(item => item.coordinates.lat)),
    minLng: Math.min(...data.map(item => item.coordinates.lng)),
    maxLng: Math.max(...data.map(item => item.coordinates.lng)),
  } : { minLat: 40.7, maxLat: 40.8, minLng: -74.0, maxLng: -73.9 };
  
  // Convert coordinates to percentage positions
  const getPosition = (coordinates: { lat: number; lng: number }) => {
    const latRange = bounds.maxLat - bounds.minLat || 0.1;
    const lngRange = bounds.maxLng - bounds.minLng || 0.1;
    
    return {
      x: ((coordinates.lng - bounds.minLng) / lngRange) * 100,
      y: ((bounds.maxLat - coordinates.lat) / latRange) * 100
    };
  };

  return (
    <div className="h-[500px] w-full relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border border-lime-200">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#059669" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-forest-900">
          {activeTab === 'sightings' ? 'Bird Sightings' : 'Birding Hotspots'}
        </h3>
      </div>
      
      {/* Markers */}
      {data.map((item) => {
        const position = getPosition(item.coordinates);
        const isSighting = 'birdName' in item;
        
        return (
          <div
            key={item.id}
            className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 hover:scale-110 ${
              selectedMarker === item.id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            onClick={() => setSelectedMarker(selectedMarker === item.id ? null : item.id)}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
              isSighting 
                ? 'bg-lime-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <MapPin className="w-3 h-3" />
            </div>
            
            {/* Popup */}
            {selectedMarker === item.id && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-[200px] border border-lime-200 animate-fade-in">
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-lime-200 rotate-45"></div>
                
                {isSighting ? (
                  <div>
                    <h4 className="font-bold text-forest-900 text-sm">{(item as SightingData).birdName}</h4>
                    <p className="text-xs text-forest-700 mb-1">{item.location}</p>
                    <div className="text-xs text-forest-600">
                      <p>{(item as SightingData).date} at {(item as SightingData).time}</p>
                      <p>Observer: {(item as SightingData).observer}</p>
                      <span className="inline-block bg-lime-100 text-lime-800 px-2 py-1 rounded-full mt-1">
                        {(item as SightingData).category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-forest-900 text-sm">{(item as HotspotData).name}</h4>
                    <p className="text-xs text-forest-700 mb-2">{(item as HotspotData).birdCount} species recorded</p>
                    <div className="text-xs">
                      <p className="text-forest-600 mb-1">Top species:</p>
                      <div className="flex flex-wrap gap-1">
                        {(item as HotspotData).topSpecies.slice(0, 2).map((species, index) => (
                          <span key={index} className="bg-forest-100 text-forest-800 px-1 py-0.5 rounded text-xs">
                            {species}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
            <span className="text-forest-700">Sightings</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-forest-700">Hotspots</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;