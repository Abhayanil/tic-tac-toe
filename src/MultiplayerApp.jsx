import React, { useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import StartScreen from './components/StartScreen'
import WaitingRoom from './components/WaitingRoom'
import GameBoard from './components/GameBoard'

const MultiplayerApp = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [gameFlow, setGameFlow] = useState('start') // 'start', 'waiting', 'playing'
  const [playerName, setPlayerName] = useState('')

  // Get game ID from URL if present
  const urlParams = new URLSearchParams(window.location.search)
  const gameIdFromUrl = urlParams.get('game')
  const validGameId = gameIdFromUrl && gameIdFromUrl !== 'null' && gameIdFromUrl !== ''

  const {
    gameState,
    currentPlayer,
    createGame,
    joinGame,
    makeMove,
    loadGame
  } = useGameState(validGameId ? gameIdFromUrl : null)

  const getStoredPlayer = (gameId) => {
    if (!gameId) return null;
    return localStorage.getItem(`ttt-player-${gameId}`);
  };
  const setStoredPlayer = (gameId, player) => {
    if (!gameId || !player) return;
    localStorage.setItem(`ttt-player-${gameId}`, player);
  };

  const [currentPlayerState, setCurrentPlayerState] = useState(() => getStoredPlayer(gameIdFromUrl));

  useEffect(() => {
    if (gameIdFromUrl && currentPlayerState !== getStoredPlayer(gameIdFromUrl)) {
      setCurrentPlayerState(getStoredPlayer(gameIdFromUrl));
    }
  }, [gameIdFromUrl]);

  // Handle theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle game state changes
  useEffect(() => {
    if (gameState.status === 'waiting' && gameState.gameId) {
      setGameFlow('waiting')
    } else if (gameState.status === 'playing') {
      setGameFlow('playing')
    }
  }, [gameState.status, gameState.gameId])

  // Handle URL game ID
  useEffect(() => {
    if (validGameId && gameFlow === 'start') {
      setGameFlow('join')
    }
  }, [validGameId, gameFlow])

  // Add effect to transition to game board when game status changes
  useEffect(() => {
    if (
      (currentPlayerState === 'X' || currentPlayerState === 'O') &&
      (gameState.status === 'playing' || gameState.status === 'finished')
    ) {
      setGameFlow('playing');
    }
  }, [gameState.status, currentPlayerState]);

  const handleCreateGame = async (name) => {
    setPlayerName(name)
    const gameId = await createGame(name)
    if (gameId && gameId !== 'null' && gameId !== '') {
      setStoredPlayer(gameId, 'X');
      setCurrentPlayerState('X');
      const newUrl = `${window.location.pathname}?game=${gameId}`
      window.history.pushState({}, '', newUrl)
      setGameFlow('waiting')
    } else {
      setGameFlow('start')
      setPlayerName('')
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  const handleJoinGame = async (gameId, name) => {
    setPlayerName(name)
    const success = await joinGame(gameId, name)
    if (success) {
      setStoredPlayer(gameId, 'O');
      setCurrentPlayerState('O');
      const newUrl = `${window.location.pathname}?game=${gameId}`
      window.history.pushState({}, '', newUrl)
      setGameFlow('playing')
    }
  }

  const handleMakeMove = async (index) => {
    await makeMove(index)
  }

  const handleBack = () => {
    setGameFlow('start')
    setPlayerName('')
    // Clear URL
    window.history.pushState({}, '', window.location.pathname)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  console.log('URL:', window.location.href, 'gameFlow:', gameFlow, 'gameIdFromUrl:', gameIdFromUrl, 'validGameId:', validGameId, 'playerName:', playerName, 'gameState:', gameState);

  // Always show StartScreen if no valid gameId and gameFlow is 'start'
  if (!validGameId && gameFlow === 'start') {
    return (
      <StartScreen
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        isLoading={gameState.isLoading}
        error={gameState.error}
      />
    )
  }

  // Show join screen if game ID in URL and valid, and not a player in this game
  if (validGameId && (!currentPlayerState || (currentPlayerState !== 'X' && currentPlayerState !== 'O'))) {
    return (
      <StartScreen
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        isLoading={gameState.isLoading}
        error={gameState.error}
        initialMode="join"
        initialGameId={gameIdFromUrl}
      />
    )
  }

  // Show waiting room only for Player X if game is waiting
  if (gameFlow === 'waiting' && currentPlayerState === 'X' && gameState.status === 'waiting') {
    return (
      <WaitingRoom
        gameId={gameState.gameId}
        playerName={playerName}
        onBack={handleBack}
      />
    )
  }

  // Show game board only for X or O if game is playing or finished
  if ((currentPlayerState === 'X' || currentPlayerState === 'O') && (gameState.status === 'playing' || gameState.status === 'finished')) {
    return (
      <GameBoard
        gameState={gameState}
        currentPlayer={currentPlayerState}
        onMakeMove={handleMakeMove}
        onBack={handleBack}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
    )
  }

  // Show error if gameState.error is set
  if (gameState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <p className="text-red-600 font-bold mb-4">Error: {gameState.error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Start
          </button>
        </div>
      </div>
    );
  }

  // Fallback UI
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <p>Loading or invalid state. Please refresh or check the link.</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
}

export default MultiplayerApp