import React from 'react'
import { motion } from 'framer-motion'
import Square from './Square'

const Board = ({ board, onSquareClick, winningLine, winner, isDraw }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const boardVariants = {
    reset: {
      scale: [1, 0.95, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className="game-board"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine.includes(index)}
          isDisabled={winner || isDraw || value !== null}
          index={index}
        />
      ))}
    </motion.div>
  )
}

export default Board