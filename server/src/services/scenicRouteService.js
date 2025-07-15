const axios = require('axios');

/**
 * Calculates the straight-line distance between two points in kilometers.
 */
function getDistance(start, end) {
  const R = 6371; // Radius of Earth in km
  const dLat = (end.lat - start.lat) * (Math.PI / 180);
  const dLon = (end.lng - start.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts a place name to coordinates using Mapbox geocoding.
 */
async function getCoordinates(placeName) {
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        access_token: process.env.MAPBOX_ACCESS_TOKEN,
        limit: 1,
        country: 'IN',                    // ✅ Bias toward India
        proximity: '77.2090,28.6139',    // ✅ Bias toward Delhi (India Gate)
        types: 'poi'                     // ✅ Prefer POIs like monuments
      }
    });

    if (response.data.features.length === 0) {
      console.error(`❌ No geocoding result found for "${placeName}"`);
      throw new Error(`Could not find coordinates for "${placeName}"`);
    }

    const result = response.data.features[0];
    console.log(`📍 Mapbox matched: ${result.place_name}`);
    return result.center;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to find destination coordinates.');
  }
}

/**
 * Uses Mapbox Directions API to get walking route (optionally with a scenic waypoint).
 */
async function getWalkingRoute(start, end, waypoint = null) {
  const startStr = `${start.lng},${start.lat}`;
  const endStr = `${end.lng},${end.lat}`;
  const coordinates = waypoint
    ? `${startStr};${waypoint.lng},${waypoint.lat};${endStr}`
    : `${startStr};${endStr}`;

  const endpoint = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        access_token: process.env.MAPBOX_ACCESS_TOKEN,
        geometries: 'geojson',
        steps: true,
        overview: 'full'
      }
    });

    const routeData = response.data.routes[0];
    return {
      path: routeData.geometry.coordinates.map(p => ({ lat: p[1], lng: p[0] })),
      distance: routeData.distance,
      duration: routeData.duration,
      steps: routeData.legs.flatMap(leg => leg.steps.map(step => step.maneuver.instruction)),
    };
  } catch (error) {
    console.error('Routing error:', error.message);
    throw new Error('Failed to calculate walking route.');
  }
}

/**
 * Main function to calculate scenic route with validation and fallback.
 */
const findScenicRoute = async (startCoords, destinationText) => {
  console.log(`🚀 Processing route for destination: "${destinationText}"`);

  let endCoordsArray;
  try {
    endCoordsArray = await getCoordinates(destinationText);
  } catch (err) {
    console.error('❌ Geocoding failed:', err.message);
    throw new Error("Could not find destination. Try something more specific.");
  }

  const endCoords = { lng: endCoordsArray[0], lat: endCoordsArray[1] };
  const distanceKm = getDistance(startCoords, endCoords);
  console.log(`📏 Distance from start to destination: ${distanceKm.toFixed(2)} km`);

  if (distanceKm > 25) {
    throw new Error(`Destination is too far for a walking route (max 25 km).`);
  }

  const scenicWaypoint = distanceKm <= 10
    ? { lng: 77.2215, lat: 28.5931 } // Lodhi Garden as scenic waypoint
    : null;

  const route = await getWalkingRoute(startCoords, endCoords, scenicWaypoint);
  return route;
};

module.exports = {
  findScenicRoute,
};
