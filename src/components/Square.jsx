import React from 'react'
import { motion } from 'framer-motion'

const Square = ({ value, onClick, isWinning, isDisabled, index }) => {
  const squareVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -90
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
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

  const symbolVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        duration: 0.6
      }
    }
  }

  const winningVariants = {
    winning: {
      backgroundColor: ["#f0fdf4", "#bbf7d0", "#f0fdf4"],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }

  const getSymbolColor = (symbol) => {
    return symbol === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
  }

  const playClickSound = () => {
    // Create a simple click sound using Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const handleClick = () => {
    if (!isDisabled && !value) {
      playClickSound()
      onClick()
    }
  }

  return (
    <motion.button
      className={`
        game-square 
        ${isDisabled ? 'disabled' : ''} 
        ${isWinning ? 'winning' : ''}
        ${value ? getSymbolColor(value) : ''}
      `}
      variants={squareVariants}
      initial="hidden"
      animate={isWinning ? "winning" : "visible"}
      whileHover={!isDisabled ? "hover" : {}}
      whileTap={!isDisabled ? "tap" : {}}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {value && (
        <motion.span
          variants={symbolVariants}
          initial="hidden"
          animate="visible"
          className="select-none font-bold"
          style={{
            textShadow: value === 'X' 
              ? '2px 2px 4px rgba(59, 130, 246, 0.3)' 
              : '2px 2px 4px rgba(239, 68, 68, 0.3)'
          }}
        >
          {value}
        </motion.span>
      )}
      
      {/* Hover effect for empty squares */}
      {!value && !isDisabled && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-20 text-gray-400 text-2xl font-bold pointer-events-none"
          whileHover={{ opacity: 0.3 }}
        >
          ?
        </motion.div>
      )}
    </motion.button>
  )
}

export default Square