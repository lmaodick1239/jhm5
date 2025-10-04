# 🚀 Project Portfolio - Cloudflare Pages

A beautiful, automatically-generated portfolio index page that displays all your projects from the `/src` directory. This portfolio automatically builds Vite-based projects, extracts metadata from README files, and creates a clean, responsive landing page for Cloudflare Pages deployment.

## 📋 Project Overview

This portfolio automatically scans your `/src` directory, builds each project (if needed), extracts metadata from README files, and creates a professional landing page with cards for each project.

### Features

✨ **Automatic Project Discovery** - Scans `/src` directory and processes all projects  
🏗️ **Smart Build System** - Automatically detects and builds Vite-based projects  
📖 **Metadata Extraction** - Pulls project names and descriptions from README.md files  
🎨 **Modern, Responsive Design** - Beautiful gradient design that works on all devices  
⚡ **Zero Manual Configuration** - Just add projects to `/src` and run the generate script  
☁️ **Cloudflare Pages Ready** - Optimized for Cloudflare's global CDN  
🔧 **Easy Customization** - Simple HTML/CSS and configurable project metadata

### Your Current Projects

The script will automatically detect and process these projects:

- **dma** - DSE Score Calculator 🎓
- **msp** - MSP Project ⚛️
- **tdl** - Todo List ✅
- **tod** - Vanilla Todo 📝
- **ttc** - TTC Project 🎯
- **ttv** - TTV Project 📺
- **ttx** - TTX Project ⚡

## 📁 Project Structure

```
/jhm5
├── src/                       # Your source projects (NOT deployed directly)
│   ├── dma/                  # DSE Score Calculator (Vite + React)
│   ├── msp/                  # MSP Project (Vite + React)
│   ├── tdl/                  # Todo List (Vite + React)
│   ├── tod/                  # Vanilla Todo (Static + Cloudflare Workers)
│   ├── ttc/                  # TTC Project (Vite + TypeScript)
│   ├── ttv/                  # TTV Project (Vanilla JS)
│   └── ttx/                  # TTX Project (Vite + TypeScript + Workers)
├── public/                    # Generated deployment folder
│   ├── dma/                  # Built version of dma
│   ├── msp/                  # Built version of msp
│   ├── ...                   # (all other projects)
│   └── index.html            # Generated portfolio landing page
├── scripts/
│   └── generate-index.js     # Automatic build & index generation script
├── index.html                # Template for the landing page
├── package.json              # NPM configuration and scripts
└── wrangler.jsonc            # Cloudflare Pages configuration
```

## 🛠️ Setup Instructions

Follow these steps to set up and deploy your portfolio:

### Step 1: Install Dependencies

The root package.json manages the portfolio generation. Install its dependencies:

```bash
npm install
```

### Step 2: Ensure Your Projects Have Dependencies Installed

Each project in `/src` may need its own dependencies. The generate script will auto-install them during the build process, but you can also install them manually:

```bash
# For each Vite-based project (dma, msp, tdl, ttc, ttx)
cd src/dma
npm install
cd ../..

# Repeat for other projects as needed
```

### Step 3: Generate the Portfolio

This single command will:
1. Build all Vite-based projects (creates `dist` folders)
2. Extract metadata from README files
3. Copy built files to `/public`
4. Generate the portfolio index page

```bash
npm run generate
```

**What happens during generation:**
- **Vite Projects** (dma, msp, tdl, ttc, ttx): Runs `npm run build`, copies `/dist` contents to `/public/[project]`
- **Static Projects** (tod, ttv): Copies files directly to `/public/[project]`
- **Metadata**: Extracts project names/descriptions from README.md files
- **Index**: Creates portfolio landing page at `/public/index.html`

### Step 4: Preview Locally

Preview your portfolio before deploying:

```bash
npm run preview
```

This will generate everything and start a local server (usually at `http://localhost:3000`). Open it in your browser to see your portfolio.

Or just preview without rebuilding:

```bash
npm run dev
```

### Step 5: Login to Cloudflare

Authenticate with Cloudflare (first-time setup only):

```bash
npx wrangler login
```

This will open a browser window to authorize Wrangler with your Cloudflare account.

### Step 6: Deploy to Cloudflare Pages

Deploy your entire portfolio:

```bash
npm run deploy
```

Or manually:

```bash
npx wrangler pages deploy public
```

The first time you deploy, Wrangler will ask you to:
1. Choose a project name (e.g., "my-portfolio")
2. Confirm the production branch

After deployment, you'll receive a URL like: `https://my-portfolio.pages.dev`

### Step 7: (Optional) Configure Custom Domain

In the Cloudflare dashboard:

1. Go to **Workers & Pages**
2. Select your project
3. Go to **Custom domains**
4. Add your custom domain

## 📝 Available NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `generate` | `npm run generate` | Builds all projects and generates the portfolio index |
| `generate:no-build` | `npm run generate:no-build` | Generates index without rebuilding projects |
| `preview` | `npm run preview` | Generates and previews the site locally |
| `deploy` | `npm run deploy` | Generates and deploys to Cloudflare Pages |
| `dev` | `npm run dev` | Starts a local development server |
| `clean` | `npm run clean` | Removes /public and all /dist folders |

## 🎨 Customization Guide

### Updating Project Metadata

Edit the `PROJECT_METADATA` object in `scripts/generate-index.js`:

```javascript
const PROJECT_METADATA = {
    'dma': {
        name: 'DSE Score Calculator',
        icon: '🎓',
        description: 'Calculate HKDSE scores with percentile rankings',
        hasVite: true
    },
    // Add your own projects here
    'my-project': {
        name: 'My Awesome Project',
        icon: '🚀',
        description: 'A brief description of what it does',
        hasVite: true  // Set to false for static projects
    }
};
```

### Changing Colors

Edit the gradient in `index.html`:

```css
/* Current gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Try other gradients */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### Changing Icons

Icons are automatically assigned based on project names in `generate-index.js`. To customize:

```javascript
const icons = {
    'todo': '✅',
    'task': '📝',
    'game': '🎮',
    'your-project': '🎯',  // Add your custom mappings
};
```

### Modifying Card Layout

Change grid columns in `index.html`:

```css
/* Current: auto-fill with 300px min */
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

/* Fixed 3 columns */
grid-template-columns: repeat(3, 1fr);

/* Fixed 2 columns */
grid-template-columns: repeat(2, 1fr);
```

### Adding Project Descriptions

To add custom descriptions, modify `generate-index.js`:

```javascript
const projectDescriptions = {
    'project-one': 'A todo list app built with React',
    'project-two': 'Weather dashboard using OpenWeather API'
};
```

## 🔍 How It Works

### The Generation Process

1. **Scanning**: Script reads all directories in `/src`
2. **Metadata Extraction**: Reads README.md files for project info
3. **Building**: Runs `npm run build` for Vite-based projects
4. **Copying**: Copies built files (from `/dist`) or static files to `/public/[project]`
5. **Card Creation**: Generates HTML for each project with name, icon, and description
6. **Template Update**: Injects cards into the `index.html` template
7. **Deployment Copy**: Copies the updated `index.html` to `/public`

### Project Type Detection

The script automatically detects project types:

- **Vite Projects** (`hasVite: true`): Builds with `npm run build`, copies from `dist/`
- **Static Projects** (`hasVite: false`): Copies files directly (excluding dev files)

### The Deployment

When you run `npm run deploy`:

1. The script generates the portfolio index
2. All projects are built and copied to `/public`
3. Wrangler uploads the entire `/public` directory to Cloudflare
4. Cloudflare serves it from their global CDN
5. Your site is live at `https://your-project.pages.dev`

## 📦 Adding New Projects

To add a new project to your portfolio:

1. Create a new folder in `/src`:

   ```bash
   mkdir src/new-project
   ```

2. Add your project files (must include `index.html`):

   ```bash
   # Add your project files to src/new-project/
   ```

3. Add metadata to `scripts/generate-index.js`:

   ```javascript
   const PROJECT_METADATA = {
       // ... existing projects
       'new-project': {
           name: 'New Project',
           icon: '🎨',
           description: 'Description of new project',
           hasVite: true  // or false for static projects
       }
   };
   ```

4. Regenerate the portfolio:

   ```bash
   npm run generate
   ```

5. Deploy the update:

   ```bash
   npm run deploy
   ```

## 🐛 Troubleshooting

### "No projects found" message

- Make sure your project folders are in `/src` directory
- Each project folder should contain an `index.html` file (or generate one via Vite build)
- Run `npm run generate` to regenerate the index

### Build fails for a specific project

- Check that the project has a valid `package.json`
- Ensure `node_modules` are installed: `cd src/[project] && npm install`
- Try building the project individually: `cd src/[project] && npm run build`
- Check for build errors in the project's own configuration

### Module loading error (assets fail to load)

**Error:** "Module failed to load" or 404 errors for `/assets/index-*.js`

**Solution:** This happens when Vite uses absolute paths instead of relative paths. 

For each Vite project, ensure `vite.config.js` or `vite.config.ts` has `base: './'`:

```javascript
export default defineConfig({
  base: './', // Required for subdirectory deployment
  plugins: [react()],
  // ... other config
})
```

All projects in `/src` have been pre-configured with this fix.

### Deployment fails

- Ensure you're logged in: `npx wrangler login`
- Check that `wrangler.jsonc` points to the correct directory (`./public`)
- Verify your Cloudflare account has Pages enabled
- Try deploying manually: `npx wrangler pages deploy public`

### Local preview doesn't work

- Install serve globally: `npm install -g serve`
- Or use: `npx serve public` directly
- Make sure port 3000 is not already in use

### Changes not appearing after deployment

- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few minutes for Cloudflare's CDN to update
- Check that you ran `npm run generate` before deploying
- Verify files were copied to `/public` correctly

### Project shows "404 Not Found"

- Make sure the project has an `index.html` in `/public/[project]/`
- For Vite projects, ensure the build succeeded and created a `dist` folder
- Check that files were copied correctly from `/src/[project]/dist/` to `/public/[project]/`

## 🚀 Production Checklist

Before deploying to production:

- [ ] All projects in `/src` have necessary dependencies installed
- [ ] Run `npm run generate` to build and generate the portfolio
- [ ] Test locally with `npm run preview`
- [ ] Check that all project links work correctly
- [ ] Verify responsive design on mobile devices
- [ ] Update portfolio title and branding in `index.html` if needed
- [ ] Customize project metadata in `scripts/generate-index.js`
- [ ] Run `npm run deploy` to push to Cloudflare
- [ ] Test the live site at your Cloudflare Pages URL
- [ ] Verify all projects load correctly on the deployed site
- [ ] (Optional) Configure custom domain in Cloudflare dashboard

## 📚 Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/get-started/)

## ✅ TODO Checklist

Use this checklist to track your setup progress:

### Initial Setup

- [ ] Run `npm install` in root directory
- [ ] Verify all projects in `/src` have dependencies installed
- [ ] Review and customize `PROJECT_METADATA` in `scripts/generate-index.js`
- [ ] Customize colors/branding in `index.html` template

### Generate & Test

- [ ] Run `npm run generate` to build all projects and create portfolio index
- [ ] Review generated files in `/public` directory
- [ ] Run `npm run preview` to test locally
- [ ] Open browser and verify all project links work
- [ ] Test responsive design on different screen sizes

### Cloudflare Setup

- [ ] Create Cloudflare account (if needed)
- [ ] Run `npx wrangler login` to authenticate
- [ ] Update project name in `wrangler.jsonc` (optional)
- [ ] Review deployment settings

### Deployment

- [ ] Run `npm run deploy` for first deployment
- [ ] Choose/confirm project name when prompted
- [ ] Note your deployed URL (e.g., `my-portfolio.pages.dev`)
- [ ] Visit deployed site and test all links
- [ ] Verify all projects load correctly

### Optional Enhancements

- [ ] Configure custom domain in Cloudflare dashboard
- [ ] Add more detailed descriptions to project metadata
- [ ] Create README.md files for individual projects
- [ ] Set up automatic deployments via Git integration
- [ ] Add analytics or monitoring

### Maintenance

- [ ] Document process for adding new projects
- [ ] Set up version control (Git) if not already done
- [ ] Create backup of project structure
- [ ] Plan regular updates and maintenance schedule

## 📄 License

MIT License - Feel free to use this for your own portfolio!

## 🤝 Contributing

Feel free to customize this portfolio template for your needs. Share improvements with the community!

---

## Happy Coding! 🎉

Built with ❤️ for Cloudflare Pages
