import { useGameStore } from '../store/gameStore';

export function HighScore() {
  const { highScore } = useGameStore();

  return (
    <div className="highscore-container">
      <span className="highscore-label">High Score</span>
      <span className="highscore-value">{highScore}</span>
    </div>
  );
}

