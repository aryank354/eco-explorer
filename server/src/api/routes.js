const express = require('express');
const { findScenicRoute } = require('../services/scenicRouteService');

// Create a new router object
const router = express.Router();

// Define the POST endpoint for /api/route
router.post('/route', async (req, res) => {
  try {
    const { startCoords, endCoords } = req.body;

    // Basic validation
    if (!startCoords || !endCoords) {
      return res.status(400).json({ message: 'Missing start or end coordinates.' });
    }

    console.log('Received API call for /api/route');
    // Call our service to get the route
    const route = await findScenicRoute(startCoords, endCoords);

    // Send the calculated route back as a JSON response
    res.status(200).json({ route });

  } catch (error) {
    console.error('Error processing route request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;