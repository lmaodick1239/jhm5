import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import ReplayIcon from '@mui/icons-material/Replay';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import theme from './theme';
import Board from './Board.jsx';

const DIFFICULTIES = {
  beginner: { name: 'Beginner', height: 9, width: 9, mines: 10 },
  intermediate: { name: 'Intermediate', height: 16, width: 16, mines: 40 },
  expert: { name: 'Expert', height: 16, width: 30, mines: 99 },
  custom: { name: 'Custom' },
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function useTimer(running) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const reset = () => setSeconds(0);
  return { seconds, reset };
}

function App() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [custom, setCustom] = useState({ height: 9, width: 9, mines: 10 });
  const [gameCfg, setGameCfg] = useState(DIFFICULTIES.beginner);
  const [gameKey, setGameKey] = useState(0);
  const [running, setRunning] = useState(false);
  const { seconds, reset: resetTimer } = useTimer(running);
  const [flagsLeft, setFlagsLeft] = useState(gameCfg.mines);
  const [focusPos, setFocusPos] = useState([0, 0]);

  const cfg = useMemo(() => {
    if (difficulty === 'custom') {
      const h = clamp(custom.height | 0, 5, 40);
      const w = clamp(custom.width | 0, 5, 60);
      const maxMines = h * w - 9;
      const m = clamp(custom.mines | 0, 1, Math.max(1, maxMines));
      return { name: 'Custom', height: h, width: w, mines: m };
    }
    return DIFFICULTIES[difficulty];
  }, [difficulty, custom]);

  useEffect(() => {
    setGameCfg(cfg);
    setFlagsLeft(cfg.mines || 0);
  }, [cfg]);

  const highScoreKey =
    difficulty in DIFFICULTIES && difficulty !== 'custom'
      ? `ms_highscore_${difficulty}`
      : null;
  const best = useMemo(() => {
    if (!highScoreKey) return null;
    const raw = localStorage.getItem(highScoreKey);
    return raw ? Number(raw) : null;
  }, [highScoreKey, gameKey]);

  const startNewGame = () => {
    setGameKey((k) => k + 1);
    setRunning(false);
    resetTimer();
    setFlagsLeft(cfg.mines || 0);
    setFocusPos([0, 0]);
  };

  const handleFirstAction = () => setRunning(true);
  const handleWin = () => {
    setRunning(false);
    if (highScoreKey) {
      const raw = localStorage.getItem(highScoreKey);
      if (!raw || seconds < Number(raw)) {
        localStorage.setItem(highScoreKey, String(seconds));
      }
    }
  };
  const handleLose = () => {
    setRunning(false);
  };

  const handleBoardState = (board) => {
    const totalFlags = board.reduce(
      (acc, row) => acc + row.filter((c) => c.flagged).length,
      0
    );
    setFlagsLeft(Math.max(0, (gameCfg.mines || 0) - totalFlags));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          color: 'text.primary',
          p: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Minesweeper
          </Typography>
          <Paper elevation={0} sx={{ p: 1, mb: 1, backgroundColor: 'background.paper' }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FlagIcon color="warning" />
                  <Typography variant="h6" aria-label={`Mines remaining: ${flagsLeft}`}>
                    {flagsLeft}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TimerIcon color="info" />
                  <Typography variant="h6" aria-live="polite" aria-atomic>
                    {formatTime(seconds)}
                  </Typography>
                </Stack>
                {best != null ? (
                  <Tooltip title="Best time for this difficulty">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LeaderboardIcon color="secondary" />
                      <Typography variant="body1">Best: {formatTime(best)}</Typography>
                    </Stack>
                  </Tooltip>
                ) : null}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                <Select size="small" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <MenuItem value="beginner">Beginner (9x9, 10)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (16x16, 40)</MenuItem>
                  <MenuItem value="expert">Expert (16x30, 99)</MenuItem>
                  <MenuItem value="custom">Custom...</MenuItem>
                </Select>
                {difficulty === 'custom' ? (
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      label="H"
                      type="number"
                      value={custom.height}
                      onChange={(e) => setCustom((c) => ({ ...c, height: e.target.value }))}
                      inputProps={{ min: 5, max: 40 }}
                      sx={{ width: 90 }}
                    />
                    <TextField
                      size="small"
                      label="W"
                      type="number"
                      value={custom.width}
                      onChange={(e) => setCustom((c) => ({ ...c, width: e.target.value }))}
                      inputProps={{ min: 5, max: 60 }}
                      sx={{ width: 90 }}
                    />
                    <TextField
                      size="small"
                      label="# Mines"
                      type="number"
                      value={custom.mines}
                      onChange={(e) => setCustom((c) => ({ ...c, mines: e.target.value }))}
                      inputProps={{ min: 1 }}
                      sx={{ width: 120 }}
                    />
                  </Stack>
                ) : null}
                <Button variant="contained" startIcon={<ReplayIcon />} onClick={startNewGame}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Paper>
          <Divider sx={{ mb: 1 }} />
          <Board
            key={gameKey}
            height={gameCfg.height}
            width={gameCfg.width}
            mines={gameCfg.mines}
            cellSize={32}
            playing={running}
            onFirstAction={handleFirstAction}
            onWin={handleWin}
            onLose={handleLose}
            focusPos={focusPos}
            setFocusPos={setFocusPos}
            gameKey={gameKey}
            onBoardChange={handleBoardState}
          />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Keyboard: Arrow keys to move, Enter/Space to reveal, F to flag. Right-click to flag.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
