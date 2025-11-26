import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function Score() {
  const { score } = useGameStore();

  return (
    <div className="score-container">
      <div className="score-item">
        <span className="score-label">Score</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            className="score-value"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

