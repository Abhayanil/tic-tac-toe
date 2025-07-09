import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export const useGameState = (gameId = null) => {
  const [gameState, setGameState] = useState({
    id: null,
    gameId: null,
    playerXName: '',
    playerOName: '',
    board: Array(9).fill(null),
    currentTurn: 'X',
    winner: null,
    winningLine: [],
    status: 'waiting', // 'waiting', 'playing', 'finished'
    isLoading: false,
    error: null
  })

  const [currentPlayer, setCurrentPlayer] = useState(null) // 'X' or 'O'
  const subscriptionRef = useRef(null)
  const [xQueue, setXQueue] = useState([]) // indices of X's moves in order
  const [oQueue, setOQueue] = useState([]) // indices of O's moves in order
  const [startingPlayer, setStartingPlayer] = useState('X') // alternates after each game

  // Generate a short game ID
  const generateGameId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

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

  // Create a new game
  const createGame = async (playerName) => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const newGameId = generateGameId()
      const { data, error } = await supabase
        .from('games')
        .insert({
          game_id: newGameId,
          player_x_name: playerName,
          board: Array(9).fill(null),
          current_turn: 'X',
          status: 'waiting'
        })
        .select()
        .single()

      if (error) throw error

      setGameState(prev => ({
        ...prev,
        ...data,
        gameId: data.game_id,
        playerXName: data.player_x_name,
        playerOName: data.player_o_name || '',
        board: data.board,
        currentTurn: data.current_turn,
        winner: data.winner,
        winningLine: data.winning_line || [],
        status: data.status,
        isLoading: false
      }))
      
      setCurrentPlayer('X')
      return newGameId
    } catch (error) {
      console.error('Error creating game:', error)
      setGameState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }))
      return null
    }
  }

  // Join an existing game
  const joinGame = async (gameId, playerName) => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true, error: null }))

      // First, get the current game state
      const { data: gameData, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('game_id', gameId)
        .single()

      if (fetchError) throw fetchError
      if (!gameData) throw new Error('Game not found')
      if (gameData.status !== 'waiting') throw new Error('Game is not available to join')
      if (gameData.player_o_name) throw new Error('Game is already full')

      // Update the game with player O
      const { data, error } = await supabase
        .from('games')
        .update({
          player_o_name: playerName,
          status: 'playing'
        })
        .eq('game_id', gameId)
        .select()
        .single()

      if (error) throw error

      setGameState(prev => ({
        ...prev,
        ...data,
        gameId: data.game_id,
        playerXName: data.player_x_name,
        playerOName: data.player_o_name,
        board: data.board,
        currentTurn: data.current_turn,
        winner: data.winner,
        winningLine: data.winning_line || [],
        status: data.status,
        isLoading: false
      }))
      
      setCurrentPlayer('O')
      return true
    } catch (error) {
      console.error('Error joining game:', error)
      setGameState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }))
      return false
    }
  }

  // Make a move
  const makeMove = async (index) => {
    if (!gameState.gameId || gameState.status !== 'playing') return false
    if (gameState.board[index] || gameState.winner) return false
    if (gameState.currentTurn !== currentPlayer) return false

    try {
      let newBoard = [...gameState.board]
      let newXQueue = [...xQueue]
      let newOQueue = [...oQueue]
      let playerQueue = currentPlayer === 'X' ? newXQueue : newOQueue

      // Enforce 3-symbol rule, but don't remove if it would break a winning line
      if (playerQueue.length === 3) {
        const oldestIdx = playerQueue[0]
        
        // Create a temporary board to test if removing the oldest symbol breaks a winning line
        const tempBoard = [...newBoard]
        tempBoard[oldestIdx] = null
        tempBoard[index] = currentPlayer
        
        const tempResult = checkWinner(tempBoard)
        
        // Only remove the oldest symbol if it doesn't break a winning line for the current player
        if (!tempResult || tempResult.winner !== currentPlayer) {
          playerQueue.shift()
          newBoard[oldestIdx] = null
        } else {
          // If removing would break a winning line, don't allow the move
          console.log('Move blocked: would break winning line')
          return false
        }
      }
      
      playerQueue.push(index)
      newBoard[index] = currentPlayer

      // Update queues
      if (currentPlayer === 'X') {
        newXQueue = playerQueue
      } else {
        newOQueue = playerQueue
      }

      // Check for winner after the move
      const result = checkWinner(newBoard)
      const nextTurn = currentPlayer === 'X' ? 'O' : 'X'
      const newStatus = result ? 'finished' : 'playing'

      // Save to Supabase
      const { data, error } = await supabase
        .from('games')
        .update({
          board: newBoard,
          current_turn: result ? gameState.currentTurn : nextTurn,
          winner: result?.winner || null,
          winning_line: result?.line || null,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('game_id', gameState.gameId)
        .select()
        .single()

      if (error) throw error

      // Update local queues
      setXQueue(newXQueue)
      setOQueue(newOQueue)

      return true
    } catch (error) {
      console.error('Error making move:', error)
      setGameState(prev => ({ ...prev, error: error.message }))
      return false
    }
  }

  // Handle restart game and alternate starting player
  const handleRestartGame = async () => {
    if (!gameState.gameId) return
    const nextStarter = startingPlayer === 'X' ? 'O' : 'X'
    setStartingPlayer(nextStarter)
    setXQueue([])
    setOQueue([])
    try {
      const { data, error } = await supabase
        .from('games')
        .update({
          board: Array(9).fill(null),
          current_turn: nextStarter,
          winner: null,
          winning_line: null,
          status: 'playing',
          updated_at: new Date().toISOString(),
        })
        .eq('game_id', gameState.gameId)
        .select()
        .single()
      if (error) throw error
      setGameState(prev => ({
        ...prev,
        ...data,
        board: data.board,
        currentTurn: data.current_turn,
        winner: data.winner,
        winningLine: data.winning_line || [],
        status: data.status,
        isLoading: false
      }))
    } catch (error) {
      setGameState(prev => ({ ...prev, error: error.message }))
    }
  }

  // Subscribe to game updates
  const subscribeToGame = useCallback((gameId) => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }

    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          const data = payload.new
          console.log('Realtime update received:', data)
          if (data) {
            setGameState(prev => ({
              ...prev,
              ...data,
              gameId: data.game_id,
              playerXName: data.player_x_name,
              playerOName: data.player_o_name || '',
              board: data.board,
              currentTurn: data.current_turn,
              winner: data.winner,
              winningLine: data.winning_line || [],
              status: data.status,
              isLoading: false,
            }))
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase channel status:', status)
        
        // If subscription fails, try to reconnect after a delay
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.log('Channel error, attempting to reconnect...')
          setTimeout(() => {
            if (subscriptionRef.current) {
              subscribeToGame(gameId)
            }
          }, 2000)
        }
      })

    subscriptionRef.current = channel

    return channel
  }, [])

  // Load game by ID
  const loadGame = async (gameId) => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true, error: null }))

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('game_id', gameId)
        .single()

      if (error) throw error
      if (!data) throw new Error('Game not found')

      setGameState(prev => ({
        ...prev,
        ...data,
        gameId: data.game_id,
        playerXName: data.player_x_name,
        playerOName: data.player_o_name || '',
        board: data.board,
        currentTurn: data.current_turn,
        winner: data.winner,
        winningLine: data.winning_line || [],
        status: data.status,
        isLoading: false
      }))

      // Subscribe to updates
      subscribeToGame(gameId)
      
      return data
    } catch (error) {
      console.error('Error loading game:', error)
      setGameState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }))
      return null
    }
  }

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
        subscriptionRef.current = null
      }
    }
  }, [])

  // Load game if gameId is provided
  useEffect(() => {
    if (gameId && !gameState.gameId) {
      loadGame(gameId)
    }
  }, [gameId])

  useEffect(() => {
    if (!gameId) return;

    // Clean up previous subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // Subscribe to changes for this game
    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const data = payload.new;
          console.log('Realtime update received:', data);
          if (data) {
            setGameState(prev => ({
              ...prev,
              ...data,
              gameId: data.game_id,
              playerXName: data.player_x_name,
              playerOName: data.player_o_name || '',
              board: data.board,
              currentTurn: data.current_turn,
              winner: data.winner,
              winningLine: data.winning_line || [],
              status: data.status,
              isLoading: false,
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase channel status:', status);
        
        // If subscription fails, try to reconnect after a delay
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.log('Channel error, attempting to reconnect...')
          setTimeout(() => {
            if (subscriptionRef.current) {
              subscribeToGame(gameId)
            }
          }, 2000)
        }
      });

    subscriptionRef.current = channel;

    // Also set up a fallback polling mechanism for mobile devices
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('game_id', gameId)
          .single();

        if (!error && data) {
          setGameState(prev => {
            // Only update if the data has actually changed
            if (JSON.stringify(prev.board) !== JSON.stringify(data.board) ||
                prev.status !== data.status ||
                prev.currentTurn !== data.current_turn ||
                prev.winner !== data.winner) {
              console.log('Polling update:', data);
              return {
                ...prev,
                ...data,
                gameId: data.game_id,
                playerXName: data.player_x_name,
                playerOName: data.player_o_name || '',
                board: data.board,
                currentTurn: data.current_turn,
                winner: data.winner,
                winningLine: data.winning_line || [],
                status: data.status,
                isLoading: false,
              };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds as fallback

    // Cleanup on unmount or gameId change
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      clearInterval(pollInterval);
    };
  }, [gameId]);

  return {
    gameState,
    currentPlayer,
    createGame,
    joinGame,
    makeMove,
    loadGame,
    subscribeToGame,
    setStartingPlayer,
    handleRestartGame,
    xQueue,
    oQueue
  }
}