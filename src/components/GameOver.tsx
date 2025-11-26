import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { submitScore } from '../services/leaderboardService';

export function GameOver() {
  const { score, resetGame } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitScore(playerName.trim(), score);
      setIsSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    setShowForm(true);
    setIsSubmitted(false);
    setPlayerName('');
    resetGame();
  };

  return (
    <motion.div
      className="game-over-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="game-over-content"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Game Over
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Final Score: {score}
        </motion.p>

        {showForm && !isSubmitted && (
          <motion.form
            onSubmit={handleSubmit}
            className="score-submit-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="name-input"
              disabled={isSubmitting}
            />
            <motion.button
              type="submit"
              className="submit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!playerName.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </motion.button>
          </motion.form>
        )}

        {isSubmitted && (
          <motion.p
            className="submission-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Score submitted!
          </motion.p>
        )}

        <motion.button
          onClick={handlePlayAgain}
          className="restart-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: isSubmitted ? 0.5 : 0.4 }}
        >
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

