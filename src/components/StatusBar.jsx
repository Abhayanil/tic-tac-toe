import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StatusBar = ({ winner, isXNext, gameCount }) => {
  const getStatusMessage = () => {
    if (winner) {
      return `🎉 Player ${winner} Wins!`
    }
    return `Player ${isXNext ? 'X' : 'O'}'s Turn`
  }

  const getStatusColor = () => {
    if (winner) {
      return winner === 'X' 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-red-600 dark:text-red-400'
    }
    return isXNext 
      ? 'text-blue-600 dark:text-blue-400' 
      : 'text-red-600 dark:text-red-400'
  }

  const statusVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const turnIndicatorVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  return (
    <motion.div 
      className="status-bar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${winner}-${isXNext}-${gameCount}`}
          variants={statusVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`status-text ${getStatusColor()}`}
        >
          {getStatusMessage()}
        </motion.div>
      </AnimatePresence>

      {!winner && (
        <motion.div
          variants={turnIndicatorVariants}
          initial="hidden"
          animate="visible"
          className="turn-indicator"
        >
          <motion.div
            className="flex items-center justify-center gap-2"
            variants={pulseVariants}
            animate={!winner ? "pulse" : ""}
          >
            <span>Current Player:</span>
            <motion.span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                isXNext 
                  ? 'bg-blue-500 dark:bg-blue-600' 
                  : 'bg-red-500 dark:bg-red-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isXNext ? 'X' : 'O'}
            </motion.span>
          </motion.div>
        </motion.div>
      )}

      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Game #{gameCount + 1} Complete
        </motion.div>
      )}
    </motion.div>
  )
}

export default StatusBar