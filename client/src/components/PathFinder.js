// components/PathFinder.js
import React, { useState } from 'react';
import axios from 'axios';

const PathFinder = () => {
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [shortestPath, setShortestPath] = useState([]);

  const findShortestPath = () => {
    axios.get(`/api/shortest-path/${startNode}/${endNode}`)
      .then(response => {
        setShortestPath(response.data.shortestPath);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Path Finder</h2>
      <label>Start Node: <input type="text" value={startNode} onChange={(e) => setStartNode(e.target.value)} /></label>
      <label>End Node: <input type="text" value={endNode} onChange={(e) => setEndNode(e.target.value)} /></label>
      <button onClick={findShortestPath}>Find Shortest Path</button>
      <div>
        <h3>Shortest Path</h3>
        <ul>
          {shortestPath.map((node, index) => (
            <li key={index}>{node}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PathFinder;
