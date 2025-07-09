import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const GameModeSelection = ({ onSelectMode, darkMode, onToggleTheme }) => {
  // Check if there's a previously selected mode in localStorage
  useEffect(() => {
    const lastMode = localStorage.getItem('ttt-game-mode')
    if (lastMode) {
      onSelectMode(lastMode)
    }
  }, [onSelectMode])

  const handleSelectMode = (mode) => {
    // Save the selected mode to localStorage
    localStorage.setItem('ttt-game-mode', mode)
    onSelectMode(mode)
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

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
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
          <h1 className="game-title text-center mb-4">
            Welcome to Tic Tac Toe
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-xl text-center mb-8 text-gray-700 dark:text-gray-300">
            Choose how you want to play
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6"
        >
          <motion.button
            onClick={() => handleSelectMode('single')}
            className="w-full py-6 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex flex-col items-center justify-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="text-3xl mb-2">🎮</span>
            <span className="text-xl">Single Device</span>
            <span className="text-sm mt-2 text-blue-100">Play with a friend on this device</span>
          </motion.button>

          <motion.button
            onClick={() => handleSelectMode('multi')}
            className="w-full py-6 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex flex-col items-center justify-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="text-3xl mb-2">🌐</span>
            <span className="text-xl">Two Devices</span>
            <span className="text-sm mt-2 text-purple-100">Play online with a friend</span>
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            How to Play:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• <strong>Single Device:</strong> Take turns on the same device</li>
            <li>• <strong>Two Devices:</strong> Create a game and share the link</li>
            <li>• Get three in a row to win!</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GameModeSelection