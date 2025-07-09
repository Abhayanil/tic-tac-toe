import { useState, useCallback, useEffect } from 'react'

export const useSingleGameState = (initialPlayerXName = 'Player X', initialPlayerOName = 'Player O') => {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentTurn, setCurrentTurn] = useState('X') // X starts first
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState(null)
  const [gameCount, setGameCount] = useState(0) // To track game number for alternating first player
  const [playerXName, setPlayerXName] = useState(initialPlayerXName)
  const [playerOName, setPlayerOName] = useState(initialPlayerOName)

  // Check for winner
  const checkWinner = useCallback((boardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a], line: lines[i] }
      }
    }

    return { winner: null, line: null }
  }, [])

  // Make a move
  const makeMove = useCallback((index) => {
    if (board[index] || winner) return false

    const newBoard = [...board]
    newBoard[index] = currentTurn
    setBoard(newBoard)

    // Check for winner
    const { winner: newWinner, line } = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      setWinningLine(line)
      return true
    }

    // Switch turns
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X')
    return true
  }, [board, currentTurn, winner, checkWinner])

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setWinningLine(null)
    
    // Alternate who starts first
    const newGameCount = gameCount + 1
    setGameCount(newGameCount)
    setCurrentTurn(newGameCount % 2 === 0 ? 'X' : 'O')
  }, [gameCount])

  // Set player names
  const setPlayers = useCallback(({ playerXName: newPlayerXName, playerOName: newPlayerOName }) => {
    setPlayerXName(newPlayerXName || 'Player X')
    setPlayerOName(newPlayerOName || 'Player O')
  }, [])

  // Construct game state object
  const gameState = {
    board,
    currentTurn,
    winner,
    winningLine,
    playerXName,
    playerOName,
    status: winner ? 'finished' : 'playing',
    isLoading: false,
    error: null
  }

  return {
    gameState,
    makeMove,
    resetGame,
    setPlayers
  }
}