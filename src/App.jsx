import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const GRID_COUNT = CANVAS_SIZE / GRID_SIZE;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Generate random food position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_COUNT);
    const y = Math.floor(Math.random() * GRID_COUNT);
    return { x, y };
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection(DIRECTIONS.RIGHT);
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  }, [generateFood]);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (e) => {
      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setDirection((prev) =>
            prev !== DIRECTIONS.DOWN ? DIRECTIONS.UP : prev
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setDirection((prev) =>
            prev !== DIRECTIONS.UP ? DIRECTIONS.DOWN : prev
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          setDirection((prev) =>
            prev !== DIRECTIONS.RIGHT ? DIRECTIONS.LEFT : prev
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          setDirection((prev) =>
            prev !== DIRECTIONS.LEFT ? DIRECTIONS.RIGHT : prev
          );
          break;
      }
    },
    [gameStarted, gameOver]
  );

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Move head
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (
          head.x < 0 ||
          head.x >= GRID_COUNT ||
          head.y < 0 ||
          head.y >= GRID_COUNT
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameInterval);
  }, [direction, food, gameStarted, gameOver, generateFood]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Theme-based colors
    const canvasBackground = isDarkMode ? "#000" : "#f0f0f0";
    const snakeColor = isDarkMode ? "#0f0" : "#2d8f2d";
    const snakeHeadColor = isDarkMode ? "#0a0" : "#1f5f1f";
    const foodColor = isDarkMode ? "#f00" : "#d32f2f";

    // Clear canvas
    ctx.fillStyle = canvasBackground;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head - slightly different color
        ctx.fillStyle = snakeHeadColor;
      } else {
        ctx.fillStyle = snakeColor;
      }
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 1,
        GRID_SIZE - 1
      );
    });

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE - 1,
      GRID_SIZE - 1
    );
  }, [snake, food, isDarkMode]);

  // Add event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`game-container ${isDarkMode ? "dark-theme" : "light-theme"}`}
    >
      <div className="header">
        <h1>Snake Game</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="score">Score: {score}</div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="game-canvas"
        />

        {!gameStarted && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>Welcome to Snake!</h2>
              <p>Use arrow keys to control the snake</p>
              <button onClick={resetGame} className="start-button">
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <button onClick={resetGame} className="restart-button">
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="instructions">
        <p>Use ↑ ↓ ← → arrow keys to control the snake</p>
        <p>Eat the red food to grow and score points!</p>
      </div>
    </div>
  );
}

export default App;
