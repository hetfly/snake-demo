import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameCanvas } from './components/GameCanvas';
import { Score } from './components/Score';
import { GameOver } from './components/GameOver';
import { GameControls } from './components/GameControls';
import { ThemeSelector } from './components/ThemeSelector';
import { Leaderboard } from './components/Leaderboard';
import { HighScore } from './components/HighScore';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useGameStore } from './store/gameStore';
import { useThemeStore } from './store/themeStore';
import './styles/global.css';

function App() {
  const { gameStatus } = useGameStore();
  const { theme } = useThemeStore();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  useKeyboardControls();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <ThemeSelector />
      <motion.button
        className="leaderboard-button"
        onClick={() => setIsLeaderboardOpen(true)}
        aria-label="View Leaderboard"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🏆
      </motion.button>
      <Score />
      <div style={{ position: 'relative' }}>
        <GameCanvas />
        <GameControls />
        {gameStatus === 'gameOver' && <GameOver />}
      </div>
      <HighScore />
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}

export default App;
