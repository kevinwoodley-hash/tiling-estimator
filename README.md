# Tiling Estimator - Multi-Room Calculator

A professional tiling calculator that allows you to calculate tile requirements for multiple rooms with multiple areas per room. Perfect for tilers, contractors, and homeowners planning tiling projects.

## Features

### Core Calculator Features
- **Multi-Room Support**: Add unlimited rooms to your project
- **Multiple Areas Per Room**: Break down complex spaces into separate areas (main floor, alcoves, window recesses, etc.)
- **Surface Type Selection**: Choose between Floor or Wall for each room
- **Floor-Specific Materials**: Cement board, Ditra mat, floor tanking
- **Wall-Specific Materials**: Wall tanking, tile trim, wall primer
- **Flexible Tile Sizes**: Pre-configured common sizes plus custom tile dimensions
- **Wastage Calculation**: Adjustable wastage percentage (5-20%)
- **Real-Time Calculations**: Instant updates for area, tiles needed, and total quantities
- **Mobile Responsive**: Works perfectly on all devices

### Professional Mode Features
- **Customer Management**: Store customer name, phone, email, and address
- **Material Calculations**: Automatic calculation of adhesive, grout, primer, and sealer requirements
- **Cost Breakdown**: Complete pricing with tiles, labour, and materials
- **Markup Management**: Adjustable profit margin percentage
- **WhatsApp Export**: Share quotes directly via WhatsApp
- **File Export**: Download detailed estimates as text files
- **Professional Summary**: Grand totals across all rooms and materials

### Professional Design
- Clean, modern interface with gradient styling
- Toggle between simple and professional modes
- Comprehensive cost breakdown with line items
- Material quantities based on industry standards

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

1. **Update vite.config.js with your repository name:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // e.g., '/tiling-estimator/'
   })
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to Pages section
   - Select `gh-pages` branch
   - Save

Your site will be live at: `https://yourusername.github.io/your-repo-name/`

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

### Basic Mode

1. **Add Rooms**: Click "+ Add Room" to create a new room
2. **Name Your Room**: Click on the room name to edit it
3. **Select Surface Type**: Choose "Floor" or "Wall" for the room
4. **Select Material Options**: 
   - **For Floors**: Cement board, Ditra mat, floor tanking
   - **For Walls**: Wall tanking, tile trim, wall primer
5. **Configure Tile Settings**: Select tile size and wastage percentage
6. **Add Areas**: Click "+ Add Area" within a room to add separate areas
7. **Input Dimensions**: Enter length and width in meters for each area
8. **View Results**: See real-time calculations for:
   - Net area per room
   - Total area including wastage
   - Number of tiles needed
   - Surface-specific materials
   - Grand totals across all rooms

### Professional Mode

Click "Show Professional Mode" to access advanced features:

1. **Customer Information**
   - Enter customer name, phone, email, and address
   - Information automatically included in exports

2. **Materials Required**
   - View automatic calculations for standard materials:
     - Adhesive (3.5 kg/m²)
     - Grout (0.5 kg/m²)
     - Primer (0.15 L/m²)
     - Sealer (0.1 L/m²)
   - View surface-specific materials when selected:
     - **Floor**: Cement board, Ditra mat, floor tanking
     - **Wall**: Wall tanking, tile trim, wall primer

3. **Complete Wall Calculation** (for walls)
   - Switch to "Complete Walls" mode
   - Enter room length and width
   - Set ceiling height (default 2.4m)
   - System calculates: 2 × Height × (Length + Width)
   - Perfect for tiling entire room walls

4. **Pricing & Costs**
   - Enter prices for tiles, labour, and all materials
   - Surface-specific material pricing appears automatically when selected
   - Set your markup percentage
   - View complete cost breakdown with subtotal and total

4. **Export Options**
   - **WhatsApp**: Share formatted quote via WhatsApp
   - **Download**: Save detailed estimate as text file
   - Both exports include all room details, materials, and costs

## Calculations

### Area & Tile Calculations
- **Net Area**: Sum of all area dimensions (length × width)
- **Wall Area (Complete Walls Mode)**: 2 × Height × (Length + Width)
- **Wastage Calculation**: Net area × (1 + wastage%)
- **Tiles Required**: Rounded up (Total area with wastage ÷ single tile area)

### Material Requirements (Industry Standard Rates)
**Standard Materials (All Surfaces):**
- **Adhesive**: 3.5 kg per m²
- **Grout**: 0.5 kg per m²
- **Primer**: 0.15 L per m²
- **Sealer**: 0.1 L per m²

**Floor-Specific Materials:**
- **Cement Board**: 1 board per m² (600x1200mm boards)
- **Ditra Mat**: 1.1 m² per m² (includes 10% wastage)
- **Floor Tanking**: 0.5 L per m²

**Wall-Specific Materials:**
- **Wall Tanking**: 0.4 L per m²
- **Tile Trim**: 4 linear meters per m² (approximate)
- **Wall Primer**: 0.2 L per m²

### Cost Calculations
- **Line Items**: Tiles, Labour, Adhesive, Grout, Primer, Sealer
- **Subtotal**: Sum of all line items
- **Markup**: Subtotal × (markup % / 100)
- **Total**: Subtotal + Markup

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tech Stack

- **React 18** - UI framework
- **Vite 4** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

## License

This project is created for professional tiling estimation use.

## Support

For issues or feature requests, please create an issue in the repository.

---

Built with ❤️ for professional tilers and contractors
