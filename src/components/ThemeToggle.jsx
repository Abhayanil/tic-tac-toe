import React from 'react'
import { motion } from 'framer-motion'

const ThemeToggle = ({ darkMode, onToggle }) => {
  const toggleVariants = {
    light: {
      backgroundColor: "#f3f4f6",
      border: "2px solid #e5e7eb"
    },
    dark: {
      backgroundColor: "#374151",
      border: "2px solid #4b5563"
    }
  }

  const iconVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180,
      opacity: 0
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }
  }

  const hoverVariants = {
    hover: {
      scale: 1.1,
      boxShadow: darkMode 
        ? "0 10px 25px rgba(0,0,0,0.3)" 
        : "0 10px 25px rgba(0,0,0,0.1)",
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
    <motion.button
      className="theme-toggle"
      variants={toggleVariants}
      animate={darkMode ? "dark" : "light"}
      whileHover="hover"
      whileTap="tap"
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      <motion.div
        key={darkMode ? 'dark' : 'light'}
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        className={darkMode ? 'text-yellow-400' : 'text-gray-700'}
      >
        {darkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle