import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Cell from './Cell.jsx';

// Utility helpers for board logic
const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function inBounds(r, c, h, w) {
  return r >= 0 && r < h && c >= 0 && c < w;
}

function makeEmptyBoard(height, width) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ revealed: false, flagged: false, mine: false, adjacent: 0 }))
  );
}

function plantMines(board, firstR, firstC, mines) {
  const h = board.length, w = board[0].length;
  const safe = new Set();
  // Make first click and its neighbors safe
  for (const [dr, dc] of [[0,0], ...dirs]) {
    const r = firstR + dr, c = firstC + dc;
    if (inBounds(r, c, h, w)) safe.add(`${r},${c}`);
  }
  let planted = 0;
  while (planted < mines) {
    const r = Math.floor(Math.random() * h);
    const c = Math.floor(Math.random() * w);
    const key = `${r},${c}`;
    if (safe.has(key)) continue;
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      planted++;
    }
  }
  // Compute adjacency counts
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc, h, w) && board[nr][nc].mine) count++;
      }
      board[r][c].adjacent = count;
    }
  }
}

function floodReveal(board, r, c) {
  const h = board.length, w = board[0].length;
  const stack = [[r, c]];
  const visited = new Set();
  while (stack.length) {
    const [cr, cc] = stack.pop();
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);
    const cell = board[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) {
      for (const [dr, dc] of dirs) {
        const nr = cr + dr, nc = cc + dc;
        if (inBounds(nr, nc, h, w)) stack.push([nr, nc]);
      }
    }
  }
}

function countHiddenNonMines(board) {
  let hidden = 0;
  for (const row of board) for (const cell of row) if (!cell.revealed && !cell.mine) hidden++;
  return hidden;
}

function Board({
  height,
  width,
  mines,
  cellSize = 32,
  playing,
  onFirstAction,
  onWin,
  onLose,
  focusPos,
  setFocusPos,
  gameKey, // resets board when changed
  onBoardChange,
}) {
  const [board, setBoard] = useState(() => makeEmptyBoard(height, width));
  const [generated, setGenerated] = useState(false);
  const [status, setStatus] = useState('idle'); // idle|playing|won|lost

  const containerRef = useRef(null);

  // Reset when config or gameKey changes
  useEffect(() => {
    setBoard(makeEmptyBoard(height, width));
    setGenerated(false);
    setStatus('idle');
  }, [height, width, gameKey]);

  const revealAllMinesAndMark = useCallback((clickedR, clickedC) => {
    setBoard((prev) => {
      const next = prev.map((row, r) => row.map((cell, c) => {
        const newCell = { ...cell };
        if (newCell.mine) {
          newCell.revealed = true;
          if (r === clickedR && c === clickedC) newCell.exploded = true;
        }
        if (newCell.flagged && !newCell.mine) {
          newCell.wrongFlag = true;
          newCell.revealed = true;
          newCell.flagged = false;
        }
        return newCell;
      }));
      onBoardChange?.(next);
      return next;
    });
  }, [onBoardChange]);

  const handleReveal = useCallback((r, c) => {
    if (status === 'won' || status === 'lost') return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (!generated) {
        plantMines(next, r, c, mines);
        setGenerated(true);
        onFirstAction?.();
        setStatus('playing');
      }
      const cell = next[r][c];
      if (cell.revealed || cell.flagged) return prev; // no change
      if (cell.mine) {
        // Loss
        setStatus('lost');
        // Apply reveal after we update state
        setTimeout(() => revealAllMinesAndMark(r, c), 0);
        onLose?.();
        onBoardChange?.(next);
        return next; // returning next; mines will be revealed via another state update
      }
      floodReveal(next, r, c);
      onBoardChange?.(next);
      return next;
    });
  }, [generated, mines, onFirstAction, onLose, revealAllMinesAndMark, status, onBoardChange]);

  const handleToggleFlag = useCallback((r, c) => {
    if (status === 'won' || status === 'lost') return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r][c];
      if (!cell.revealed) cell.flagged = !cell.flagged;
      onBoardChange?.(next);
      return next;
    });
  }, [status, onBoardChange]);

  // Check win condition after each change
  useEffect(() => {
    if (!generated) return;
    const hidden = countHiddenNonMines(board);
    if (hidden === 0 && status !== 'lost') {
      setStatus('won');
      onWin?.();
    }
  }, [board, generated, status, onWin]);

  // Keyboard navigation across cells
  const onFocusRequest = (r, c) => setFocusPos([r, c]);

  const handleKeyDown = (e) => {
    if (!focusPos) return;
    const [r, c] = focusPos;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    switch (e.key) {
      case 'ArrowUp':
        setFocusPos([Math.max(0, r - 1), c]);
        break;
      case 'ArrowDown':
        setFocusPos([Math.min(height - 1, r + 1), c]);
        break;
      case 'ArrowLeft':
        setFocusPos([r, Math.max(0, c - 1)]);
        break;
      case 'ArrowRight':
        setFocusPos([r, Math.min(width - 1, c + 1)]);
        break;
      default:
        break;
    }
  };

  // Auto scroll to keep focused cell visible inside horizontal scroll container
  useEffect(() => {
    if (!containerRef.current || !focusPos) return;
    const [r, c] = focusPos;
    const x = c * cellSize;
    const y = r * cellSize;
    const padding = 8;
    const el = containerRef.current;
    if (x < el.scrollLeft) el.scrollLeft = Math.max(0, x - padding);
    if (x + cellSize > el.scrollLeft + el.clientWidth) el.scrollLeft = x + cellSize - el.clientWidth + padding;
    if (y < el.scrollTop) el.scrollTop = Math.max(0, y - padding);
    if (y + cellSize > el.scrollTop + el.clientHeight) el.scrollTop = y + cellSize - el.clientHeight + padding;
  }, [focusPos, cellSize]);

  const boardWidthPx = width * cellSize;
  const cellRefs = useRef(new Map());

  useEffect(() => {
    if (!focusPos) return;
    const key = `${focusPos[0]}-${focusPos[1]}`;
    const el = cellRefs.current.get(key);
    if (el) el.focus();
  }, [focusPos]);

  return (
    <Box>
      {status === 'won' && (
        <Alert severity="success" sx={{ mb: 1 }}>You Win!</Alert>
      )}
      {status === 'lost' && (
        <Alert severity="error" sx={{ mb: 1 }}>Boom! Better luck next time.</Alert>
      )}
      <Box
        ref={containerRef}
        role="application"
        aria-label="Minesweeper board"
        onKeyDown={handleKeyDown}
        sx={{
          overflowX: 'auto',
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 1,
          p: 0.5,
          maxWidth: '100%', // enables horizontal scroll on narrow screens
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: boardWidthPx,
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
            gap: 0,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <Cell
                key={`${r}-${c}`}
                cell={cell}
                row={r}
                col={c}
                size={cellSize}
                onReveal={handleReveal}
                onToggleFlag={handleToggleFlag}
                isFocused={focusPos && focusPos[0] === r && focusPos[1] === c}
                onFocusRequest={onFocusRequest}
                innerRef={(el) => {
                  const k = `${r}-${c}`;
                  if (el) cellRefs.current.set(k, el);
                  else cellRefs.current.delete(k);
                }}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Board;
