// controllers/shortestPathController.js
const Node = require('../models/Node');
const Edge = require('../models/Edge');

const findShortestPath = async (req, res) => {
  const { start, end } = req.params;

  try {
    const nodes = await Node.find({});
    const edges = await Edge.find({});

    const graph = createGraph(nodes, edges);
    const shortestPath = dijkstra(graph, start, end);

    res.json({ shortestPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to create a graph from nodes and edges
const createGraph = (nodes, edges) => {
  const graph = {};

  nodes.forEach(node => {
    graph[node.id] = { node, edges: {} };
  });

  edges.forEach(edge => {
    graph[edge.start].edges[edge.end] = edge.weight;
    graph[edge.end].edges[edge.start] = edge.weight; // Assuming edges are bidirectional
  });

  return graph;
};

// Dijkstra's algorithm
const dijkstra = (graph, start, end) => {
  const distances = {};
  const visited = {};
  const path = {};

  // Initialize distances and path
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    path[node] = null;
  });

  distances[start] = 0;

  while (true) {
    let minNode = null;

    // Find the unvisited node with the smallest distance
    Object.keys(graph).forEach(node => {
      if (!visited[node] && (minNode === null || distances[node] < distances[minNode])) {
        minNode = node;
      }
    });

    if (minNode === null || distances[minNode] === Infinity) {
      break; // No more reachable nodes
    }

    // Update distances and path for neighboring nodes
    Object.keys(graph[minNode].edges).forEach(neighbor => {
      const newDistance = distances[minNode] + graph[minNode].edges[neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        path[neighbor] = minNode;
      }
    });

    visited[minNode] = true;
  }

  // Reconstruct the shortest path
  const shortestPath = [end];
  let node = end;

  while (path[node] !== null) {
    shortestPath.unshift(path[node]);
    node = path[node];
  }

  return shortestPath;
};

module.exports = {
  findShortestPath,
};
