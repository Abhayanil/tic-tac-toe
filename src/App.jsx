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
  const [darkMode, setDarkMode] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [gameCount, setGameCount] = useState(0)
  // Track each player's moves in order (arrays of board indices)
  const [playerMoves, setPlayerMoves] = useState({ X: [], O: [] })
  // Track squares that are about to disappear for animation
  const [disappearingSquares, setDisappearingSquares] = useState([])
  // Track the starting player and alternate after each game
  const [startingPlayer, setStartingPlayer] = useState('X')

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
    if (board[index] || winner) return

    const currentPlayer = isXNext ? 'X' : 'O'
    let newBoard = [...board]
    let newPlayerMoves = { ...playerMoves }

    // Remove oldest symbol if player already has 3 (but not if it would break a winning line)
    if (newPlayerMoves[currentPlayer].length === 3) {
      const oldestIndex = newPlayerMoves[currentPlayer][0]
      // Check if removing this symbol would break a current winning line
      const tempBoard = [...newBoard]
      tempBoard[oldestIndex] = null
      const tempResult = checkWinner(tempBoard)
      
      // Only remove if it doesn't break a winning line
      if (!tempResult || tempResult.winner !== currentPlayer) {
        newBoard[oldestIndex] = null
        newPlayerMoves[currentPlayer] = newPlayerMoves[currentPlayer].slice(1)
      }
    }

    // Add the new move to the current player's move list
    newPlayerMoves[currentPlayer] = [...newPlayerMoves[currentPlayer], index]
    newBoard[index] = currentPlayer
    setBoard(newBoard)
    setPlayerMoves(newPlayerMoves)

    // Check for winner after the move
    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }))
    } else {
      setIsXNext(!isXNext)
    }
  }

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setWinningLine([])
    setPlayerMoves({ X: [], O: [] })
    setDisappearingSquares([])
    setGameCount(prev => prev + 1)
    // Alternate starting player
    setStartingPlayer(prev => (prev === 'X' ? 'O' : 'X'))
    setIsXNext(startingPlayer === 'X' ? false : true)
  }

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0 })
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

  // Set isXNext to match startingPlayer at the start of each game
  useEffect(() => {
    setIsXNext(startingPlayer === 'X')
  }, [startingPlayer, gameCount])

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
          disappearingSquares={disappearingSquares}
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