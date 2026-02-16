# 🚀 GitHub Setup & Deployment Guide

Complete step-by-step guide to deploy your Professional Tiling Estimator to GitHub and Vercel.

---

## 📋 Prerequisites

✅ Git installed on your computer
✅ GitHub account created
✅ Node.js 18+ installed
✅ Vercel account (free tier works fine)

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Fill in details:
   - **Repository name:** `tiling-estimator` (or your preferred name)
   - **Description:** Professional tiling calculator and business management tool
   - **Visibility:** Public or Private (your choice)
   - ❌ **DON'T** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

### Step 2: Upload Your Code

**Option A: Using Git Command Line**

```bash
# Navigate to your project folder
cd tiling-estimator

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Professional Tiling Estimator v1.0.0"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/tiling-estimator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Desktop**

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. Click **"Add" → "Add Existing Repository"**
4. Select your `tiling-estimator` folder
5. Click **"Publish repository"**
6. Choose public/private and click **"Publish"**

**Option C: Upload via GitHub Website**

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop ALL files from `tiling-estimator` folder
3. Add commit message: "Initial commit"
4. Click **"Commit changes"**

### Step 3: Deploy to Vercel (One-Click!)

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. After signing in, click **"Add New Project"**
4. Find your `tiling-estimator` repository and click **"Import"**
5. Vercel auto-detects everything! Click **"Deploy"**
6. Wait ~1 minute for deployment
7. **Done!** 🎉 Your site is live at: `your-project.vercel.app`

---

## 🔧 Optional: Custom Domain

If you want a custom domain like `tilingcalculator.com`:

1. In Vercel dashboard, go to your project
2. Click **"Settings" → "Domains"**
3. Add your domain and follow DNS instructions
4. Wait 5-10 minutes for DNS propagation
5. Your site is now at your custom domain!

---

## ⚙️ Environment Setup (Optional)

If you want to use GitHub Actions for automatic deployments:

### 1. Get Vercel Tokens

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your tokens (save these!)
vercel --prod
```

### 2. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **"Settings" → "Secrets and variables" → "Actions"**
3. Click **"New repository secret"**
4. Add these three secrets:

**Secret 1:**
- Name: `VERCEL_TOKEN`
- Value: [Get from Vercel Account Settings → Tokens]

**Secret 2:**
- Name: `VERCEL_ORG_ID`
- Value: [Found in `.vercel/project.json` after running `vercel link`]

**Secret 3:**
- Name: `VERCEL_PROJECT_ID`
- Value: [Found in `.vercel/project.json` after running `vercel link`]

### 3. Enable GitHub Actions

The workflows are already in `.github/workflows/`:
- `ci.yml` - Runs on every push (builds and tests)
- `deploy.yml` - Auto-deploys to Vercel on push to main

Once secrets are added, GitHub Actions will automatically:
✅ Build your project on every push
✅ Deploy to Vercel when you push to `main` branch
✅ Create preview deployments for pull requests

---

## 📝 Updating Your Site

### Via Git Command Line

```bash
# Make your changes to files

# Add changed files
git add .

# Commit changes
git commit -m "Describe your changes here"

# Push to GitHub
git push origin main
```

Vercel will automatically detect the push and redeploy! ✨

### Via GitHub Website

1. Navigate to file you want to edit
2. Click **✏️ pencil icon** to edit
3. Make changes
4. Click **"Commit changes"**
5. Vercel auto-deploys! ✨

---

## 🎨 Customizing for Your Business

### 1. Update Repository Info

Edit `package.json`:
```json
{
  "name": "your-business-tiling-estimator",
  "description": "Your Business Name - Professional Tiling Calculator",
  "author": "Your Name",
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/tiling-estimator.git"
  }
}
```

Edit `README.md`:
- Replace all instances of `yourusername` with your GitHub username
- Add your contact details
- Customize descriptions

### 2. Update Metadata

Edit `index.html`:
```html
<title>Your Business Name - Tiling Estimator</title>
<meta name="description" content="Your custom description">
```

### 3. Add Your Branding

The app already supports:
- Custom company logo upload
- Business details configuration
- Multiple color themes
- All configurable in Professional Mode settings!

---

## 🔒 Security Best Practices

### Protect Your API Keys

❌ **NEVER commit these to GitHub:**
- FreeAgent API tokens
- Personal access tokens
- API keys
- Passwords

✅ **Good:** Tokens stored in browser localStorage (current setup)
✅ **Better:** Use environment variables for sensitive data

### Enable Branch Protection

1. Go to **"Settings" → "Branches"**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass
4. Click **"Save changes"**

---

## 📊 Analytics (Optional)

### Add Google Analytics

1. Get your Google Analytics ID
2. Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Vercel Analytics

Vercel provides free analytics:
1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Enable Vercel Analytics
4. Get visitor stats, page views, performance metrics!

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** Build fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node version matches (18+)

### Files Not Updating

**Problem:** Changes pushed but site not updating

**Solution:**
1. Check Vercel deployment logs
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Wait 1-2 minutes for deployment

### GitHub Actions Not Running

**Problem:** Workflows not executing

**Solution:**
1. Go to **"Actions"** tab in GitHub
2. Check if workflows are enabled
3. Verify secrets are added correctly
4. Check workflow syntax in `.github/workflows/`

---

## 📦 What's Included

Your repository includes:

### Source Code
```
src/
├── App.jsx (3,900+ lines of React code)
├── main.jsx (Entry point)
└── index.css (Global styles)
```

### Configuration
```
├── package.json (Dependencies)
├── vite.config.js (Build config)
├── tailwind.config.js (Styling)
├── postcss.config.js (CSS processing)
├── vercel.json (Deployment config)
└── .gitignore (Excluded files)
```

### Documentation
```
├── README.md (Main documentation)
├── QUICK-START.md (Getting started)
├── GITHUB-DEPLOYMENT.md (This guide)
├── FREEAGENT-SETUP.md (Accounting integration)
├── LOCAL-SERVICES.md (Search features)
├── CONTRIBUTING.md (Contribution guidelines)
├── CHANGELOG.md (Version history)
├── CODE-QUALITY-REPORT.md (Code analysis)
├── UI-REORGANIZATION.md (UI improvements)
└── LAYOUT-ORDER.md (Layout documentation)
```

### GitHub Templates
```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── pull_request_template.md
└── workflows/
    ├── ci.yml (Continuous Integration)
    └── deploy.yml (Auto-deployment)
```

---

## 🎯 Next Steps

After deployment, you can:

1. ✅ Share your live URL with clients
2. ✅ Add custom domain for professional branding
3. ✅ Configure FreeAgent integration
4. ✅ Set up business profile in Settings
5. ✅ Start creating quotes!

---

## 💡 Pro Tips

### Workflow Tips

1. **Use Branches:** Create feature branches for new features
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   # Create Pull Request on GitHub
   ```

2. **Semantic Commits:** Use clear commit messages
   - `feat: Add new calculator feature`
   - `fix: Repair wall selection bug`
   - `docs: Update README`
   - `style: Improve button styling`

3. **Version Tags:** Tag releases
   ```bash
   git tag -a v1.0.0 -m "Initial release"
   git push origin v1.0.0
   ```

### Performance Tips

1. **Monitor Vercel Analytics** for slow pages
2. **Check Lighthouse scores** in Chrome DevTools
3. **Optimize images** before uploading
4. **Keep dependencies updated** regularly

### Backup Tips

1. **Export settings** regularly from app
2. **Star your repository** on GitHub (don't lose it!)
3. **Download releases** for local backup
4. **Document customizations** in CHANGELOG.md

---

## 📞 Support

### Resources

- **Vite Docs:** https://vitejs.dev/
- **React Docs:** https://react.dev/
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Docs:** https://docs.github.com/

### Get Help

1. **Check Issues:** Search existing issues on GitHub
2. **Create Issue:** Use issue templates for bugs/features
3. **Discussions:** Ask questions in GitHub Discussions
4. **Vercel Support:** Contact via Vercel dashboard

---

## 🎉 You're Done!

Your Professional Tiling Estimator is now:
✅ Hosted on GitHub
✅ Deployed on Vercel
✅ Automatically updating when you push changes
✅ Ready for professional use!

**Live URL:** `https://your-project.vercel.app`

**Happy tiling!** 🚀

---

## 📝 Quick Reference

### Common Git Commands
```bash
git status                  # Check what changed
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push origin main        # Push to GitHub
git pull origin main        # Pull latest changes
git log                     # View commit history
```

### Common NPM Commands
```bash
npm install                 # Install dependencies
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build
```

### Vercel CLI Commands
```bash
vercel                     # Deploy to preview
vercel --prod             # Deploy to production
vercel logs               # View deployment logs
vercel ls                 # List deployments
```

---

**Made with ❤️ for professional tilers**
