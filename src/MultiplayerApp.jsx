import React, { useState, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { useSingleGameState } from './hooks/useSingleGameState'
import StartScreen from './components/StartScreen'
import WaitingRoom from './components/WaitingRoom'
import GameBoard from './components/GameBoard'
import SingleGameBoard from './components/SingleGameBoard'
import GameModeSelection from './components/GameModeSelection'
import SinglePlayerSetup from './components/SinglePlayerSetup'

const MultiplayerApp = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [gameMode, setGameMode] = useState(null) // null, 'single', 'multi'
  const [gameFlow, setGameFlow] = useState('start') // 'start', 'waiting', 'playing'
  const [playerName, setPlayerName] = useState('')

  // Get game ID from URL if present
  const urlParams = new URLSearchParams(window.location.search)
  const gameIdFromUrl = urlParams.get('game')
  const validGameId = gameIdFromUrl && gameIdFromUrl !== 'null' && gameIdFromUrl !== ''

  // Initialize multiplayer game state
  const {
    gameState,
    currentPlayer,
    createGame,
    joinGame,
    makeMove,
    loadGame
  } = useGameState(validGameId ? gameIdFromUrl : null)

  // Initialize single player game state
  const {
    gameState: singleGameState,
    makeMove: singleMakeMove,
    resetGame: singleResetGame,
    setPlayers: setSinglePlayers
  } = useSingleGameState()

  const getStoredPlayer = (gameId) => {
    if (!gameId) return null;
    return localStorage.getItem(`ttt-player-${gameId}`);
  };
  const setStoredPlayer = (gameId, player) => {
    if (!gameId || !player) return;
    localStorage.setItem(`ttt-player-${gameId}`, player);
  };

  const [currentPlayerState, setCurrentPlayerState] = useState(() => getStoredPlayer(gameIdFromUrl));

  // Check for URL game ID on initial load
  useEffect(() => {
    if (validGameId) {
      setGameMode('multi')
    }
  }, [validGameId])

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

  // Handle multiplayer game state changes
  useEffect(() => {
    if (gameMode === 'multi') {
      if (gameState.status === 'waiting' && gameState.gameId) {
        setGameFlow('waiting')
      } else if (gameState.status === 'playing') {
        setGameFlow('playing')
      }
    }
  }, [gameState.status, gameState.gameId, gameMode])

  // Handle URL game ID
  useEffect(() => {
    if (validGameId && gameFlow === 'start' && gameMode === 'multi') {
      setGameFlow('join')
    }
  }, [validGameId, gameFlow, gameMode])

  // Add effect to transition to game board when game status changes
  useEffect(() => {
    if (
      gameMode === 'multi' &&
      (currentPlayerState === 'X' || currentPlayerState === 'O') &&
      (gameState.status === 'playing' || gameState.status === 'finished')
    ) {
      setGameFlow('playing');
    }
  }, [gameState.status, currentPlayerState, gameMode]);

  // Mobile-specific: Add a manual refresh mechanism for waiting room
  useEffect(() => {
    if (gameMode === 'multi' && gameFlow === 'waiting' && currentPlayerState === 'X' && gameState.status === 'waiting') {
      // On mobile, set up a periodic check to refresh game state
      const interval = setInterval(() => {
        if (gameIdFromUrl) {
          loadGame(gameIdFromUrl);
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [gameFlow, currentPlayerState, gameState.status, gameIdFromUrl, loadGame, gameMode]);

  // Enhanced effect to handle game state transitions more reliably
  useEffect(() => {
    if (gameMode === 'multi') {
      console.log('Game state changed:', {
        status: gameState.status,
        currentPlayerState,
        gameFlow,
        playerXName: gameState.playerXName,
        playerOName: gameState.playerOName
      });

      // If we're player X and game status changed to playing, transition to game board
      if (currentPlayerState === 'X' && gameState.status === 'playing' && gameFlow === 'waiting') {
        console.log('Player X transitioning to game board');
        setGameFlow('playing');
      }

      // If we're player O and successfully joined, we should already be in playing state
      if (currentPlayerState === 'O' && gameState.status === 'playing' && gameFlow !== 'playing') {
        console.log('Player O transitioning to game board');
        setGameFlow('playing');
      }
    }
  }, [gameState.status, currentPlayerState, gameFlow, gameState.playerXName, gameState.playerOName, gameMode]);

  // Handle game mode selection
  const handleSelectMode = (mode) => {
    setGameMode(mode)
    if (mode === 'single') {
      setGameFlow('setup')
    } else if (mode === 'multi') {
      setGameFlow('start')
    }
  }

  // Handle single player setup
  const handleStartSingleGame = (players) => {
    setSinglePlayers(players)
    setGameFlow('playing')
  }

  // Handle multiplayer game creation
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

  // Handle multiplayer game joining
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

  // Handle moves for multiplayer game
  const handleMakeMove = async (index) => {
    await makeMove(index)
  }

  // Handle back button
  const handleBack = () => {
    if (gameMode === 'single') {
      setGameMode(null)
    } else if (gameMode === 'multi') {
      setGameFlow('start')
      setPlayerName('')
      // Clear URL
      window.history.pushState({}, '', window.location.pathname)
    }
  }

  // Handle refresh for multiplayer waiting room
  const handleRefresh = () => {
    if (gameIdFromUrl) {
      loadGame(gameIdFromUrl)
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  // Show game mode selection if no mode is selected
  if (gameMode === null) {
    return (
      <GameModeSelection 
        onSelectMode={handleSelectMode} 
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
    )
  }

  // Single player mode
  if (gameMode === 'single') {
    // Show player setup screen
    if (gameFlow === 'setup') {
      return (
        <SinglePlayerSetup 
          onStartGame={handleStartSingleGame} 
          onBack={() => setGameMode(null)}
        />
      )
    }

    // Show single player game board
    if (gameFlow === 'playing') {
      return (
        <SingleGameBoard
          gameState={singleGameState}
          onMakeMove={singleMakeMove}
          onResetGame={singleResetGame}
          onBack={() => setGameMode(null)}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
        />
      )
    }
  }

  // Multiplayer mode
  if (gameMode === 'multi') {
    // Show StartScreen if no valid gameId and gameFlow is 'start'
    if (!validGameId && gameFlow === 'start') {
      return (
        <StartScreen
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          isLoading={gameState.isLoading}
          error={gameState.error}
          onBack={() => setGameMode(null)}
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
          onBack={() => {
            setGameMode(null)
            window.history.pushState({}, '', window.location.pathname)
          }}
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
          onRefresh={handleRefresh}
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
  }

  // Fallback UI
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <p>Loading or invalid state. Please refresh or check the link.</p>
        <button
          onClick={() => setGameMode(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
}

export default MultiplayerApp