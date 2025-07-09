# Multiplayer Tic Tac Toe Information

## Summary
A real-time multiplayer Tic Tac Toe game built with React, Framer Motion, and Supabase. Features include real-time gameplay, smooth animations, sound effects, dark/light mode, responsive design, and winning animations.

## Structure
- **src/**: Main source code directory
  - **components/**: UI components (Board, Square, GameBoard, etc.)
  - **hooks/**: Custom React hooks for game state management
  - **lib/**: Utility libraries and configurations
  - **styles/**: CSS styling with Tailwind
- **.github/**: GitHub Actions workflows for CI/CD
- **.vscode/**: VS Code editor configuration

## Language & Runtime
**Language**: JavaScript (React)
**Version**: React 18
**Build System**: Vite 4.5.0
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- @supabase/supabase-js: ^2.50.3 (Real-time database)
- framer-motion: ^10.16.4 (Animation library)
- react: ^18.2.0 (UI framework)
- react-dom: ^18.2.0 (DOM rendering)
- uuid: ^11.1.0 (Unique ID generation)

**Development Dependencies**:
- @vitejs/plugin-react: ^4.1.0 (Vite React plugin)
- tailwindcss: ^3.3.5 (Utility CSS framework)
- gh-pages: ^6.3.0 (GitHub Pages deployment)

## Build & Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with Supabase credentials

# Development server
npm run dev

# Production build
npm run build
```

## Deployment
**Platform**: GitHub Pages
**Configuration**: GitHub Actions workflow in `.github/workflows/deploy.yml`
**Base URL**: Configured as `/tic-tac-toe/` in `vite.config.js`
**Command**: `npm run deploy` (uses gh-pages)

## Database
**Provider**: Supabase
**Schema**: SQL table for game state with the following structure:
- game_id: Unique identifier for sharing
- player_x_name, player_o_name: Player names
- board: JSON array of game state
- current_turn: Current player's turn
- winner, winning_line: Game outcome data
- status: Game status (waiting, playing, finished)

## Main Files
**Entry Point**: `src/main.jsx`
**Main Component**: `src/MultiplayerApp.jsx`
**Game Logic**: `src/hooks/useGameState.js`
**Database Connection**: `src/lib/supabase.js`

## Features
- Real-time multiplayer using Supabase
- Smooth animations with Framer Motion
- Sound effects using Web Audio API
- Dark/Light theme toggle
- Responsive design with Tailwind CSS
- Game sharing via unique IDs
- Toast notifications for game events