# Changelog

All notable changes to the Professional Tiling Estimator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-14

### Added - Initial Release

#### Free Version Features
- **Multi-Room Calculator**
  - Unlimited rooms with custom names
  - Multiple areas per room (alcoves, window recesses, etc.)
  - Wall mode calculator (2-wall system)
  - Real-time calculations

- **Advanced Material Calculations**
  - Trowel size selection (6mm, 8mm, 10mm, 12mm notched)
  - Grout joint width selection (1mm-6mm)
  - Industry-standard adhesive coverage rates
  - Precise grout formula based on tile dimensions
  - Bag quantity display (20kg adhesive, 2.5kg grout)

- **Surface-Specific Options**
  - Floor materials: Cement board, Ditra mat, Floor tanking
  - Wall materials: Wall tanking, Tile trim, Wall primer
  - Automatic material switching based on surface type

- **Local Services Search**
  - Find tile stores near you
  - Find professional tilers in your area
  - Location-based search (city or postcode)
  - Contact details and directions

- **Theme System**
  - Modern Dark theme
  - Classic Blue theme
  - Minimal Light theme
  - Sunset theme
  - Live theme switching

- **User Interface**
  - Grand summary bar (rooms, areas, m², tiles)
  - Clean card-based layout
  - Mobile responsive design
  - Glass morphism effects
  - Smooth animations

#### Professional Mode Features

- **Business Profile**
  - Company logo upload (base64)
  - Business details (name, phone, email, website)
  - Business address
  - VAT number
  - Registration number

- **Pricing & Costs**
  - Day rate configuration
  - Labour price per m²
  - Material pricing (adhesive, grout, primer, sealer)
  - Surface-specific material pricing
  - Markup percentage
  - VAT toggle with adjustable rate
  - Live VAT calculation preview

- **FreeAgent Integration**
  - Personal Access Token setup
  - Connection status indicator
  - One-click quote export to FreeAgent
  - Automatic invoice creation
  - Line item breakdown
  - VAT support
  - Last sync tracking

- **Customer Management**
  - Customer name
  - Phone number
  - Email address
  - Full address
  - Always visible (top of page)

- **Settings Page** (Tabbed Interface)
  - **Business Profile Tab**
    - Business branding configuration
    - Logo and company details
  - **Pricing & Costs Tab**
    - All pricing in one place
    - VAT configuration
    - Markup settings
  - **Integrations Tab**
    - FreeAgent setup
    - API configuration
  - **Preferences Tab**
    - Default room settings (wastage, trowel, grout joint, surface)
    - Display options (logo on exports, bag quantities, etc.)
    - Data management (export/import backup, reset)

- **Materials Summary**
  - Complete material breakdown
  - Standard materials (adhesive, grout, primer, sealer)
  - Floor materials (conditional)
  - Wall materials (conditional)
  - Bag quantities highlighted

- **Cost Breakdown**
  - Day rate
  - Labour costs (with m² quantity)
  - Material costs (itemized)
  - Surface-specific materials
  - Subtotal
  - Markup amount
  - VAT (if enabled)
  - Final total

- **Export Options**
  - **WhatsApp Export**: Formatted quote with business branding
  - **File Download**: Text file with complete estimate
  - **FreeAgent Export**: Direct accounting software integration
  - All exports include business branding and VAT

#### Technical Features

- **Page Navigation**
  - Calculator page (main workspace)
  - Settings page (professional configuration)
  - Smooth page transitions
  - Active tab highlighting

- **State Management**
  - Centralized state for rooms, pricing, customer
  - Persistent business settings
  - Real-time calculations
  - Efficient re-renders

- **Calculations**
  - Industry-standard material rates
  - Wastage multiplication
  - Trowel coverage-based adhesive
  - Grout formula: `(W+H)/(W×H) × JointWidth × Depth × Density`
  - Bag rounding (always up)

- **Responsive Design**
  - Mobile-first approach
  - Tablet optimization
  - Desktop layouts
  - Touch-friendly controls

### Technical Stack
- React 18.3.1
- Vite 5.4.10
- Tailwind CSS 3.4.17
- Lucide React 0.469.0
- PostCSS 8.4.49

### Documentation
- README.md with feature overview
- QUICK-START.md for new users
- FREEAGENT-SETUP.md for accounting integration
- LOCAL-SERVICES.md for search features
- CONTRIBUTING.md for developers
- LICENSE (MIT)

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## [Unreleased]

### Planned Features
- Cloud sync for settings
- Quote history
- PDF generation
- Multi-currency support
- Material price database
- Customer portal
- Team collaboration
- Project photo gallery
- Time tracking
- Quote templates

---

## Version History

- **1.0.0** (2025-02-14) - Initial release
  - Free version with material calculator
  - Professional mode with business tools
  - FreeAgent integration
  - Local services search
  - Settings page with 4 tabs

---

## Migration Guide

### From No Version (Initial Install)
This is the first release - no migration needed.

### Future Updates
Migration guides will be provided for breaking changes.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tiling-estimator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tiling-estimator/discussions)
- **Documentation**: Check the `/docs` folder

---

**Note**: This is version 1.0.0 - the initial release of the Professional Tiling Estimator.
