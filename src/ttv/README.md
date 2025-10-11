# Standalone Tic Tac Toe (ttv)

This folder contains a single-file (per asset type) version of the React Tic Tac Toe game originally in `ttc/src`.

## Files
- `index.html` – HTML shell that loads React & ReactDOM from CDN and mounts the app.
- `styles.css` – Consolidated styles from `index.css` and `App.css`.
- `app.js` – Entire application logic (converted from TypeScript/TSX to plain JavaScript using only React UMD globals).

## How to Run
Just open `index.html` in a modern browser (double-click or serve via a simple static server). No build step required.

## Differences from Original
- TypeScript types removed.
- All components combined into one file; no module imports.
- Uses global `React` / `ReactDOM` UMD builds (development versions). For production you can swap to the `.production.min.js` CDN URLs.
- No Vite dev features (HMR, JSX transform). JSX replaced with `React.createElement` calls.

## Optional: Using Production React
Replace the two script tags in `index.html` with:
```
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

## Next Ideas
- Inline and minify CSS/JS for a single-file deliverable.
- Add a reset button instead of relying on alert flow.
- Provide accessibility enhancements (role="button" and ARIA live region for status).
