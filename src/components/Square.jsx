import React from 'react'
import { motion } from 'framer-motion'

const Square = ({ value, onClick, isWinning, isDisabled, isDisappearing, index }) => {
  const squareVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: index * 0.03,
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  const symbolVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.4
      }
    },
    disappearing: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  const winningVariants = {
    winning: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
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

  const handleClick = (e) => {
    // Prevent default to avoid any mobile browser quirks
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Square clicked:', { index, isDisabled, value, hasValue: !!value });
    
    if (!isDisabled && !value) {
      playClickSound()
      onClick()
    }
  }

  const handleTouchStart = (e) => {
    // Prevent default touch behavior that might interfere
    e.preventDefault()
    e.stopPropagation()
  }

  const handleTouchEnd = (e) => {
    // Handle touch end for better mobile experience
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Square touch end:', { index, isDisabled, value, hasValue: !!value });
    
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={isDisabled}
      // Add touch-action CSS property for better mobile handling
      style={{ touchAction: 'manipulation' }}
    >
      {value && (
        <motion.span
          variants={symbolVariants}
          initial="hidden"
          animate={isDisappearing ? "disappearing" : "visible"}
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
      
      {/* Subtle hover effect for empty squares */}
      {!value && !isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gray-100 dark:bg-gray-600 rounded-lg opacity-0 pointer-events-none"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.button>
  )
}

export default Square