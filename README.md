# Tiling Estimator - Multi-Room Calculator

A professional tiling calculator that allows you to calculate tile requirements for multiple rooms with multiple areas per room. Perfect for tilers, contractors, and homeowners planning tiling projects.

## Features

- **Multi-Room Support**: Add unlimited rooms to your project
- **Multiple Areas Per Room**: Break down complex spaces into separate areas (main floor, alcoves, window recesses, etc.)
- **Flexible Tile Sizes**: Pre-configured common sizes plus custom tile dimensions
- **Wastage Calculation**: Adjustable wastage percentage (5-20%)
- **Real-Time Calculations**: Instant updates for area, tiles needed, and total quantities
- **Professional Design**: Clean, modern interface with gradient styling
- **Mobile Responsive**: Works perfectly on all devices

## Area Types Supported

- Main Floor
- Alcove
- Window Recess
- Bay Window
- Fireplace Hearth
- Shower Area
- Bath Surround
- Splashback
- Feature Wall
- Custom Area (with custom naming)

## Tile Sizes Included

- 300 × 300mm
- 300 × 600mm
- 450 × 450mm
- 500 × 500mm
- 600 × 600mm
- 600 × 1200mm
- 800 × 800mm
- Custom sizes (specify width and height in mm)

## Getting Started

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment

### Deploy to Vercel (Recommended)

#### Method 1: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **For production deployment:**
   ```bash
   vercel --prod
   ```

#### Method 2: Using Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

**Build Settings (Auto-detected):**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```

3. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // Add this line
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to Pages section
   - Select `gh-pages` branch
   - Save

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

## Project Structure

```
tiling-estimator/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## How to Use

1. **Add Rooms**: Click "+ Add Room" to create a new room
2. **Name Your Room**: Click on the room name to edit it
3. **Configure Tile Settings**: Select tile size and wastage percentage
4. **Add Areas**: Click "+ Add Area" within a room to add separate areas
5. **Input Dimensions**: Enter length and width in meters for each area
6. **View Results**: See real-time calculations for:
   - Net area per room
   - Total area including wastage
   - Number of tiles needed
   - Grand totals across all rooms

## Calculations

- **Net Area**: Sum of all area dimensions (length × width)
- **Wastage Calculation**: Net area × (1 + wastage%)
- **Tiles Required**: Rounded up (Total area with wastage ÷ single tile area)

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **Vanilla CSS** - Inline styles with gradients

## License

This project is created for professional tiling estimation use.

## Support

For issues or feature requests, please create an issue in the repository.

---

Built with ❤️ for professional tilers and contractors
