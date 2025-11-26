import { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Score } from './components/Score';
import { GameOver } from './components/GameOver';
import { GameControls } from './components/GameControls';
import { ThemeSelector } from './components/ThemeSelector';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useGameStore } from './store/gameStore';
import { useThemeStore } from './store/themeStore';
import './styles/global.css';

function App() {
  const { gameStatus } = useGameStore();
  const { theme } = useThemeStore();
  useKeyboardControls();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <ThemeSelector />
      <Score />
      <div style={{ position: 'relative' }}>
        <GameCanvas />
        <GameControls />
        {gameStatus === 'gameOver' && <GameOver />}
      </div>
    </div>
  );
}

export default App;
