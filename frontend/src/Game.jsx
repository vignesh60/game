import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Line, Text, Circle } from "react-konva";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Game = () => {
  const [mouseX, setMouseX] = useState(window.innerWidth / 2);
  const [arrows, setArrows] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [enemySpeed, setEnemySpeed] = useState(2);
  const [spawnRate, setSpawnRate] = useState(1000);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  
  const enemyInterval = useRef(null); 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } /* else {
      promptUserDetails();
    } */
  }, []);

  /* const promptUserDetails = () => {
    const name = prompt("Enter your name:");
    const email = prompt("Enter your email:");
    if (name && email) {
      const userDetails = { name, email };
      localStorage.setItem("user", JSON.stringify(userDetails));
      setUser(userDetails);
    }
  }; */

  const handleMouseMove = (event) => {
    setMouseX(event.clientX);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    if (isGameRunning && !isPaused) {
      const newArrow = { x: mouseX, y: window.innerHeight - 70 };
      setArrows([...arrows, newArrow]);
      socket.emit("shoot_arrow", newArrow);
    }
  };

  const spawnEnemies = () => {
    const newEnemies = Array.from({ length: 2 }).map(() => ({
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: 0,
      speed: enemySpeed,
    }));
    setEnemies((prevEnemies) => [...prevEnemies, ...newEnemies]);
    socket.emit("spawn_enemies", newEnemies);
  };

  const startEnemySpawnInterval = () => {
    // Start spawning enemies at set intervals
    enemyInterval.current = setInterval(spawnEnemies, spawnRate);
  };

  const clearEnemySpawnInterval = () => {
    // Clear the enemy spawn interval when game is over or restarted
    if (enemyInterval.current) {
      clearInterval(enemyInterval.current);
      enemyInterval.current = null;
    }
  };

  useEffect(() => {
    if (isGameRunning && !isPaused) {
      const interval = setInterval(() => {
        setArrows((prevArrows) =>
          prevArrows.map((arrow) => ({ ...arrow, y: arrow.y - 5 }))
        );
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({ ...enemy, y: enemy.y + enemy.speed }))
        );
        socket.emit("update_state", { arrows, enemies });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isGameRunning, arrows, enemies, isPaused]);

  const checkCollision = (arrow, enemy) => {
    const distX = arrow.x - enemy.x;
    const distY = arrow.y - enemy.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    return distance < 20;
  };

  useEffect(() => {
    setEnemies((prevEnemies) => {
      return prevEnemies.filter((enemy) => {
        const hit = arrows.some((arrow) => checkCollision(arrow, enemy));
        if (hit) {
          setScore((prevScore) => prevScore + 1);
          socket.emit("update_score", { score: score + 1, user });
        }
        return !hit;
      });
    });
  }, [arrows]);

  useEffect(() => {
    if (enemies.some((enemy) => enemy.y > window.innerHeight)) {
      alert("Game Over! Your Score: " + score);
      handleGameOver();
    }
  }, [enemies]);

  const handleStart = () => {
    setIsGameRunning(true);
    setArrows([]); // Clear any leftover arrows from the previous game
    setEnemies([]); // Clear any leftover enemies from the previous game
    setScore(0); // Reset score
    socket.emit("start_game");
    startEnemySpawnInterval(); // Start spawning new enemies
  };

  const handlePause = () => {
    setIsPaused(true); // Pause the game
  };

  const handleResume = () => {
    setIsPaused(false); // Resume the game
  };

  const handleGameOver = () => {
    setIsGameRunning(false);
    setArrows([]); // Clear arrows
    setEnemies([]); // Clear enemies
    setScore(0); // Reset score
    clearEnemySpawnInterval(); // Clear the enemy spawn interval
    socket.emit("game_over", { ...user, score }); // Send score to server
  };

  return (
    <div onMouseMove={handleMouseMove} onClick={handleRightClick} className="game-container">
      <div className="button-container">
        {!isGameRunning ? (
          <button onClick={handleStart} className="start-btn">Start</button>
        ) : (
          <>
            <button onClick={handlePause} className="pause-btn">Pause</button>
            <button onClick={handleResume} className="resume-btn">Resume</button>
            <button onClick={handleGameOver} className="restart-btn">Restart</button>
          </>
        )}
      </div>

      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect x={mouseX - 15} y={window.innerHeight - 60} width={30} height={30} fill="blue" />

          {arrows.map((arrow, i) => (
            <Line key={i} points={[arrow.x, arrow.y, arrow.x, arrow.y - 10]} stroke="black" strokeWidth={3} />
          ))}

          {enemies.map((enemy) => (
            <Circle key={enemy.id} x={enemy.x} y={enemy.y} radius={15} fill="red" />
          ))}

          <Text text={`Score: ${score}`} x={20} y={20} fontSize={24} fill="black" />
        </Layer>
      </Stage>
    </div>
  );
};

export default Game;
