const express = require('express');
const router = express.Router();
const Edge = require('../models/Edge');

// Create a new edge
router.post('/', async (req, res) => {
  try {
    const newEdge = await Edge.create(req.body);
    res.status(201).json(newEdge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all edges
router.get('/', async (req, res) => {
  try {
    const edges = await Edge.find();
    res.json(edges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific edge by ID
router.get('/:id', async (req, res) => {
  try {
    const edge = await Edge.findById(req.params.id);
    if (!edge) {
      return res.status(404).json({ error: 'Edge not found' });
    }
    res.json(edge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific edge by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEdge = await Edge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEdge) {
      return res.status(404).json({ error: 'Edge not found' });
    }
    res.json(updatedEdge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific edge by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEdge = await Edge.findByIdAndDelete(req.params.id);
    if (!deletedEdge) {
      return res.status(404).json({ error: 'Edge not found' });
    }
    res.json(deletedEdge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
