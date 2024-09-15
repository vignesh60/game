import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";

const Game = () => {
  const [mouseX, setMouseX] = useState(window.innerWidth / 2);
  const [arrows, setArrows] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [enemySpeed, setEnemySpeed] = useState(2);
  const [spawnRate, setSpawnRate] = useState(1000); // Initial spawn rate of 1 second
  const [isGameRunning, setIsGameRunning] = useState(false); // Game running state
  const [gameInterval, setGameInterval] = useState(null);
  const [spawnInterval, setSpawnInterval] = useState(null);
  const [difficultyInterval, setDifficultyInterval] = useState(null);

  // Track mouse movement (horizontal only, at the bottom)
  const handleMouseMove = (event) => {
    const newMouseX = event.clientX;
    setMouseX(newMouseX);
  };

  // Handle right-click to shoot
  const handleRightClick = (event) => {
    event.preventDefault();
    if (isGameRunning) {
      setArrows([...arrows, { x: mouseX, y: window.innerHeight - 70 }]);
    }
  };

  // Spawning enemies (birds or insects)
  const spawnEnemies = () => {
    const newEnemies = [];
    for (let i = 0; i < 2; i++) {
      // Spawn 2 enemies per cycle
      const newEnemy = {
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: 0,
        speed: enemySpeed,
      };
      newEnemies.push(newEnemy);
    }
    setEnemies((prevEnemies) => [...prevEnemies, ...newEnemies]);
  };

  // Move arrows and enemies
  const gameLoop = () => {
    // Move arrows upwards
    setArrows((prevArrows) =>
      prevArrows.map((arrow) => ({ ...arrow, y: arrow.y - 5 }))
    );

    // Move enemies downwards
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => ({ ...enemy, y: enemy.y + enemy.speed }))
    );
  };

  // Collision detection between arrows and enemies
  const checkCollision = (arrow, enemy) => {
    const distX = arrow.x - enemy.x;
    const distY = arrow.y - enemy.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < 20;
  };

  // Remove enemies hit by arrows
  useEffect(() => {
    setEnemies((prevEnemies) =>
      prevEnemies.filter((enemy) => {
        const hit = arrows.some((arrow) => checkCollision(arrow, enemy));
        if (hit) setScore(score + 1);
        return !hit;
      })
    );
  }, [arrows, enemies]);

  // Game over condition: enemy reaches bottom
  useEffect(() => {
    if (enemies.some((enemy) => enemy.y > window.innerHeight)) {
      alert("Game Over! Your Score: " + score);
      handleRestart(); // Call the restart function
    }
  }, [enemies]);

  // Start the game (initialize intervals)
  const handleStart = () => {
    setIsGameRunning(true);
    const gameInterval = setInterval(gameLoop, 50); // Update game state every 50ms
    const spawnInterval = setInterval(spawnEnemies, spawnRate);
    const difficultyInterval = setInterval(() => {
      setEnemySpeed((prevSpeed) => prevSpeed + 0.5); // Increase enemy speed
      setSpawnRate((prevRate) => Math.max(300, prevRate - 100)); // Decrease spawn rate
    }, 30000); // Increase difficulty every 30 seconds

    setGameInterval(gameInterval);
    setSpawnInterval(spawnInterval);
    setDifficultyInterval(difficultyInterval);
  };

  // Pause the game
  const handlePause = () => {
    setIsGameRunning(false);
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    clearInterval(difficultyInterval);
  };

  // Resume the game
  const handleResume = () => {
    setIsGameRunning(true);
    const gameInterval = setInterval(gameLoop, 50); // Update game state every 50ms
    const spawnInterval = setInterval(spawnEnemies, spawnRate);
    const difficultyInterval = setInterval(() => {
      setEnemySpeed((prevSpeed) => prevSpeed + 0.5); // Increase enemy speed
      setSpawnRate((prevRate) => Math.max(300, prevRate - 100)); // Decrease spawn rate
    }, 30000); // Increase difficulty every 30 seconds

    setGameInterval(gameInterval);
    setSpawnInterval(spawnInterval);
    setDifficultyInterval(difficultyInterval);
  };

  // Restart the game (reset state and stop intervals)
  const handleRestart = () => {
    setIsGameRunning(false);
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    clearInterval(difficultyInterval);

    // Reset game state
    setArrows([]);
    setEnemies([]);
    setScore(0);
    setEnemySpeed(2);
    setSpawnRate(1000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={handleRightClick}
      className="game-container"
    >
      {/* Buttons for controlling the game */}
      <div className="button-container">
        {!isGameRunning ? (
          <button onClick={handleStart} className="start-btn">Start</button>
        ) : (
          <button onClick={handlePause} className="pause-btn">Pause</button>
        )}
        {!isGameRunning && score > 0 && (
          <button onClick={handleResume} className="resume-btn">Resume</button>
        )}
        <button onClick={handleRestart} className="restart-btn">Restart</button>
      </div>


      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {/* Draw Player (Man) */}
          <Rect
            x={mouseX - 15}
            y={window.innerHeight - 60}
            width={30}
            height={30}
            fill="blue"
          />

          {/* Draw Arrows */}
          {arrows.map((arrow, i) => (
            <Line
              key={i}
              points={[arrow.x, arrow.y, arrow.x, arrow.y - 10]}
              stroke="black"
              strokeWidth={3}
            />
          ))}

          {/* Draw Enemies (Birds/Insects) */}
          {enemies.map((enemy) => (
            <Circle
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              radius={15}
              fill="red"
            />
          ))}

          {/* Score Display */}
          <Text
            text={`Score: ${score}`}
            x={20}
            y={20}
            fontSize={24}
            fill="black"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default Game;
