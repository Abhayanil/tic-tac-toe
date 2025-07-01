import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import ResetButton from './components/ResetButton'
import ThemeToggle from './components/ThemeToggle'
import ScoreBoard from './components/ScoreBoard'

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [isDraw, setIsDraw] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [gameCount, setGameCount] = useState(0)

  // Check for winner
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line }
      }
    }
    return null
  }

  // Handle square click
  const handleSquareClick = (index) => {
    if (board[index] || winner || isDraw) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }))
    } else if (newBoard.every(square => square !== null)) {
      setIsDraw(true)
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }))
    } else {
      setIsXNext(!isXNext)
    }
  }

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine([])
    setIsDraw(false)
    setGameCount(prev => prev + 1)
  }

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    setGameCount(0)
  }

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="game-container">
      <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="game-title">Tic Tac Toe</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ScoreBoard scores={scores} onResetScores={resetScores} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StatusBar 
          winner={winner}
          isDraw={isDraw}
          isXNext={isXNext}
          gameCount={gameCount}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        key={gameCount} // This will trigger re-animation on reset
      >
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
          winner={winner}
          isDraw={isDraw}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <ResetButton onReset={resetGame} />
      </motion.div>

      {/* Confetti animation for winner */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
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

export default App