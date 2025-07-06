import React, { useState } from 'react'
import { motion } from 'framer-motion'

const WaitingRoom = ({ gameId, playerName, onBack, onRefresh }) => {
  const [copied, setCopied] = useState(false)

  const gameUrl = `${window.location.origin}${window.location.pathname}?game=${gameId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = gameUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Tic Tac Toe game!',
        text: `${playerName} invited you to play Tic Tac Toe`,
        url: gameUrl
      })
    } else {
      copyToClipboard()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
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
          <h1 className="game-title text-center mb-8">
            Waiting for Player
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Player Info */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white text-2xl font-bold">X</span>
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {playerName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You're Player X (goes first)
            </p>
          </motion.div>

          {/* Game ID */}
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Game ID:
            </h3>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-2 rounded border">
                {gameId}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="space-y-3"
          >
            <motion.button
              onClick={shareGame}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {navigator.share ? 'Share Game' : 'Copy Link'}
            </motion.button>

            {/* Mobile-specific refresh button */}
            <motion.button
              onClick={onRefresh}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Refresh Game Status
            </motion.button>
          </motion.div>

          {/* Instructions */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700"
          >
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              How to invite a friend:
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Share the game link or game ID with your friend</li>
              <li>• They can join by entering the game ID: <span className="font-mono font-bold">{gameId}</span></li>
              <li>• Once they join, the game will start automatically!</li>
              <li>• If you're stuck here, try the refresh button above</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="w-full mt-6 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Start
        </motion.button>
      </motion.div>
    </div>
  )
}

export default WaitingRoom