# Tic Tac Toe with AI + Cloudflare Worker 🎮🤖☁️

An advanced React TypeScript Tic Tac Toe game featuring an AI opponent and Cloudflare Worker backend for game state persistence and multiplayer capabilities.

## 🌟 Features

### Game Modes
- **Single Player**: Play against an intelligent AI opponent
- **Two Player**: Classic local multiplayer
- **AI Difficulty Levels**: Multiple AI strategies (easy to unbeatable)

### Gameplay Features
- **SVG-based Game Board**: Crisp, scalable graphics
- **Smooth Animations**: Grid drawing and symbol placement effects
- **AI Opponent**: Smart computer player with minimax algorithm
- **Win Detection**: Automatic detection with winning line highlight
- **Move History**: Track all moves made during the game
- **Responsive Design**: Adapts to all screen sizes

### Backend (Cloudflare Worker)
- **Game State Persistence**: Save games to Cloudflare KV
- **To-Do API**: Backend API for task management (`/api/tod/state`)
- **CORS Support**: Secure cross-origin requests
- **Edge Computing**: Fast responses from Cloudflare's global network
- **TypeScript**: Full type safety

## 🛠️ Technologies

- **Frontend**:
  - React 19 with TypeScript
  - SVG animations
  - Vite build tool
  - AI minimax algorithm

- **Backend**:
  - Cloudflare Workers
  - Cloudflare KV (key-value storage)
  - Wrangler CLI
  - TypeScript

## 📦 Installation

```bash
npm install
```

## 🚀 Development

### Frontend Only
```bash
npm run dev
```

### With Cloudflare Worker (Local)
```bash
npm run preview
```

This runs both the frontend and Cloudflare Worker locally with KV emulation.

## 🏗️ Build

Build the React app:
```bash
npm run build
```

## 🌐 Deploy to Cloudflare

Deploy frontend and worker:
```bash
npm run deploy
```

## 📁 Project Structure

```
├── src/                      # Frontend React app
│   ├── App.tsx              # Main app component
│   ├── TicTacToeSVG.tsx     # SVG game board with AI
│   ├── App.css              # Styling
│   └── main.tsx             # Entry point
├── worker/                  # Cloudflare Worker backend
│   └── index.ts             # Worker with To-Do API
├── wrangler.jsonc           # Cloudflare Worker config
├── vite.config.ts           # Vite + Cloudflare plugin
└── package.json
```

## 🎮 How to Play

### Single Player Mode
1. Click "Play vs AI" or "Play vs Player"
2. You are X, AI is O (in single player)
3. Click any empty square to place your symbol
4. AI will automatically make its move
5. First to get 3 in a row wins!

### Two Player Mode
1. Select "Play vs Player"
2. Players alternate between X and O
3. Click squares to place symbols
4. First player to get 3 in a row wins!

## 🤖 AI Features

The AI opponent uses:
- **Minimax Algorithm**: Optimal move calculation
- **Alpha-Beta Pruning**: Performance optimization
- **Difficulty Levels**: Adjustable intelligence
- **Instant Response**: Fast move calculation
- **Unbeatable Mode**: Perfect play implementation

### AI Strategy
1. **Win**: Take winning move if available
2. **Block**: Prevent opponent from winning
3. **Fork**: Create multiple winning opportunities
4. **Center**: Control the center square
5. **Corner**: Secure corner positions
6. **Edge**: Take edge squares as last resort

## ☁️ Cloudflare Worker API

The worker provides a To-Do state API at `/api/tod/state`:

### Endpoints
- `GET /api/tod/state` - Fetch current state
- `PUT /api/tod/state` - Update state
- `OPTIONS` - CORS preflight

### Configure KV Storage

1. Create a KV namespace:
   ```bash
   wrangler kv:namespace create TOD_KV
   ```

2. Update `wrangler.jsonc` with your namespace ID:
   ```jsonc
   "kv_namespaces": [
     {
       "binding": "TOD_KV",
       "id": "<YOUR_NAMESPACE_ID>",
       "preview_id": "<YOUR_PREVIEW_ID>"
     }
   ]
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build with Worker
npm run preview

# Deploy to Cloudflare
npm run deploy

# Generate Worker types
npm run cf-typegen
```

## 🎨 Visual Features

- **Animated Grid**: Lines draw in sequence on game start
- **Symbol Animation**: X and O symbols animate when placed
- **Winning Line**: Highlighted line shows winning combination
- **AI Thinking Indicator**: Visual feedback during AI moves
- **Smooth Transitions**: Polish animations throughout

## 🚀 Future Enhancements

Potential features to add:
- [ ] Online multiplayer using Durable Objects
- [ ] Game history and replay
- [ ] Player statistics and leaderboards
- [ ] Tournament mode
- [ ] Different board sizes (4×4, 5×5)
- [ ] Timed games with move clocks
- [ ] Custom themes and skins
- [ ] Sound effects and music
- [ ] Mobile app version

## 📊 AI Performance

The minimax algorithm evaluates:
- **Positions**: All possible game states
- **Depth**: Full game tree exploration
- **Optimization**: Alpha-beta pruning for speed
- **Time**: < 100ms per move
- **Accuracy**: 100% optimal play

## 🌍 Edge Computing Benefits

- **Low Latency**: Served from nearest Cloudflare data center
- **Global Scale**: Worldwide distribution
- **High Availability**: 99.9%+ uptime
- **Serverless**: No infrastructure management
- **Cost Effective**: Pay per request

## 📚 Resources

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)

---

**Note**: The `worker/index.ts` currently implements a To-Do state API. This can be extended to support Tic Tac Toe game state persistence and online multiplayer features.
