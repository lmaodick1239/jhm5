# DSE Score Calculator 🎓

A modern web application to calculate your Hong Kong Diploma of Secondary Education (HKDSE) score and compare it with 2024 statistics.

## Features ✨

- **Best 5 Score Calculation**: Automatically calculates your best 5 subjects
- **Advanced Percentile Ranking**: See exactly where you stand among Hong Kong students
  - Compare against 18,027 day school candidates or 18,850 all candidates who achieved (332A)22+
  - Toggle between day school and all candidates comparison
  - See exact number of students you performed better than
  - View your score range and how many students share it
  - Get personalized performance messages with visual indicators
- **Accurate Statistical Placement**: Based on official 2024 HKDSE table3f data
  - Know your exact percentile (e.g., "94th percentile - Top 6%")
  - See how many students scored above and below you
  - Understand your score range context
- **Visual Analytics**: Interactive charts and graphs showing your performance
- **University Requirements Check**: Verify if you meet common JUPAS requirements (3322+2, 332A, 222A)
- **Subject Comparison**: Detailed breakdown of each subject's performance
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Technology Stack 🛠️

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: HeroUI (Modern React UI components)
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Charts**: Recharts
- **Data Parsing**: PapaParse (CSV processing)
- **Deployment**: Cloudflare Pages

## Getting Started 🚀

### Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, yarn, or bun

### Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
bun install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
pnpm build
# or
bun build
```

The build output will be in the `dist/` directory.

## Deployment to Cloudflare Pages 🌐

### Option 1: Using Wrangler CLI

1. Install Wrangler globally:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
npm run deploy
```

### Option 2: Using Cloudflare Dashboard

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Connect your Git repository (GitHub/GitLab)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. Click "Save and Deploy"

### Option 3: Direct Upload

1. Build the project:
```bash
npm run build
```

2. In Cloudflare Pages Dashboard, create a new project with "Direct Upload"
3. Upload the contents of the `dist/` folder

## Local Deployment with Cloudflare Tunnel 🔒

If you want to expose your local development server to the internet via Cloudflare:

1. Install `cloudflared`:
   - Windows: Download from [Cloudflare's website](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
   - Or use: `winget install --id Cloudflare.cloudflared`

2. Run your dev server:
```bash
npm run dev
```

3. In another terminal, start the tunnel:
```bash
cloudflared tunnel --url http://localhost:5173
```

4. Cloudflare will provide you with a public URL (e.g., `https://random-name.trycloudflare.com`)

### For Production Tunnel (Named Tunnel)

1. Authenticate:
```bash
cloudflared tunnel login
```

2. Create a tunnel:
```bash
cloudflared tunnel create dse-calculator
```

3. Create a config file at `~/.cloudflared/config.yml`:
```yaml
tunnel: <tunnel-id>
credentials-file: /path/to/<tunnel-id>.json

ingress:
  - hostname: dse.yourdomain.com
    service: http://localhost:5173
  - service: http_status:404
```

4. Route your domain:
```bash
cloudflared tunnel route dns dse-calculator dse.yourdomain.com
```

5. Run the tunnel:
```bash
cloudflared tunnel run dse-calculator
```

## Project Structure 📁

```
dma/
├── data/                          # CSV data files (2024 HKDSE statistics)
├── src/
│   ├── components/                # React components
│   │   ├── SubjectInput.tsx      # Input form for DSE results
│   │   └── ResultsDashboard.tsx  # Results display and analytics
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   └── calculator.ts         # Score calculation logic
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Data Sources 📊

This application uses official 2024 HKDSE results statistics from the Hong Kong Examinations and Assessment Authority (HKEAA), including:

- General achievement statistics (Table 3a-3m)
- Subject-specific grade distributions
- Best 5 subjects score distributions
- Chinese-English attainment correlations
- Mathematics Compulsory and Extended Part analysis

## Features Roadmap 🗺️

- [x] Best 5 score calculation
- [x] Percentile ranking with accurate 2024 HKDSE data
- [x] Day school vs all candidates comparison toggle
- [x] Detailed statistical placement (students above/below, score ranges)
- [x] Performance messages and visual indicators
- [x] Visual charts and graphs
- [x] Subject breakdown table
- [x] University requirements checker (3322+2, 332A, 222A)
- [ ] Subject-by-subject percentile comparison
- [ ] Gender-based comparison
- [ ] Historical year comparisons (2023, 2022, etc.)
- [ ] PDF report export
- [ ] Save/share results feature

## License 📄

MIT License - feel free to use this project for your own purposes.

## Contributing 🤝

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Note**: This calculator uses 2024 HKDSE statistics for comparison. Results are estimates and should not be considered official.
