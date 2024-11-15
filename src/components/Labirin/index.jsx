import React, { useState, useEffect, useRef } from 'react';
import './MazeGenerator.scss';

import { useAuth0 } from '@auth0/auth0-react';

console.log('Auth0 Domain:', process.env.REACT_APP_AUTH0_DOMAIN);
console.log('Auth0 Client ID:', process.env.REACT_APP_AUTH0_CLIENT_ID);


const MazeGenerator = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [maze, setMaze] = useState([]);
  const [solving, setSolving] = useState(false);
  const [status, setStatus] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [algorithm, setAlgorithm] = useState('dfs');
  const canvasRef = useRef(null);
  const cellSize = 20;
  // const [solveStartTime, setSolveStartTime] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const { loginWithRedirect } = useAuth0();

  const algorithmDescriptions = {
    dfs: "Depth-First Search (DFS) explores as far as possible along each branch before backtracking. It's like exploring a maze by always following the current path until you hit a dead end.",
    bfs: "Breadth-First Search (BFS) explores all neighbor cells before moving to the next level. It's like a flood filling the maze, spreading out in all directions equally."
  };

  const initMaze = (rows, cols) => {
    return Array(rows + 2).fill().map(() => Array(cols + 2).fill(1));
  };

  const drawMaze = (currentPath = [], visited = new Set()) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base maze
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[0].length; col++) {
        ctx.fillStyle = maze[row][col] === 1 ? '#000' : '#fff';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    // Draw visited cells
    ctx.fillStyle = '#ff000040';
    for (let pos of visited) {
      const [row, col] = pos.split(',').map(Number);
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }

    // Draw current path
    ctx.fillStyle = '#00ff0080';
    for (let [row, col] of currentPath) {
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  };

  const generateMaze = async (row, col, newMaze) => {
    const directions = [
      [0, 2],  // right
      [2, 0],  // down
      [0, -2], // left
      [-2, 0]  // up
    ].sort(() => Math.random() - 0.5);
    
    newMaze[row][col] = 0;
    
    for (let [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 1 && newRow < newMaze.length - 1 && 
          newCol >= 1 && newCol < newMaze[0].length - 1 && 
          newMaze[newRow][newCol] === 1) {
        
        newMaze[row + dx/2][col + dy/2] = 0;
        newMaze[newRow][newCol] = 0;
        setMaze([...newMaze]);
        await new Promise(resolve => setTimeout(resolve, 10));
        await generateMaze(newRow, newCol, newMaze);
      }
    }
  };

  const generateNewMaze = async () => {
    if (solving) return;
    
    if (rows < 5 || rows > 50 || cols < 5 || cols > 50) {
      setStatus('Please enter valid dimensions (5-50)');
      return;
    }

    setStatus('Generating maze...');
    const newMaze = initMaze(rows, cols);
    setMaze(newMaze);
    
    const canvas = canvasRef.current;
    canvas.width = (cols + 2) * cellSize;
    canvas.height = (rows + 2) * cellSize;
    
    await generateMaze(1, 1, newMaze);
    
    newMaze[1][1] = 0;
    newMaze[rows][cols] = 0;
    newMaze[rows][cols-1] = 0;
    newMaze[rows-1][cols] = 0;
    
    setMaze(newMaze);
    setStatus('Maze generated!');
  };

  const dfs = async (row, col, visited, path) => {
    const endRow = maze.length - 2;
    const endCol = maze[0].length - 2;

    if (row < 1 || row > endRow || col < 1 || col > endCol ||
        maze[row][col] === 1 || visited.has(`${row},${col}`)) {
      return false;
    }

    visited.add(`${row},${col}`);
    path.push([row, col]);

    if (row === endRow && col === endCol) {
      return true;
    }

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    for (let [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      await new Promise(resolve => setTimeout(resolve, 10));
      drawMaze(path, visited);

      if (await dfs(newRow, newCol, visited, path)) {
        return true;
      }
    }

    path.pop();
    return false;
  };

  const bfs = async (startRow, startCol) => {
    const endRow = maze.length - 2;
    const endCol = maze[0].length - 2;
    const queue = [[startRow, startCol, [[startRow, startCol]]]];
    const visited = new Set([`${startRow},${startCol}`]);
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length > 0) {
      const [row, col, path] = queue.shift();

      if (row === endRow && col === endCol) {
        return path;
      }

      for (let [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newPos = `${newRow},${newCol}`;

        if (newRow >= 1 && newRow <= endRow && 
            newCol >= 1 && newCol <= endCol && 
            maze[newRow][newCol] === 0 && 
            !visited.has(newPos)) {
          
          visited.add(newPos);
          const newPath = [...path, [newRow, newCol]];
          queue.push([newRow, newCol, newPath]);

          await new Promise(resolve => setTimeout(resolve, 10));
          drawMaze(path, visited);
        }
      }
    }
    return null;
  };

  const solveMaze = async () => {
    if (solving || !maze.length) return;
    
    setSolving(true);
    const startTime = Date.now();
    // const algorithm = document.getElementById('algorithm').value;
    setStatus('Solving maze...');
    
    let path = null;
    
    try {
      switch (algorithm) {
        case 'dfs':
          const visited = new Set();
          path = [];
          if (await dfs(1, 1, visited, path)) {
            drawMaze(path, visited);
          }
          break;
        case 'bfs':
          path = await bfs(1, 1);
          if (path) {
            drawMaze(path, new Set());
          }
          break;
        default:
          setStatus('Unknown algorithm selected');
          setSolving(false);
          return;
      }
      
      if (path) {
        const solveTime = ((Date.now() - startTime) / 1000).toFixed(2);
        setStatus('Maze solved!');
        if (isAuthenticated) {
          await updateUserStats({
            algorithm,
            timeToSolve: solveTime,
            mazeSize: { rows, cols }    
          });
        }
      } else {
        setStatus('No solution found!');
      }
    } catch (error) {
      console.error('Error solving maze:', error);
      setStatus('Error solving maze');
    }
    
    setSolving(false);
  };

  useEffect(() => {
    generateNewMaze();
  }, []);

  useEffect(() => {
    if (maze.length > 0) {
      drawMaze();
    }
  }, [maze]);

  const getStatusColor = () => {
    if (status.includes('error') || status.includes('valid')) return 'text-red-500';
    if (status.includes('Solved') || status.includes('generated')) return 'text-green-500';
    return 'text-blue-500';
  };

  const fetchUserMetadata = async () => {
    try {
      if (!isAuthenticated || !user?.sub) return;
  
      console.log('Auth0 Domain:', process.env.REACT_APP_AUTH0_DOMAIN); // Debug log
  
      if (!process.env.REACT_APP_AUTH0_DOMAIN) {
        throw new Error('Auth0 domain is not configured');
      }
  
      console.log('Getting access token...');
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
          scope: "read:current_user update:current_user_metadata"
        }
      });
      console.log('Got access token');
  
      const url = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.sub)}`;
      console.log('Fetching from URL:', url);
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API error: ${errorData.message || response.statusText}`);
      }
  
      const userData = await response.json();
      console.log('User data received:', userData);
      setUserStats(userData.user_metadata || { mazesSolved: 0, solveHistory: [] });
    } catch (error) {
      console.error('Detailed error:', error);
      setStatus('Error fetching user stats');
    }
  };
  
    const updateUserStats = async (solveData) => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,  // Change this
            scope: "read:current_user update:current_user_metadata"
          }
        });
      
      const currentStats = userStats || { mazesSolved: 0, solveHistory: [] };
      const updatedMetadata = {
        mazesSolved: (currentStats.mazesSolved || 0) + 1,
        solveHistory: [...(currentStats.solveHistory || []), {
          date: new Date().toISOString(),
          ...solveData
        }]
      };



      const updateUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${user.sub}`;

      // Use Auth0's Management API endpoint
      const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: updatedMetadata
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to update user stats');
      }
  
      setUserStats(updatedMetadata);
      console.log('Updated user stats:', updatedMetadata);
    } catch (error) {
      console.error('Error updating user stats:', error);
      setStatus('Error updating stats');
    }
  };

  // Load user stats when component mounts
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      console.log('User authenticated:', isAuthenticated);
      console.log('User ID:', user.sub);
      fetchUserMetadata(); // Add this call
    }
  }, [isAuthenticated, user]);

  return (
    <div className="maze-generator-container">
      <div className="maze-generator-wrapper">
        <div className="maze-generator-header">
          <h1 className="maze-generator-header-title">Maze Generator & Solver</h1>
          <p className="maze-generator-header-subtitle">Watch algorithms navigate through procedurally generated mazes</p>
        </div>

        <div className="maze-generator-content">
          <div className="maze-generator-controls">
            <div className="maze-generator-controls-group">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="maze-generator-settings-button"
              >
                Settings {showSettings ? '▼' : '▶'}
              </button>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="maze-generator-algorithm-select"
              >
                <option value="dfs">Depth-First Search</option>
                <option value="bfs">Breadth-First Search</option>
              </select>
            </div>
            
            <div className="maze-generator-controls-group">
              <button
                onClick={generateNewMaze}
                className={`maze-generator-button maze-generator-button-primary`}
                disabled={solving}
              >
                New Maze
              </button>
              <button
                onClick={solveMaze}
                className={`maze-generator-button maze-generator-button-secondary`}
                disabled={solving}
              >
                Solve
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="maze-generator-settings-panel">
              <div className="maze-generator-settings-panel-group">
                <div className="maze-generator-settings-panel-input-group">
                  <label>Rows:</label>
                  <input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    min="5"
                    max="50"
                  />
                </div>
                <div className="maze-generator-settings-panel-input-group">
                  <label>Columns:</label>
                  <input
                    type="number"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    min="5"
                    max="50"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="maze-generator-algorithm-info">
            {algorithmDescriptions[algorithm]}
          </div>

          {status && (
            <div className={`maze-generator-status maze-generator-status-${getStatusColor()}`}>
              {status}
            </div>
          )}

          <div className="maze-generator-canvas-container">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="maze-generator-footer">
          <p>Use the controls above to generate and solve mazes with different algorithms</p>
        </div>
      </div>

      {!isAuthenticated && (
        
            <div className="maze-generator-auth-prompt">
              <div className="maze-generator-auth-prompt-content">
                <h3>Track Your Progress</h3>
                <p>Log in to save your maze-solving statistics and compare with others!</p>
                <button
                  onClick={() => loginWithRedirect()}
                  className="maze-generator-auth-prompt-button"
                >
                  Log In to Track Stats
                </button>
              </div>
            </div>
          )}

      {isAuthenticated && (
        <div>
          <p>Debug: User is authenticated</p>
          <p>Debug: User ID: {user?.sub}</p>
          <p>Debug: User stats exist: {userStats ? 'Yes' : 'No'}</p>
          {userStats && (
            <p>Debug: Mazes solved: {userStats.mazesSolved}</p>
          )}
        </div>
      )}


{isAuthenticated && userStats && (
  <div className="maze-generator-stats">
    <div className="maze-generator-stats-header">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Your Maze Solving Stats
      </h3>
      <div className="stats-summary">
        <div className="stat-item">
          <div className="stat-label">Mazes Solved</div>
          <div className="stat-value">{userStats.mazesSolved || 0}</div>
        </div>
        {userStats.solveHistory && userStats.solveHistory.length > 0 && (
          <div className="stat-item">
            <div className="stat-label">Best Time</div>
            timeToSolve: parseFloat(solveTime),
            <div className="stat-value">
              {(Math.min(...userStats.solveHistory.map(h => h.timeToSolve))).toFixed(3)}s
            </div>
          </div>
        )}
      </div>
    </div>
    
    {userStats.solveHistory && userStats.solveHistory.length > 0 && (
      <div className="maze-generator-stats-history">
        <h4>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Solves
        </h4>
        <ul>
          {userStats.solveHistory.slice(-5).reverse().map((solve, index) => (
            <li key={index}>
              <div className="solve-info">
                <span className="label">Algorithm</span>
                <span className="value">{solve.algorithm.toUpperCase()}</span>
              </div>
              <div className="solve-info">
                <span className="label">Time</span>
                <span className="value">{(solve.timeToSolve / 1000).toFixed(2)}s</span>
              </div>
              <div className="solve-info">
                <span className="label">Size</span>
                <span className="value">{solve.mazeSize.rows}x{solve.mazeSize.cols}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
    </div>
  );

  
};
    


export default MazeGenerator;