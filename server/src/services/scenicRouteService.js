const axios = require('axios');

/**
 * Calculates the straight-line distance between two points in kilometers.
 */
function getDistance(start, end) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (end.lat - start.lat) * (Math.PI / 180);
  const dLon = (end.lng - start.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Converts a text destination into geographic coordinates.
 */
async function getCoordinates(placeName) {
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json`;
  try {
    const response = await axios.get(endpoint, {
      params: { access_token: process.env.MAPBOX_ACCESS_TOKEN, limit: 1, proximity: '77.2090,28.6139' }
    });
    if (response.data.features.length === 0) throw new Error(`Could not find coordinates for "${placeName}"`);
    return response.data.features[0].center;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to find destination coordinates.');
  }
}

/**
 * Finds a walking route between two points.
 */
async function getWalkingRoute(start, end, waypoint) {
  const startCoords = `${start.lng},${start.lat}`;
  const endCoords = `${end.lng},${end.lat}`;
  const waypointCoords = waypoint ? `${waypoint.lng},${waypoint.lat}` : '';
  const coordinates = waypoint ? `${startCoords};${waypointCoords};${endCoords}` : `${startCoords};${endCoords}`;
  
  const endpoint = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}`;
  
  try {
    const response = await axios.get(endpoint, {
      params: { access_token: process.env.MAPBOX_ACCESS_TOKEN, geometries: 'geojson', steps: true, overview: 'full' }
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
 * Main service function to generate a scenic route.
 */
const findScenicRoute = async (startCoords, destinationText) => {
  console.log(`Processing AI-enhanced route for:`, destinationText);
  const endCoordsArray = await getCoordinates(destinationText);
  const endCoords = { lng: endCoordsArray[0], lat: endCoordsArray[1] };

  // ✅ ADD DISTANCE CHECK HERE
  const distance = getDistance(startCoords, endCoords);
  if (distance > 50) { // Set a reasonable walking limit (e.g., 50km)
    throw new Error('Destination is too far for a walking route.');
  }

  const scenicWaypoint = { lng: 77.2215, lat: 28.5931 }; // Lodhi Garden
  const routeObject = await getWalkingRoute(startCoords, endCoords, scenicWaypoint);
  return Promise.resolve(routeObject);
};

module.exports = {
  findScenicRoute,
};