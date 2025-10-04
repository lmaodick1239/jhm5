// Represents a single cell in the Minesweeper grid
import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const COLORS = {
  1: '#42a5f5',
  2: '#66bb6a',
  3: '#ef5350',
  4: '#ab47bc',
  5: '#ff7043',
  6: '#26c6da',
  7: '#bdbdbd',
  8: '#90a4ae',
};

function Cell({
  cell,
  row,
  col,
  size = 32,
  onReveal,
  onToggleFlag,
  isFocused,
  onFocusRequest,
  innerRef,
}) {
  const { revealed, flagged, mine, adjacent, exploded, wrongFlag } = cell;

  const ariaLabel = useMemo(() => {
    if (revealed) {
      if (mine) return `Mine at ${row + 1}, ${col + 1}`;
      return adjacent > 0
        ? `${adjacent} near ${row + 1}, ${col + 1}`
        : `Empty at ${row + 1}, ${col + 1}`;
    }
    return flagged ? `Flagged cell at ${row + 1}, ${col + 1}` : `Hidden cell at ${row + 1}, ${col + 1}`;
  }, [revealed, flagged, mine, adjacent, row, col]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    onToggleFlag(row, col);
  };

  const handleClick = () => {
    onReveal(row, col);
  };

  const content = () => {
    if (!revealed) return flagged ? '🚩' : '';
    if (wrongFlag) return 'X';
    if (mine) return exploded ? '💥' : '💣';
    return adjacent > 0 ? adjacent : '';
  };

  const bg = () => {
    if (revealed && mine && exploded) return 'rgba(239,83,80,0.3)';
    if (revealed) return 'rgba(255,255,255,0.06)';
    return 'rgba(255,255,255,0.03)';
  };

  const border = wrongFlag ? '2px solid #ef5350' : '1px solid rgba(255,255,255,0.1)';

  return (
    <Tooltip title={ariaLabel} disableInteractive>
      <Box
        role="button"
        aria-label={ariaLabel}
        aria-pressed={revealed ? true : undefined}
        aria-disabled={revealed}
        tabIndex={0}
        ref={innerRef}
        onFocus={() => onFocusRequest(row, col)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onReveal(row, col);
          } else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            onToggleFlag(row, col);
          }
        }}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        sx={{
          userSelect: 'none',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 16,
          color: wrongFlag ? '#ef5350' : revealed && !mine && adjacent ? COLORS[adjacent] : '#e0e0e0',
          backgroundColor: bg(),
          border,
          outline: isFocused ? '2px solid #90caf9' : 'none',
          outlineOffset: -1,
          cursor: revealed ? 'default' : 'pointer',
        }}
      >
        {content()}
      </Box>
    </Tooltip>
  );
}

export default Cell;
