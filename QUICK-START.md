# 🚀 Quick Deployment Guide - Tiling Estimator

## Fastest Way to Get Live (Vercel - Recommended for Chromebook)

### Option 1: Deploy via Vercel Website (Easiest)

1. **Push to GitHub:**
   - Create a new repository on GitHub
   - Upload all files from the `tiling-estimator` folder
   - Commit and push

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your repository
   - Click "Deploy" (Vercel auto-detects everything!)
   - Your site will be live in ~1 minute at: `your-project.vercel.app`

**That's it! No configuration needed.**

### Option 2: Deploy to GitHub Pages (Also Easy)

1. **Update `vite.config.js`** - change base to your repo name:
   ```javascript
   base: '/your-repo-name/',
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** in repo settings → Pages → select `gh-pages` branch

Your site will be at: `https://yourusername.github.io/your-repo-name/`

---

## Local Testing (Optional)

If you want to test locally first:

```bash
# Navigate to the folder
cd tiling-estimator

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:5173
```

---

## File Structure Check

Make sure you have all these files:

```
tiling-estimator/
├── src/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
└── README.md
```

---

## Troubleshooting

### Build fails?
- Make sure all files are in the correct locations
- Check that `package.json` exists in the root folder
- Vercel should auto-install dependencies

### Changes not showing?
- Vercel automatically redeploys when you push to GitHub
- Or click "Redeploy" in the Vercel dashboard

---

## Custom Domain (Optional)

Once deployed on Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS instructions

---

## What This App Does

### Basic Features
✅ Multiple rooms with editable names
✅ Multiple areas per room (alcoves, recesses, etc.)
✅ Preset and custom tile sizes
✅ Adjustable wastage (5-20%)
✅ Real-time tile calculations
✅ Professional design
✅ Mobile responsive
✅ Grand totals summary

### Professional Mode Features
✅ Customer information management
✅ Automatic material calculations (adhesive, grout, primer, sealer)
✅ Complete cost breakdown with pricing
✅ Adjustable markup percentage
✅ WhatsApp quote sharing
✅ Download detailed estimates
✅ Industry-standard material rates

---

**Questions?** Check the full README.md for detailed instructions.
