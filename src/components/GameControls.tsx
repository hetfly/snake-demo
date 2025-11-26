import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function GameControls() {
  const { gameStatus, startGame, resumeGame, pauseGame } = useGameStore();

  const handleAction = () => {
    if (gameStatus === 'idle') {
      startGame();
    } else if (gameStatus === 'paused') {
      resumeGame();
    } else if (gameStatus === 'playing') {
      pauseGame();
    }
  };

  return (
    <div className="game-controls">
      <AnimatePresence mode="wait">
        {gameStatus === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="start-screen"
          >
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse', duration: 1.5 }}
            >
              SNAKE GAME
            </motion.h2>
            <motion.button
              onClick={handleAction}
              className="start-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
            </motion.button>
            <p className="instructions">
              Use Arrow Keys or WASD to move
              <br />
              Press Space to pause
            </p>
          </motion.div>
        )}

        {gameStatus === 'paused' && (
          <motion.div
            key="paused"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pause-overlay"
          >
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse', duration: 1 }}
            >
              PAUSED
            </motion.h2>
            <motion.button
              onClick={handleAction}
              className="resume-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

