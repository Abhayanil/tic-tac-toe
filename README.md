# 🎮 Tic Tac Toe - React & Framer Motion

A beautiful, interactive Tic Tac Toe game built with React and Framer Motion, featuring smooth animations, sound effects, and a modern design.

## ✨ Features

- **Smooth Animations**: Powered by Framer Motion for delightful user interactions
- **Sound Effects**: Audio feedback for moves and game events
- **Dark/Light Mode**: Toggle between themes with animated transitions
- **Score Tracking**: Keep track of wins, losses, and draws
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Winning Animations**: Confetti celebration and highlighting winning combinations
- **Modern UI**: Clean design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to play the game!

### Build for Production

```bash
npm run build
```

## 🎯 How to Play

1. **Choose Your Move**: Click on any empty square to place your X or O
2. **Take Turns**: Players alternate between X and O
3. **Win Condition**: Get three of your symbols in a row (horizontally, vertically, or diagonally)
4. **New Game**: Click the "New Game" button to start over
5. **Theme Toggle**: Use the theme toggle button in the top-right corner
6. **Score Tracking**: Scores are automatically tracked and can be reset

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Board.jsx          # 3x3 game grid
│   ├── Square.jsx         # Individual clickable cells
│   ├── StatusBar.jsx      # Game status display
│   ├── ResetButton.jsx    # New game button
│   ├── ThemeToggle.jsx    # Dark/light mode toggle
│   └── ScoreBoard.jsx     # Score tracking display
├── styles/
│   └── main.css          # Tailwind CSS styles
├── App.jsx               # Main application component
└── main.jsx             # Application entry point
```

## 🎨 Technologies Used

- **React 18**: Modern React with hooks
- **Framer Motion**: Animation library for smooth transitions
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Web Audio API**: For sound effects

## 🎵 Sound Effects

The game includes subtle sound effects:
- **Move Sound**: Soft beep when placing X or O
- **Reset Sound**: Swoosh sound when starting a new game

Sound effects are generated using the Web Audio API and work in modern browsers.

## 🌙 Theme Support

Toggle between light and dark modes with the theme button in the top-right corner. The theme preference is applied immediately with smooth transitions.

## 📱 Responsive Design

The game is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🎊 Animations

- **Board Entry**: Staggered animation when the game loads
- **Symbol Placement**: Bouncy scale-in effect for X and O
- **Winning Line**: Highlighting and pulsing animation
- **Confetti**: Celebration animation when someone wins
- **Hover Effects**: Interactive feedback on all clickable elements

## 🔧 Customization

You can easily customize the game by modifying:

- **Colors**: Edit the Tailwind config or CSS classes
- **Animations**: Adjust Framer Motion variants in components
- **Sounds**: Modify the Web Audio API code in Square.jsx and ResetButton.jsx
- **Board Size**: The architecture supports extending to larger grids

## 🤝 Contributing

Feel free to contribute to this project! Some ideas for enhancements:

- AI opponent with different difficulty levels
- Online multiplayer support
- Tournament mode
- Custom themes
- More sound effects and music
- Game statistics and analytics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Enjoy Playing!

Have fun playing Tic Tac Toe! The game combines classic gameplay with modern web technologies for an engaging experience.