# 🎮 Multiplayer Tic Tac Toe - React & Supabase

A beautiful, interactive multiplayer Tic Tac Toe game built with React, Framer Motion, and Supabase, featuring real-time multiplayer gameplay, smooth animations, and a modern design.

## ✨ Features

- **🌐 Real-time Multiplayer**: Play with friends over the internet using Supabase
- **🎨 Smooth Animations**: Powered by Framer Motion for delightful user interactions
- **🔊 Sound Effects**: Audio feedback for moves and game events
- **🌙 Dark/Light Mode**: Toggle between themes with animated transitions
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎉 Winning Animations**: Confetti celebration and highlighting winning combinations
- **🎯 Turn-based Logic**: Enforced turn system with real-time updates
- **🔗 Easy Sharing**: Share game links or game IDs to invite friends
- **💬 Toast Notifications**: Get notified when it's your turn or when someone joins
- **🎨 Modern UI**: Clean design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- A Supabase account (free tier works perfectly)

### Supabase Setup

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be set up

2. **Create the games table:**
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL to create the games table:
   ```sql
   CREATE TABLE games (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_id TEXT UNIQUE NOT NULL,
     player_x_name TEXT,
     player_o_name TEXT,
     board JSONB DEFAULT '[]'::jsonb,
     current_turn TEXT DEFAULT 'X',
     winner TEXT,
     winning_line JSONB,
     status TEXT DEFAULT 'waiting',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE games ENABLE ROW LEVEL SECURITY;

   -- Allow all operations (you might want to restrict this in production)
   CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);

   -- Enable realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE games;
   ```

3. **Get your project credentials:**
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon/public key

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to play the game!

### Build for Production

```bash
npm run build
```

## 🎯 How to Play

### Creating a Game
1. **Enter your name** and click "Create Game"
2. **Share the game link** or game ID with your friend
3. **Wait for them to join** - you'll see a waiting screen
4. **Start playing** once they join!

### Joining a Game
1. **Get the game ID** from your friend (or click their shared link)
2. **Enter your name** and the game ID
3. **Click "Join Game"** to start playing immediately

### Playing
1. **Take turns** - you can only move when it's your turn
2. **Click on empty squares** to place your symbol (X or O)
3. **Win condition**: Get three of your symbols in a row
4. **Real-time updates**: See your opponent's moves instantly
5. **Notifications**: Get notified when it's your turn

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Board.jsx          # 3x3 game grid
│   ├── Square.jsx         # Individual clickable cells
│   ├── GameBoard.jsx      # Multiplayer game board wrapper
│   ├── StartScreen.jsx    # Name input + create/join game
│   ├── WaitingRoom.jsx    # Waiting for player screen
│   ├── StatusBar.jsx      # Game status display (legacy)
│   ├── ResetButton.jsx    # New game button (legacy)
│   ├── ThemeToggle.jsx    # Dark/light mode toggle
│   └── ScoreBoard.jsx     # Score tracking display (legacy)
├── hooks/
│   └── useGameState.js    # Custom hook for Supabase game sync
├── lib/
│   └── supabase.js        # Supabase client configuration
├── styles/
│   └── main.css          # Tailwind CSS styles
├── App.jsx               # Original single-player app (legacy)
├── MultiplayerApp.jsx    # Main multiplayer application component
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