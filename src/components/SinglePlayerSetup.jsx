import React, { useState } from 'react'
import { motion } from 'framer-motion'

const SinglePlayerSetup = ({ onStartGame, onBack }) => {
  const [playerXName, setPlayerXName] = useState('')
  const [playerOName, setPlayerOName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onStartGame({
      playerXName: playerXName.trim() || 'Player X',
      playerOName: playerOName.trim() || 'Player O'
    })
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
            Single Device Mode
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Player X Name Input */}
            <div>
              <label htmlFor="playerXName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Player X Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="playerXName"
                value={playerXName}
                onChange={(e) => setPlayerXName(e.target.value)}
                placeholder="Enter name for Player X"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={20}
              />
            </div>

            {/* Player O Name Input */}
            <div>
              <label htmlFor="playerOName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Player O Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="playerOName"
                value={playerOName}
                onChange={(e) => setPlayerOName(e.target.value)}
                placeholder="Enter name for Player O"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={20}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Back
              </button>
              
              <motion.button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Game
              </motion.button>
            </div>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How to Play:
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Enter names for both players (or leave blank)</li>
              <li>• Take turns tapping on the board</li>
              <li>• First player to get three in a row wins!</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SinglePlayerSetup