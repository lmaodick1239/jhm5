# Math Reaction Challenge 🎮

A fun and educational math game built with React, featuring a beautiful chalkboard visual theme. Test your mental calculation skills and reaction speed across multiple difficulty levels!

## 🌟 Features

- **Four Game Modes**:
  - Easy Mode: 10 questions with numbers 1-10
  - Medium Mode: 15 questions with numbers 1-50
  - Hard Mode: 20 questions with numbers 1-100
  - Infinity Mode: Endless questions with 3 lives and progressive difficulty

- **Chalkboard Theme**: Beautiful hand-drawn style with chalk fonts and textures
- **Score Tracking**: High scores automatically saved to localStorage
- **Instant Feedback**: Visual color-coded answer feedback (green for correct, red for incorrect)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progressive Difficulty**: In Infinity Mode, difficulty increases as you score higher

## 🛠️ Technologies

- **React 18** with React Compiler for optimized performance
- **Vite** - Lightning-fast build tool
- **HeroUI** - Beautiful, accessible React components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **LocalStorage** - Persistent high score tracking

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## 🎯 How to Play

1. **Select a Game Mode** from the main menu
2. **Solve the math problem** displayed on screen
3. **Click the correct answer** from four options
4. **Earn 100 points** for each correct answer
5. In **Infinity Mode**, you have 3 lives - lose one for each wrong answer!

### Scoring System

- ✅ Correct Answer: +100 points
- ❌ Wrong Answer: -1 life (Infinity Mode only)
- 🏆 High scores are automatically saved!

### Infinity Mode Difficulty Scaling

- **0-500 points**: Easy (numbers 1-10, +/-)
- **501-1500 points**: Medium (numbers 1-50, +/-/×)
- **1501-2000 points**: Hard (numbers 1-100, +/-/×/÷)
- **2000+ points**: Very Hard (numbers 10-200, all operations)

## 🎨 Project Structure

```
src/
├── components/
│   ├── MainMenu.jsx      # Main menu with mode selection and modals
│   └── GameScreen.jsx    # Game interface with questions and answers
├── utils/
│   └── gameUtils.js      # Game logic, question generation, scoring
├── App.jsx               # Main app component with view routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and chalkboard theme
```

## 🎨 Customization

### Chalkboard Colors

The theme uses custom colors defined in `tailwind.config.js`:

- **Chalkboard backgrounds**: Dark green tones (#0f1e0f to #2d4f2d)
- **Chalk colors**: White (#f5f5dc), Yellow (#ffeb99), Red (#ff6b6b), Green (#90ee90)

### Fonts

Uses Google Fonts for authentic chalk handwriting:
- Caveat
- Patrick Hand

## 📝 Key Components

### MainMenu.jsx
- Large prominent "Start Game" button
- Secondary buttons for Instructions, About, and High Score
- Modal dialogs with game information
- Displays current high score

### GameScreen.jsx
- Real-time score and progress tracking
- Lives display for Infinity Mode
- Question display with large, readable text
- Four answer buttons with color-coded feedback
- 1-second pause after answer selection
- Game over modal with detailed statistics

### gameUtils.js
- Question generation with multiple operations (+, -, ×, ÷)
- Difficulty scaling based on score
- LocalStorage high score management
- Answer validation and scoring logic

## 🚀 Performance

- **React Compiler** enabled for automatic optimization
- **Code splitting** via Vite for faster load times
- **Tailwind CSS** purging for minimal CSS bundle size
- **Efficient re-renders** with proper React hooks usage

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 Responsive Design

The game is fully responsive and adapts to:
- Desktop (1920x1080 and larger)
- Tablet (768x1024)
- Mobile (375x667 and smaller)

## 🎓 Educational Value

Perfect for:
- Elementary to middle school students
- Mental math practice
- Improving calculation speed
- Learning basic arithmetic operations

## 🔧 Development Notes

- Uses **Vite 6** for modern, fast development
- **HeroUI 2.8.5** for accessible, beautiful components
- **Tailwind CSS 4** with custom chalkboard theme
- **React Compiler** for automatic optimization
- No sound effects (as per requirements)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Enjoy the game! 🎮✨**
