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
    <AnimatePresence mode="wait">
      {gameStatus === 'idle' && (
        <motion.div
          key="idle"
          className="start-screen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="start-screen-content"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              SNAKE GAME
            </motion.h2>
            <motion.button
              onClick={handleAction}
              className="start-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Start Game
            </motion.button>
            <motion.p
              className="instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Use Arrow Keys or WASD to move
              <br />
              Press Space to pause
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {gameStatus === 'paused' && (
        <motion.div
          key="paused"
          className="pause-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="pause-content"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              PAUSED
            </motion.h2>
            <motion.button
              onClick={handleAction}
              className="resume-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Resume
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

