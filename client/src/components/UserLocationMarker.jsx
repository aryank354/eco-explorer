import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Re-using the same icon logic from before
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export const UserLocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [hasFlown, setHasFlown] = useState(false);
  const map = useMap();

  useEffect(() => {
    // We use getCurrentPosition here for a one-time fetch.
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPos);
      },
      (err) => {
        console.error("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []); // Run only once

  // This effect will fly the map to the user's location when it's first found
  useEffect(() => {
    if (position && !hasFlown) {
      map.flyTo(position, 14, { animate: true, duration: 1.5 });
      setHasFlown(true);
    }
  }, [position, map, hasFlown]);

  if (!position) {
    return null;
  }

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here!</Popup>
    </Marker>
  );
};