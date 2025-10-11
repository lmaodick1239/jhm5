# Tic Tac Toe ⭕❌

A clean and modern Tic Tac Toe game built with React and TypeScript, featuring smooth SVG animations and a responsive design.

## 🎮 Features

- **SVG-based Game Board**: Crisp, scalable graphics that look great on any screen size
- **Smooth Animations**: 
  - Grid lines draw in sequence
  - X and O symbols animate when placed
  - Winning line highlight effect
- **Smart Win Detection**: Automatically detects wins and draws
- **Responsive Design**: Adapts to any screen size
- **Clean UI**: Minimalist design focused on gameplay
- **TypeScript**: Fully typed for better development experience

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **SVG** - Vector graphics for crisp rendering

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play.

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🎯 How to Play

1. The game starts with Player X
2. Click any empty square to place your symbol
3. Players alternate turns (X, then O)
4. First player to get 3 in a row wins!
5. Possible winning combinations:
   - Three horizontal in a row
   - Three vertical in a column
   - Three diagonal
6. If all squares are filled with no winner, it's a draw
7. Click "New Game" in the alert to play again

## 📁 Project Structure

```
src/
├── App.tsx              # Main app component
├── TicTacToeSVG.tsx     # SVG game board with animations
├── App.css              # Styling
└── main.tsx             # Entry point
```

## 🎨 Features Detail

### SVG Grid Animation
- Grid lines draw in with a smooth animation
- Lines appear sequentially for visual appeal
- Staggered timing for a polished effect

### Symbol Placement
- X symbols draw with crossing lines animation
- O symbols draw as a circle with stroke animation
- Smooth fade-in and scale effects

### Win Detection
- Checks all possible winning combinations
- Highlights the winning line
- Shows winner announcement

### Responsive Sizing
- Automatically adjusts to screen size
- Maintains aspect ratio
- Optimal viewing on desktop, tablet, and mobile
- SVG ensures crisp rendering at any size

## 🎯 Game Logic

The game implements:
- **State Management**: React hooks for game state
- **Turn Alternation**: Automatic switching between X and O
- **Win Checking**: All 8 possible winning combinations
- **Draw Detection**: Identifies when board is full with no winner
- **Reset Functionality**: New game restarts all state

## 🖼️ Visual Design

- **Minimalist Style**: Clean, uncluttered interface
- **Gradient Background**: Subtle radial gradient
- **SVG Graphics**: Crisp lines and symbols
- **Animations**: Smooth transitions and effects
- **Typography**: Clear, readable text

---

**Note**: A standalone vanilla JavaScript version is available in the `ttv/` directory.
