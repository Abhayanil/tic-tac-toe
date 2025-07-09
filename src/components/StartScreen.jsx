import React, { useState } from 'react'
import { motion } from 'framer-motion'

const StartScreen = ({ onCreateGame, onJoinGame, isLoading, error, initialMode = 'create', initialGameId = '', onBack }) => {
  const [playerName, setPlayerName] = useState('')
  const [gameIdToJoin, setGameIdToJoin] = useState(initialGameId)
  const [mode, setMode] = useState(initialGameId && initialGameId !== 'null' && initialGameId !== '' ? 'join' : initialMode) // 'create' or 'join'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!playerName.trim()) return

    if (mode === 'create') {
      onCreateGame(playerName.trim())
    } else {
      if (!gameIdToJoin.trim()) return
      onJoinGame(gameIdToJoin.trim().toUpperCase(), playerName.trim())
    }
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="game-title text-center mb-8">
            Multiplayer Tic Tac Toe
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'create'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Create Game
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'join'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Join Game
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player Name Input */}
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
                maxLength={20}
              />
            </div>

            {/* Game ID Input (for join mode) */}
            {mode === 'join' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Game ID
                </label>
                <input
                  type="text"
                  id="gameId"
                  value={gameIdToJoin}
                  onChange={(e) => setGameIdToJoin(e.target.value.toUpperCase())}
                  placeholder="Enter game ID (e.g., ABC123)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
                  required
                  maxLength={6}
                />
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              
              <motion.button
                type="submit"
                disabled={isLoading || !playerName.trim() || (mode === 'join' && !gameIdToJoin.trim())}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {mode === 'create' ? 'Creating Game...' : 'Joining Game...'}
                  </div>
                ) : (
                  mode === 'create' ? 'Create Game' : 'Join Game'
                )}
              </motion.button>
            </div>
          </form>

          {/* Instructions */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'create' ? 'How to Create:' : 'How to Join:'}
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {mode === 'create' ? (
                <>
                  <li>• Enter your name and click "Create Game"</li>
                  <li>• Share the game ID with your friend</li>
                  <li>• Wait for them to join and start playing!</li>
                </>
              ) : (
                <>
                  <li>• Get the game ID from your friend</li>
                  <li>• Enter your name and the game ID</li>
                  <li>• Click "Join Game" to start playing!</li>
                </>
              )}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default StartScreen