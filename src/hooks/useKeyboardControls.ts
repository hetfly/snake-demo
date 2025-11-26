import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../utils/gameUtils';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  KeyW: 'UP',
  KeyS: 'DOWN',
  KeyA: 'LEFT',
  KeyD: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

export function useKeyboardControls() {
  const { changeDirection, pauseGame, resumeGame, gameStatus, startGame } =
    useGameStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keyboard controls if user is typing in an input field
      const activeElement = document.activeElement;
      const isInputFocused = 
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.getAttribute('contenteditable') === 'true';
      
      if (isInputFocused) {
        return; // Don't process game controls when typing
      }

      // Handle spacebar for pause/resume/start
      if (event.code === 'Space') {
        event.preventDefault();
        if (gameStatus === 'idle') {
          startGame();
        } else if (gameStatus === 'playing') {
          pauseGame();
        } else if (gameStatus === 'paused') {
          resumeGame();
        }
        return;
      }

      // Handle direction keys
      const direction = KEY_MAP[event.code] || KEY_MAP[event.key];
      if (direction) {
        event.preventDefault();
        changeDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, pauseGame, resumeGame, gameStatus, startGame]);
}

