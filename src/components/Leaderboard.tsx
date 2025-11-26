import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeaderboard, type LeaderboardEntry } from '../services/leaderboardService';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard(10);
      setEntries(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="leaderboard-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="leaderboard-content"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="leaderboard-header">
          <h2>Leaderboard</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="leaderboard-loading">Loading...</div>
        ) : error ? (
          <div className="leaderboard-error">{error}</div>
        ) : entries.length === 0 ? (
          <div className="leaderboard-empty">No scores yet. Be the first!</div>
        ) : (
          <>
            <div className="leaderboard-header-row">
              <div className="leaderboard-header-rank">Rank</div>
              <div className="leaderboard-header-name">Player</div>
              <div className="leaderboard-header-score">Score</div>
            </div>
            <div className="leaderboard-list">
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id || index}
                    className="leaderboard-entry"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="leaderboard-rank">#{index + 1}</div>
                    <div className="leaderboard-name">{entry.player_name}</div>
                    <div className="leaderboard-score">{entry.score}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        <button className="refresh-button" onClick={loadLeaderboard} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </motion.div>
    </motion.div>
  );
}

