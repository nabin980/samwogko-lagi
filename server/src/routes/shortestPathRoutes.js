// routes/shortestPathRoutes.js
const express = require('express');
const router = express.Router();
const shortestPathController = require('../controllers/shortestPathController');

// Define the route for finding the shortest path
router.get('/:start/:end', shortestPathController.findShortestPath);

module.exports = router;
