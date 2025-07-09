import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Board from './Board'
import ThemeToggle from './ThemeToggle'

const SingleGameBoard = ({ 
  gameState, 
  onMakeMove, 
  onResetGame,
  onBack,
  darkMode,
  onToggleTheme 
}) => {
  const [showToast, setShowToast] = useState(null)

  // Show toast notifications for turns
  useEffect(() => {
    if (gameState.status === 'playing' && !gameState.winner) {
      const currentPlayerName = gameState.currentTurn === 'X' ? gameState.playerXName : gameState.playerOName
      setShowToast({ 
        type: 'turn', 
        message: `It's ${currentPlayerName}'s turn!` 
      })
      
      const timer = setTimeout(() => setShowToast(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [gameState.currentTurn, gameState.status, gameState.playerXName, gameState.playerOName, gameState.winner])

  // Show winner toast
  useEffect(() => {
    if (gameState.winner) {
      const winnerName = gameState.winner === 'X' ? gameState.playerXName : gameState.playerOName
      setShowToast({
        type: 'win',
        message: `${winnerName} won! 🎉`
      })
    }
  }, [gameState.winner, gameState.playerXName, gameState.playerOName])

  const handleSquareClick = (index) => {
    if (gameState.board[index] || gameState.winner) {
      return;
    }
    
    onMakeMove(index);
  }

  const getStatusMessage = () => {
    if (gameState.winner) {
      const winnerName = gameState.winner === 'X' ? gameState.playerXName : gameState.playerOName
      return `🎉 ${winnerName} Won!`
    }
    
    if (gameState.board.every(cell => cell !== null)) {
      return "🤝 It's a Draw!"
    }

    const currentPlayerName = gameState.currentTurn === 'X' ? gameState.playerXName : gameState.playerOName
    return `${currentPlayerName}'s Turn`
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="game-container">
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
      
      <motion.div
        className="w-full max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="game-title text-center mb-6">Tic Tac Toe</h1>
        </motion.div>

        {/* Player Info */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Player X</p>
            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
              {gameState.playerXName}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">VS</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Player O</p>
            <p className="font-bold text-lg text-red-600 dark:text-red-400">
              {gameState.playerOName}
            </p>
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          variants={itemVariants}
          className="status-bar mb-6"
        >
          <div className="status-text">
            {getStatusMessage()}
          </div>
          {!gameState.winner && (
            <div className={`turn-indicator ${gameState.currentTurn === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {gameState.currentTurn === 'X' ? '🔵 X to move' : '🔴 O to move'}
            </div>
          )}
        </motion.div>

        {/* Game Board */}
        <motion.div variants={itemVariants}>
          <Board
            board={gameState.board}
            onSquareClick={handleSquareClick}
            winningLine={gameState.winningLine || []}
            winner={gameState.winner}
            isDisabled={false}
          />
        </motion.div>

        {/* Game Actions */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 mt-6"
        >
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Back to Menu
          </button>
          
          <button
            onClick={onResetGame}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
          >
            New Game
          </button>
        </motion.div>
      </motion.div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
              showToast.type === 'turn' 
                ? 'bg-green-500 text-white' 
                : showToast.type === 'win'
                ? 'bg-green-600 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <p className="font-medium text-center">{showToast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti animation for winner */}
      <AnimatePresence>
        {gameState.winner && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SingleGameBoard