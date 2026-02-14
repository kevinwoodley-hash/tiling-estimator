# GitHub Deployment Guide

This guide will help you deploy the Professional Tiling Estimator to GitHub and optionally to GitHub Pages.

## 📦 Prerequisites

- Git installed on your computer
- GitHub account
- Node.js 18+ installed

## 🚀 Initial Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Fill in repository details:
   - **Name**: `tiling-estimator` (or your preferred name)
   - **Description**: "Professional tiling calculator and business management tool"
   - **Public** or **Private** (your choice)
   - **Don't** initialize with README (we already have one)
4. Click **"Create repository"**

### 2. Prepare Your Local Repository

```bash
# Navigate to project directory
cd tiling-estimator

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Professional Tiling Estimator v1.0.0"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/tiling-estimator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Update Repository Information

Edit `package.json` and replace:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/tiling-estimator.git"
}
```

Also update in `README-GITHUB.md`:
- Replace all instances of `yourusername` with your GitHub username

## 🌐 Deploy to GitHub Pages

### Option 1: Using gh-pages Package (Recommended)

Already configured! Just run:

```bash
# Install dependencies (if not already done)
npm install

# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build the production version
2. Create a `gh-pages` branch
3. Deploy to `https://YOUR_USERNAME.github.io/tiling-estimator/`

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# The built files are in the `dist` folder
# You can manually deploy these to any hosting service
```

### Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** → **"Pages"**
3. Under **"Source"**, select **"gh-pages"** branch
4. Click **"Save"**
5. Your site will be live at `https://YOUR_USERNAME.github.io/tiling-estimator/`

## 🔧 Vite Configuration for GitHub Pages

If deploying to GitHub Pages, update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tiling-estimator/', // Add your repo name here
})
```

## 📝 Repository Setup

### Add Topics (Tags)

On GitHub repository page:
1. Click **"About"** settings (gear icon)
2. Add topics:
   - `tiling`
   - `calculator`
   - `construction`
   - `react`
   - `vite`
   - `contractor-tools`
   - `business-management`
   - `tile-estimator`

### Enable Issues

1. Go to **"Settings"** → **"General"**
2. Under **"Features"**, check **"Issues"**

### Enable Discussions (Optional)

1. Go to **"Settings"** → **"General"**
2. Under **"Features"**, check **"Discussions"**

### Add Description and Website

1. Click **"About"** settings (gear icon)
2. Add **Description**: "Professional tiling calculator and business management tool"
3. Add **Website**: Your deployment URL
4. Add **Topics** (see above)

## 🏷️ Create Your First Release

### Create a Release Tag

```bash
# Create and push version tag
git tag -a v1.0.0 -m "Initial release v1.0.0"
git push origin v1.0.0
```

### Create Release on GitHub

1. Go to **"Releases"** → **"Create a new release"**
2. **Choose tag**: v1.0.0
3. **Release title**: "v1.0.0 - Initial Release"
4. **Description**: Copy from CHANGELOG.md
5. Check **"Set as the latest release"**
6. Click **"Publish release"**

## 📄 Important Files

### README.md
The main README should be comprehensive. Use `README-GITHUB.md` as your primary README:

```bash
# Replace existing README with GitHub version
mv README.md README-ORIGINAL.md
mv README-GITHUB.md README.md
git add README.md
git commit -m "docs: Update README for GitHub"
git push
```

### CONTRIBUTING.md
Guidelines for contributors (already included)

### LICENSE
MIT License (already included)

### CHANGELOG.md
Version history (already included)

### CODE_OF_CONDUCT.md
Create if needed for open-source projects

## 🔐 Security

### Protect Main Branch

1. Go to **"Settings"** → **"Branches"**
2. Click **"Add rule"**
3. **Branch name pattern**: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
5. Click **"Create"**

### .gitignore
Already configured to exclude:
- `node_modules/`
- `dist/`
- `.env` files
- IDE files

## 🚢 Deployment Checklist

- [ ] Update `package.json` with your details
- [ ] Update `README.md` with your username
- [ ] Update `vite.config.js` base path
- [ ] Test build locally (`npm run build`)
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Deploy to GitHub Pages
- [ ] Test deployed site
- [ ] Create release tag
- [ ] Publish release on GitHub
- [ ] Add repository description
- [ ] Add topics/tags
- [ ] Enable Issues
- [ ] Set up branch protection

## 🔄 Continuous Updates

### Making Changes

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Creating New Releases

```bash
# Update version in package.json
# Update CHANGELOG.md

# Commit version bump
git add .
git commit -m "chore: Bump version to 1.1.0"

# Create tag
git tag -a v1.1.0 -m "Release v1.1.0"

# Push changes and tag
git push origin main
git push origin v1.1.0

# Create release on GitHub
```

## 📊 GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🆘 Troubleshooting

### Build Fails on GitHub Pages

1. Check `vite.config.js` has correct `base` path
2. Ensure all dependencies are in `package.json`
3. Check Node version compatibility

### 404 Errors on Deployed Site

1. Verify `base` path in `vite.config.js`
2. Check GitHub Pages is enabled
3. Ensure `gh-pages` branch exists
4. Wait a few minutes for deployment

### Git Push Rejected

```bash
# If remote has changes you don't have locally
git pull origin main --rebase
git push origin main
```

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)
- [Semantic Versioning](https://semver.org/)

## ✅ Post-Deployment

After successful deployment:

1. **Test the live site** thoroughly
2. **Share the URL** with users
3. **Monitor issues** on GitHub
4. **Respond to feedback** via Issues/Discussions
5. **Plan updates** based on user needs

---

**Congratulations!** 🎉 Your Professional Tiling Estimator is now on GitHub!
