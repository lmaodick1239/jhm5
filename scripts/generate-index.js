#!/usr/bin/env node

/**
 * Portfolio Index Generator
 * 
 * This script automatically generates the main index.html file by:
 * 1. Reading all project directories in the /src folder
 * 2. Extracting project metadata from README.md files
 * 3. Building Vite-based projects (if needed)
 * 4. Copying built/static files to /public directory
 * 5. Creating a project card for each project
 * 6. Injecting the cards into the index.html template
 * 
 * Usage: node scripts/generate-index.js
 * Or via npm: npm run generate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INDEX_TEMPLATE = path.join(__dirname, '..', 'index.html');
const PLACEHOLDER = '<!-- PROJECT_CARDS_PLACEHOLDER -->';

// Project metadata mapping
const PROJECT_METADATA = {
    'dma': {
        name: 'DSE Score Calculator',
        icon: '🎓',
        description: 'Calculate HKDSE scores with percentile rankings',
        hasVite: true
    },
    'msp': {
        name: 'MSP Project',
        icon: '⚛️',
        description: 'React + Vite application',
        hasVite: true
    },
    'tdl': {
        name: 'Todo List',
        icon: '✅',
        description: 'React-based todo list application',
        hasVite: true
    },
    'tod': {
        name: 'Vanilla Todo',
        icon: '📝',
        description: 'Framework-free todo app with Cloudflare KV',
        hasVite: false
    },
    'ttc': {
        name: 'TTC Project',
        icon: '🎯',
        description: 'TypeScript + Vite application',
        hasVite: true
    },
    'ttv': {
        name: 'TTV Project',
        icon: '📺',
        description: 'Vanilla JavaScript application',
        hasVite: false
    },
    'ttx': {
        name: 'TTX Project',
        icon: '⚡',
        description: 'TypeScript + Cloudflare Workers',
        hasVite: true
    }
};

/**
 * Get all directories in the src folder
 * Filters out files and hidden directories
 */
function getProjectDirectories() {
    try {
        if (!fs.existsSync(SRC_DIR)) {
            console.log('⚠️  Source directory does not exist!');
            return [];
        }

        const items = fs.readdirSync(SRC_DIR);
        
        const directories = items.filter(item => {
            const fullPath = path.join(SRC_DIR, item);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            const isNotHidden = !item.startsWith('.');
            const isNotNodeModules = item !== 'node_modules';
            return isDirectory && isNotHidden && isNotNodeModules;
        });

        console.log(`📁 Found ${directories.length} project(s): ${directories.join(', ')}`);
        return directories;
    } catch (error) {
        console.error('❌ Error reading source directory:', error.message);
        return [];
    }
}

/**
 * Check if project has a build script in package.json
 */
function hasBuildScript(projectDir) {
    const packageJsonPath = path.join(SRC_DIR, projectDir, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return packageJson.scripts && packageJson.scripts.build;
    } catch (error) {
        console.log(`⚠️  Could not read package.json for ${projectDir}`);
        return false;
    }
}

/**
 * Extract project metadata from README.md
 */
function extractProjectMetadata(projectDir) {
    const readmePath = path.join(SRC_DIR, projectDir, 'README.md');
    const metadata = PROJECT_METADATA[projectDir] || {
        name: formatProjectName(projectDir),
        icon: getProjectIcon(projectDir),
        description: 'Web application project',
        hasVite: false
    };

    // Check if project has a build script
    metadata.hasVite = hasBuildScript(projectDir);

    // Try to extract title from README if it exists
    if (fs.existsSync(readmePath)) {
        try {
            const readmeContent = fs.readFileSync(readmePath, 'utf8');
            const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
            if (titleMatch) {
                metadata.name = titleMatch[1].replace(/[#*_`]/g, '').trim();
            }
            
            // Extract first paragraph as description
            const lines = readmeContent.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#') && !line.startsWith('```') && line.length > 20) {
                    metadata.description = line.replace(/[*_`]/g, '').substring(0, 100);
                    break;
                }
            }
        } catch (error) {
            console.log(`⚠️  Could not read README for ${projectDir}`);
        }
    }

    return metadata;
}

/**
 * Build a Vite project
 */
function buildViteProject(projectDir) {
    const projectPath = path.join(SRC_DIR, projectDir);
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        console.log(`⚠️  No package.json found for ${projectDir}, skipping build`);
        return false;
    }

    try {
        console.log(`🔨 Building ${projectDir}...`);
        
        // Check if node_modules exists, if not install dependencies
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            console.log(`📦 Installing dependencies for ${projectDir}...`);
            execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
        }
        
        // Run build command
        execSync('npm run build', { cwd: projectPath, stdio: 'inherit' });
        console.log(`✅ Built ${projectDir}`);
        return true;
    } catch (error) {
        console.error(`❌ Error building ${projectDir}:`, error.message);
        return false;
    }
}

/**
 * Copy project files to public directory
 */
function copyProjectToPublic(projectDir, metadata) {
    const srcPath = path.join(SRC_DIR, projectDir);
    const destPath = path.join(PUBLIC_DIR, projectDir);

    try {
        // Clean destination directory if it exists
        if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true, force: true });
        }
        
        // Create destination directory
        fs.mkdirSync(destPath, { recursive: true });

        // Determine source directory based on project type
        if (metadata.hasVite) {
            // For Vite projects, copy ONLY from dist folder
            const distPath = path.join(srcPath, 'dist');
            if (fs.existsSync(distPath)) {
                copyRecursive(distPath, destPath, projectDir);
                console.log(`✅ Copied ${projectDir}/dist to /public/${projectDir}`);
            } else {
                console.error(`❌ No dist folder found for ${projectDir} - build may have failed`);
                return false;
            }
        } else {
            // For non-build projects, copy selective files from root
            copyStaticProject(srcPath, destPath, projectDir);
            console.log(`✅ Copied ${projectDir} static files to /public/${projectDir}`);
        }

        return true;
    } catch (error) {
        console.error(`❌ Error copying ${projectDir}:`, error.message);
        return false;
    }
}

/**
 * Copy static project files (non-build projects)
 */
function copyStaticProject(src, dest, projectName) {
    const includeFiles = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];
    const excludeDirs = ['node_modules', '.git', '.vscode', '.wrangler', 'worker'];
    const excludeFiles = ['.gitignore', 'package.json', 'package-lock.json', 'wrangler.jsonc', 'README.md', 
                          'vite.config.js', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 
                          'tsconfig.node.json', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.js'];

    if (!fs.existsSync(src)) return;

    const items = fs.readdirSync(src);
    
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const itemStats = fs.statSync(srcPath);

        if (itemStats.isDirectory()) {
            if (!excludeDirs.includes(item)) {
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath, { recursive: true });
                }
                copyStaticProject(srcPath, destPath, projectName);
            }
        } else if (itemStats.isFile()) {
            const ext = path.extname(item).toLowerCase();
            const shouldInclude = includeFiles.includes(ext) && !excludeFiles.includes(item);
            
            if (shouldInclude) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    });
}

/**
 * Recursively copy directory contents (for dist folders)
 */
function copyRecursive(src, dest, projectName) {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);
        
        items.forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            copyRecursive(srcPath, destPath, projectName);
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

/**
 * Format project name for display
 * Converts "project-name" to "Project Name"
 */
function formatProjectName(dirName) {
    return dirName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get project icon emoji based on name or use default
 */
function getProjectIcon(projectName) {
    const icons = {
        'todo': '✅',
        'task': '📝',
        'game': '🎮',
        'calculator': '🔢',
        'weather': '🌤️',
        'portfolio': '💼',
        'blog': '📰',
        'shop': '🛒',
        'chat': '💬',
        'dashboard': '📊',
    };

    const lowerName = projectName.toLowerCase();
    
    for (const [key, icon] of Object.entries(icons)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }

    return '🚀'; // Default icon
}

/**
 * Generate HTML card for a project
 */
function generateProjectCard(projectDir, metadata) {
    const projectUrl = `/${projectDir}/`;

    return `
            <a href="${projectUrl}" class="project-card">
                <div class="project-icon">${metadata.icon}</div>
                <h2 class="project-name">${metadata.name}</h2>
                <p class="project-description">${metadata.description}</p>
                <span class="arrow">→</span>
            </a>`;
}

/**
 * Generate the complete projects grid HTML
 */
function generateProjectsGrid(projectsData) {
    if (projectsData.length === 0) {
        return `
            <div class="empty-state">
                <h2>No Projects Yet</h2>
                <p>Add project folders to the <code>/src</code> directory and run this script again.</p>
                <p><strong>Example:</strong></p>
                <ul style="list-style: none; padding: 1rem 0;">
                    <li>📁 /src/my-todo-app/</li>
                    <li>📁 /src/weather-dashboard/</li>
                    <li>📁 /src/game-project/</li>
                </ul>
            </div>`;
    }

    return projectsData.map(({ dir, metadata }) => generateProjectCard(dir, metadata)).join('\n');
}

/**
 * Main function to generate the index.html file
 */
function generateIndex() {
    console.log('\n🔨 Starting portfolio index generation...\n');

    // Create public directory if it doesn't exist
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.log('📁 Creating /public directory...');
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    // Read the template file
    let templateContent;
    try {
        templateContent = fs.readFileSync(INDEX_TEMPLATE, 'utf8');
        console.log('✅ Read index.html template');
    } catch (error) {
        console.error('❌ Error reading index.html template:', error.message);
        process.exit(1);
    }

    // Get project directories from src
    const projectDirs = getProjectDirectories();
    
    if (projectDirs.length === 0) {
        console.log('⚠️  No projects found in /src directory');
        return;
    }

    // Process each project
    const projectsData = [];
    
    for (const projectDir of projectDirs) {
        console.log(`\n📦 Processing ${projectDir}...`);
        
        // Extract metadata (this now dynamically checks for build script)
        const metadata = extractProjectMetadata(projectDir);
        console.log(`   Name: ${metadata.name}`);
        console.log(`   Description: ${metadata.description}`);
        console.log(`   Has build script: ${metadata.hasVite ? 'Yes' : 'No'}`);
        
        // Build if project has a build script
        if (metadata.hasVite) {
            const buildSuccess = buildViteProject(projectDir);
            if (!buildSuccess) {
                console.error(`❌ Skipping ${projectDir} - build failed`);
                continue;
            }
        }
        
        // Copy to public
        const copySuccess = copyProjectToPublic(projectDir, metadata);
        if (!copySuccess) {
            console.error(`❌ Skipping ${projectDir} - copy failed`);
            continue;
        }
        
        projectsData.push({ dir: projectDir, metadata });
    }

    // Generate the projects grid HTML
    const projectsHtml = generateProjectsGrid(projectsData);

    // Replace the placeholder with generated content
    const regex = new RegExp(
        `${PLACEHOLDER}[\\s\\S]*?(?=</div>\\s*<footer)`,
        'g'
    );
    
    const updatedContent = templateContent.replace(regex, `${PLACEHOLDER}\n${projectsHtml}\n        `);

    // Write the updated content back to index.html
    try {
        fs.writeFileSync(INDEX_TEMPLATE, updatedContent, 'utf8');
        console.log('\n✅ Updated index.html with project cards');
    } catch (error) {
        console.error('❌ Error writing index.html:', error.message);
        process.exit(1);
    }

    // Copy index.html to public directory for deployment
    const publicIndex = path.join(PUBLIC_DIR, 'index.html');
    try {
        fs.copyFileSync(INDEX_TEMPLATE, publicIndex);
        console.log('✅ Copied index.html to /public directory');
    } catch (error) {
        console.error('❌ Error copying to public directory:', error.message);
        process.exit(1);
    }

    console.log('\n✨ Portfolio index generation complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Projects processed: ${projectsData.length}`);
    console.log(`   - Files updated: index.html, public/index.html`);
    console.log(`   - Projects in /public: ${projectDirs.join(', ')}`);
    console.log('\n🚀 Next steps:');
    console.log('   1. Preview locally: npx serve public');
    console.log('   2. Deploy to Cloudflare: npm run deploy\n');
}

// Run the generator
if (require.main === module) {
    generateIndex();
}

module.exports = { generateIndex, getProjectDirectories, formatProjectName };
