// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Allows us to use environment variables from a .env file

// Import API routes
const apiRoutes = require('./src/api/routes');

// Initialize the Express app
console.log('My Mapbox Token:', process.env.MAPBOX_ACCESS_TOKEN);

const app = express();
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so our React app can talk to this server
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173' // ✅ Add this line
  ] }));


// Enable the express.json middleware to parse JSON request bodies
app.use(express.json());

// --- API Routes ---
// A simple health check route to make sure the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Eco-Explorer API! 🌍' });
});

// Use the dedicated API router for all routes starting with /api
app.use('/api', apiRoutes);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});