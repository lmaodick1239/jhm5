# Minesweeper 💣

A classic Minesweeper game built with React and Material-UI (MUI).

## 🎮 Features

- **Multiple Difficulty Levels**:
  - Beginner: 9×9 grid with 10 mines
  - Intermediate: 16×16 grid with 40 mines
  - Expert: 16×30 grid with 99 mines
  - Custom: Configure your own grid size and mine count
  
- **Game Features**:
  - Left-click to reveal cells
  - Right-click to flag suspected mines
  - Timer to track your speed
  - Mine counter showing remaining flags
  - Win/lose detection
  - Restart game anytime

- **Material-UI Design**: Beautiful, responsive interface with Material Design
- **Persistent High Scores**: Best times saved to localStorage
- **Smooth Animations**: Polished user experience

## 🛠️ Technologies

- **React 19** - UI framework
- **Material-UI (MUI)** - Component library and theming
- **Vite** - Build tool

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

## 🎯 How to Play

1. **Left-click** on a cell to reveal it
2. **Right-click** on a cell to flag it as a mine
3. **Numbers** indicate how many mines are adjacent to that cell
4. **Clear all non-mine cells** to win
5. **Hit a mine** and you lose!

### Tips
- Start by clicking corners and edges
- Use the numbers to deduce mine locations
- Flag all mines to help track your progress
- The first click is always safe

## 📁 Project Structure

```
src/
├── App.jsx           # Main game logic and UI
├── Board.jsx         # Game board component
├── Cell.jsx          # Individual cell component
├── theme.js          # MUI theme configuration
└── main.jsx          # Application entry point
```

## 🎨 Customization

- Edit `src/theme.js` to customize colors and Material-UI theme
- Modify difficulty presets in `App.jsx`
- Adjust cell size and styling in `Cell.jsx`
