import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Position,
  Direction,
} from '../utils/gameUtils';
import {
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  getNextPosition,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  generateFood,
  isValidDirection,
} from '../utils/gameUtils';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  speed: number;
  moveSnake: () => void;
  changeDirection: (dir: Direction) => void;
  generateFood: () => void;
  checkCollision: () => boolean;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  startGame: () => void;
  increaseScore: () => void;
}

const INITIAL_SPEED = 150; // milliseconds between moves
const SPEED_INCREMENT = 5; // decrease by 5ms per food eaten
const MIN_SPEED = 80; // minimum speed (fastest)

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      nextDirection: INITIAL_DIRECTION,
      score: 0,
      highScore: 0,
      gameStatus: 'idle',
      speed: INITIAL_SPEED,

      moveSnake: () => {
        const { snake, nextDirection, food, checkCollision } = get();
        
        // Update direction from nextDirection
        const currentDirection = nextDirection;
        set({ direction: currentDirection });

        // Calculate new head position
        const head = snake[0];
        const newHead = getNextPosition(head, currentDirection);

        // Check for food collision
        const ateFood = checkFoodCollision([newHead], food);
        
        let newSnake: Position[];
        if (ateFood) {
          // Grow snake by adding new head and keeping tail
          newSnake = [newHead, ...snake];
          get().increaseScore();
          get().generateFood();
        } else {
          // Move snake by adding new head and removing tail
          newSnake = [newHead, ...snake.slice(0, -1)];
        }

        set({ snake: newSnake });

        // Check for collisions
        if (checkCollision()) {
          set({ gameStatus: 'gameOver' });
        }
      },

      changeDirection: (dir: Direction) => {
        const { direction, gameStatus } = get();
        if (gameStatus !== 'playing') return;
        
        if (isValidDirection(direction, dir)) {
          set({ nextDirection: dir });
        }
      },

      generateFood: () => {
        const { snake } = get();
        const newFood = generateFood(snake);
        set({ food: newFood });
      },

      checkCollision: () => {
        const { snake } = get();
        const head = snake[0];
        return checkWallCollision(head) || checkSelfCollision(snake);
      },

      resetGame: () => {
        const initialFood = generateFood(INITIAL_SNAKE);
        set({
          snake: INITIAL_SNAKE,
          food: initialFood,
          direction: INITIAL_DIRECTION,
          nextDirection: INITIAL_DIRECTION,
          score: 0,
          gameStatus: 'idle',
          speed: INITIAL_SPEED,
        });
      },

      pauseGame: () => {
        const { gameStatus } = get();
        if (gameStatus === 'playing') {
          set({ gameStatus: 'paused' });
        }
      },

      resumeGame: () => {
        const { gameStatus } = get();
        if (gameStatus === 'paused') {
          set({ gameStatus: 'playing' });
        }
      },

      startGame: () => {
        set({ gameStatus: 'playing' });
      },

      increaseScore: () => {
        const { score, highScore, speed } = get();
        const newScore = score + 1;
        const newHighScore = Math.max(highScore, newScore);
        
        // Increase speed (decrease delay) as score increases
        const newSpeed = Math.max(MIN_SPEED, speed - SPEED_INCREMENT);
        
        set({
          score: newScore,
          highScore: newHighScore,
          speed: newSpeed,
        });
      },
    }),
    {
      name: 'snake-game-state',
      partialize: (state) => ({
        highScore: state.highScore,
      }),
    }
  )
);

