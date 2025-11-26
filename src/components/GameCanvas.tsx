import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useThemeStore } from '../store/themeStore';
import { CELL_SIZE, GRID_SIZE } from '../utils/gameUtils';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMoveTimeRef = useRef<number>(0);
  const foodPulseRef = useRef<number>(0);
  const previousSnakeLengthRef = useRef<number>(0);

  const { snake, food, gameStatus, speed, moveSnake } = useGameStore();
  const { theme } = useThemeStore();

  // Theme colors
  const colors = {
    light: {
      background: '#e8e8e8',
      grid: '#d0d0d0',
      snake: '#2a2a2a',
      snakeHead: '#1a1a1a',
      food: '#4a4a4a',
    },
    dark: {
      background: '#1a1a1a',
      grid: '#2a2a2a',
      snake: '#d0d0d0',
      snakeHead: '#e8e8e8',
      food: '#6a6a6a',
    },
  };

  const currentColors = colors[theme];

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Clear canvas
      ctx.fillStyle = currentColors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = currentColors.grid;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }

      // Animate food pulsing
      foodPulseRef.current += 0.1;
      const foodScale = 0.8 + Math.sin(foodPulseRef.current) * 0.2;

      // Draw food with pulse animation
      ctx.fillStyle = currentColors.food;
      const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
      const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.beginPath();
      ctx.arc(
        foodX,
        foodY,
        (CELL_SIZE / 2) * foodScale,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake with smooth animation
      snake.forEach((segment, index) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;

        if (index === 0) {
          // Draw head with different color
          ctx.fillStyle = currentColors.snakeHead;
        } else {
          ctx.fillStyle = currentColors.snake;
        }

        // Add rounded corners for smoother look
        const padding = 1;
        ctx.fillRect(
          x + padding,
          y + padding,
          CELL_SIZE - padding * 2,
          CELL_SIZE - padding * 2
        );
      });

      // Growth animation effect
      if (snake.length > previousSnakeLengthRef.current) {
        const newSegment = snake[snake.length - 1];
        const x = newSegment.x * CELL_SIZE;
        const y = newSegment.y * CELL_SIZE;
        
        // Flash effect for new segment
        ctx.fillStyle = currentColors.food;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }
      previousSnakeLengthRef.current = snake.length;
    },
    [snake, food, currentColors]
  );

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    const gameLoop = (currentTime: number) => {
      if (gameStatus === 'playing') {
        // Move snake at specified intervals
        if (currentTime - lastMoveTimeRef.current >= speed) {
          moveSnake();
          lastMoveTimeRef.current = currentTime;
        }
      }

      // Always render (for smooth animations)
      draw(ctx);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStatus, speed, moveSnake, draw]);

  // Reset move timer when game starts
  useEffect(() => {
    if (gameStatus === 'playing') {
      lastMoveTimeRef.current = performance.now();
    }
  }, [gameStatus]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  );
}

