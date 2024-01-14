// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005/api', // Adjust the URL according to your backend setup
});

export const getShortestPath = (startNodeId, endNodeId) => api.get(`/shortest-path/${startNodeId}/${endNodeId}`);
