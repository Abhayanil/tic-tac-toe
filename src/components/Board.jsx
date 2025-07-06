import React from 'react'
import { motion } from 'framer-motion'
import Square from './Square'

const Board = ({ board, onSquareClick, winningLine, winner, disappearingSquares = [], isDisabled = false }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className="game-board"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine.includes(index)}
          isDisabled={isDisabled || winner || value !== null}
          isDisappearing={disappearingSquares.includes(index) && !winningLine.includes(index)}
          index={index}
        />
      ))}
    </motion.div>
  )
}

export default Board