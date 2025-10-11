import { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';

/**
 * App Component
 * Main application component that manages game state and view routing
 */
function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or 'game'
  const [gameMode, setGameMode] = useState(null); // 'EASY', 'MEDIUM', 'HARD', or 'INFINITY'
  const [useInputMode, setUseInputMode] = useState(false);

  // Handle starting the game with selected mode
  const handleStartGame = (mode, inputMode) => {
    setGameMode(mode);
    setUseInputMode(inputMode);
    setCurrentView('game');
  };

  // Handle returning to main menu
  const handleBackToMenu = () => {
    setCurrentView('menu');
    setGameMode(null);
  };

  return (
    <div className="App min-h-screen">
      {currentView === 'menu' ? (
        <MainMenu onStartGame={handleStartGame} />
      ) : (
        <GameScreen mode={gameMode} onBackToMenu={handleBackToMenu} useInputMode={useInputMode} />
      )}
    </div>
  );
}

export default App;
