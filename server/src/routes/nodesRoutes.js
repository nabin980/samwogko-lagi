const express = require('express');
const router = express.Router();
const Node = require('../models/Node');

// Create a new node
router.post('/', async (req, res) => {
  try {
    const newNode = await Node.create(req.body);
    res.status(201).json(newNode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all nodes
router.get('/', async (req, res) => {
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific node by ID
router.get('/:id', async (req, res) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(node);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific node by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedNode = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNode) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(updatedNode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific node by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNode = await Node.findByIdAndDelete(req.params.id);
    if (!deletedNode) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(deletedNode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
