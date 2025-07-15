import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';

// --- Marker Icons ---
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// --- Fit map bounds to route ---
const FitBounds = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
};

// --- Tile Sources ---
const LOW_DATA_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

const HIGH_DATA_TILE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
}`;

// --- Main Component ---
const MapView = ({ route, startPoint, endPoint, isSlowConnection }) => {
  const routeCoordinates =
    Array.isArray(route) && route.length > 0
      ? route.map((point) => [point.lat, point.lng])
      : [];

  const endPointCoords =
    routeCoordinates.length > 0
      ? routeCoordinates[routeCoordinates.length - 1]
      : endPoint
      ? [endPoint.lat, endPoint.lng]
      : null;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[28.6139, 77.209]} // Default to Delhi
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        {isSlowConnection ? (
          <TileLayer url={LOW_DATA_TILE_URL} attribution="&copy; CARTO" />
        ) : (
          <TileLayer url={HIGH_DATA_TILE_URL} attribution="&copy; Mapbox" />
        )}

        {/* Route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            pathOptions={{ color: '#10B981', weight: 5, opacity: 0.8 }}
            positions={routeCoordinates}
          />
        )}

        {/* Start Marker */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]} icon={userIcon}>
            <Popup>Start</Popup>
          </Marker>
        )}

        {/* End Marker */}
        {endPointCoords && (
          <Marker position={endPointCoords} icon={destinationIcon}>
            <Popup>{endPoint?.label || 'Destination'}</Popup>
          </Marker>
        )}

        {/* Auto zoom only if route exists */}
        {routeCoordinates.length > 0 && <FitBounds route={route} />}
      </MapContainer>
    </div>
  );
};

export default MapView;
