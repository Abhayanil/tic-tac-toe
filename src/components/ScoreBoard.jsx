import React from 'react'
import { motion } from 'framer-motion'

const ScoreBoard = ({ scores, onResetScores }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const scoreUpdateVariants = {
    update: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const resetButtonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#ef4444",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <motion.div
      className="score-board"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="score-item"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <div className="score-label">Player X</div>
        <motion.div 
          className="score-value text-blue-600 dark:text-blue-400"
          key={`x-${scores.X}`}
          variants={scoreUpdateVariants}
          animate={scores.X > 0 ? "update" : ""}
        >
          {scores.X}
        </motion.div>
      </motion.div>

      <motion.div
        className="score-item"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <div className="score-label">Draws</div>
        <motion.div 
          className="score-value text-yellow-600 dark:text-yellow-400"
          key={`draws-${scores.draws}`}
          variants={scoreUpdateVariants}
          animate={scores.draws > 0 ? "update" : ""}
        >
          {scores.draws}
        </motion.div>
      </motion.div>

      <motion.div
        className="score-item"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <div className="score-label">Player O</div>
        <motion.div 
          className="score-value text-red-600 dark:text-red-400"
          key={`o-${scores.O}`}
          variants={scoreUpdateVariants}
          animate={scores.O > 0 ? "update" : ""}
        >
          {scores.O}
        </motion.div>
      </motion.div>

      {(scores.X > 0 || scores.O > 0 || scores.draws > 0) && (
        <motion.button
          className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded-lg font-medium"
          variants={resetButtonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onResetScores}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          Reset Scores
        </motion.button>
      )}
    </motion.div>
  )
}

export default ScoreBoard