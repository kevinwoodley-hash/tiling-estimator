# Professional Tiling Estimator

> A comprehensive React application for professional tilers and contractors to calculate materials, generate quotes, and manage tiling projects with FreeAgent integration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.4.2-purple.svg)

## ✨ Features

### 🆓 Free Version (Standard Calculator)
- **Multi-Room Support** - Calculate unlimited rooms and areas
- **Smart Material Calculations** - Automatic adhesive, grout, primer, sealer
- **Trowel Size Selection** - 6mm to 12mm notched trowels for accurate coverage
- **Grout Joint Width** - 1mm to 6mm precision settings
- **Bag Quantities** - Shows adhesive in 20kg bags, grout in 2.5kg bags
- **Surface-Specific** - Floor (cement board, Ditra mat, tanking) and Wall (tanking, trim, primer)
- **Find Local Services** - Search for tile stores and professional tilers nearby (Free version exclusive)
- **4 Beautiful Themes** - Modern Dark, Classic Blue, Minimal Light, Sunset
- **Mobile Responsive** - Works perfectly on all devices

### 💼 Professional Mode
- **Business Branding** - Add company logo, VAT number, full business details
- **Complete Pricing** - Day rate, labour per m², all material costs
- **VAT Support** - Toggle VAT with adjustable rates (default 20%)
- **FreeAgent Integration** - One-click export to accounting software
- **Multiple Export Options** - WhatsApp, file download, FreeAgent API
- **Organized Settings Page** - Tabbed interface (Business Profile, Pricing, Integrations, Preferences)
- **Customer Management** - Store customer details for professional quotes
- **Cost Breakdown** - Detailed pricing with subtotals, markup, VAT, total

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tiling-estimator.git

# Navigate to project directory
cd tiling-estimator

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the app at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deploy

### Vercel (Recommended - One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tiling-estimator)

**Or via CLI:**
```bash
npm install -g vercel
vercel
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/tiling-estimator)

### Other Platforms
1. Run `npm run build`
2. Upload `dist/` folder to your hosting
3. Configure server to serve `index.html` for all routes

## 📖 Documentation

- **[Quick Start Guide](QUICK-START.md)** - Get started in 5 minutes
- **[FreeAgent Setup Guide](FREEAGENT-SETUP.md)** - Complete accounting integration
- **[Local Services Feature](LOCAL-SERVICES.md)** - Find tile stores and tilers

## 🎨 Themes

Four professionally designed themes included:

| Theme | Description | Best For |
|-------|-------------|----------|
| **Modern Dark** | Sleek dark gradients with blue accents | Professional contractors |
| **Classic Blue** | Navy background with gold highlights | Traditional businesses |
| **Minimal Light** | Clean white with subtle shadows | Modern minimalists |
| **Sunset** | Warm orange/purple gradients | Creative professionals |

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 5.4.2 | Build tool & dev server |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Lucide React | Latest | Icon library |
| PostCSS | 8.4.35 | CSS processing |

## 📁 Project Structure

```
tiling-estimator/
├── src/
│   ├── App.jsx              # Main application component (3500+ lines)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles & Tailwind imports
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── QUICK-START.md       # Quick start guide
│   ├── FREEAGENT-SETUP.md   # FreeAgent integration guide
│   └── LOCAL-SERVICES.md    # Local services feature guide
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vercel.json              # Vercel deployment settings
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🎯 Use Cases

### For Professional Tilers
- Calculate materials for jobs
- Generate branded quotes
- Export to accounting software
- Track costs and pricing
- Find local suppliers

### For DIY Enthusiasts
- Calculate exact material quantities
- Avoid over/under-ordering
- Find local tile stores
- Get professional estimates
- Learn tiling requirements

### For Contractors
- Quote multiple rooms
- Apply consistent pricing
- Professional client presentation
- VAT-compliant invoicing
- Business branding

## 🔧 Key Features Explained

### Material Calculations

**Adhesive (Based on Trowel Size):**
- 6mm Notched: 2.5 kg/m² (small tiles up to 300mm)
- 8mm Notched: 3.5 kg/m² (medium tiles 300-450mm)
- 10mm Notched: 4.5 kg/m² (large tiles 450-600mm)
- 12mm Notched: 5.5 kg/m² (extra large tiles 600mm+)

**Grout (Based on Tile Size & Joint Width):**
- Calculated using: (Length + Width) / (Length × Width) × Joint Width × Depth × Density
- Precise formula accounts for tile dimensions and joint spacing
- Results shown in 2.5kg bag quantities

**Other Materials:**
- Primer: 0.15 L/m²
- Sealer: 0.1 L/m²
- Cement Board: 1 board/m² (600×1200mm)
- Ditra Mat: 1.1 m²/m² (10% wastage)
- Floor Tanking: 0.5 L/m²
- Wall Tanking: 0.4 L/m²
- Tile Trim: 4 m/m²
- Wall Primer: 0.2 L/m²

### FreeAgent Integration

Automatically creates invoices/quotes in FreeAgent with:
- All line items (labour, materials, day rate)
- Customer details linked
- VAT calculated and applied
- Payment terms (30 days default)
- Project reference with room count and area

See [FREEAGENT-SETUP.md](FREEAGENT-SETUP.md) for full setup instructions.

### Local Services Search

Find nearby businesses:
- **Tile Stores**: Major chains (Topps Tiles, CTD, Tile Giant) and independent shops
- **Professional Tilers**: Rated contractors with reviews and contact details
- **Search by**: Postcode, city name, or area
- **Results include**: Phone, address, ratings, directions

## 🌍 Browser Support

| Browser | Supported Versions |
|---------|-------------------|
| Chrome | Last 2 versions ✅ |
| Firefox | Last 2 versions ✅ |
| Safari | Last 2 versions ✅ |
| Edge | Last 2 versions ✅ |
| Mobile Safari | iOS 12+ ✅ |
| Chrome Mobile | Android 8+ ✅ |

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Test on multiple browsers
- Update documentation if needed
- Add comments for complex logic
- Keep commits atomic and descriptive

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/yourusername/tiling-estimator/issues) with:

- **Bug description** - Clear and concise
- **Steps to reproduce** - Numbered list
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - Browser, OS, device

## 💡 Feature Requests

Have an idea? [Open an issue](https://github.com/yourusername/tiling-estimator/issues) with:

- **Feature description** - What you want
- **Use case** - Why it's useful
- **Implementation ideas** - How it might work
- **Alternatives considered** - Other approaches

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  
❌ Liability  
❌ Warranty  

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourwebsite.com](https://yourwebsite.com)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **React**: [React](https://react.dev/)
- **Inspiration**: Professional tilers and contractors worldwide

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/tiling-estimator?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/tiling-estimator?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/tiling-estimator?style=social)

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Cloud sync for settings across devices
- [ ] Quote history and database
- [ ] Customer database with project history
- [ ] Team collaboration features
- [ ] Quote templates library
- [ ] Email quote sending
- [ ] PDF export with custom branding

### Version 3.0 (Future)
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support
- [ ] Advanced reporting and analytics
- [ ] Integration with more accounting platforms
- [ ] AI-powered material recommendations
- [ ] 3D room visualization

## 📞 Support

Need help? Reach out:

- 📧 **Email**: support@example.com
- 💬 **Discord**: [Join our community](https://discord.gg/example)
- 🐦 **Twitter**: [@tilingestimator](https://twitter.com/example)
- 📚 **Docs**: [Full documentation](https://docs.example.com)

## ⭐ Show Your Support

If this project helped you, please consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs
- 💡 **Suggesting** features
- 🤝 **Contributing** code
- 📢 **Sharing** with others

## 📈 Project Stats

- **Total Lines of Code**: ~3,500+
- **Components**: 1 main component with multiple sections
- **Themes**: 4 professional themes
- **Material Types**: 12+ different materials
- **Export Formats**: 3 (WhatsApp, File, FreeAgent)
- **Documentation**: 4 comprehensive guides

---

<div align="center">

**Made with ❤️ for the tiling industry**

[Report Bug](https://github.com/yourusername/tiling-estimator/issues) · [Request Feature](https://github.com/yourusername/tiling-estimator/issues) · [Documentation](docs/)

</div>
