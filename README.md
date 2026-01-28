# Tiling Estimator App

A professional tiling estimation and quoting application built for contractors. Calculate materials, labor costs, and generate professional quotes with ease.

![Tiling Estimator](https://img.shields.io/badge/React-18+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Customer Management
- Save and load customer details
- Customer database for repeat clients
- Auto-find address using GPS location
- Export customer list

### Smart Calculations
- **Multi-room support** - Add unlimited rooms with custom names
- **Accurate adhesive calculation** - Based on trowel size (3mm, 6mm, 10mm, 12mm)
- **Precise grout calculation** - Simple mode (5m² per bag) or advanced tile-size based formula
- **Adjustable waste percentage** - Default 20%, customizable 10-30%
- **Automatic 20% waste** - Built into all material calculations

### Material Options
**Floor Tiling:**
- Cement Board (0.76m² per board)
- Anti-Crack Membrane (per m²)

**Wall Tiling:**
- Tanking Membrane (4m² per tub)

**Additional Materials:**
- Tile Trim (2.5m lengths)

### Labour Costing
- **Per m² rate** or **Day rate** pricing
- **Preparation work** - Separate hourly rate for prep (remove old tiles, leveling, etc.)
- **Room-specific extra work** - Add notes and costs per room

### Professional Quoting
- Clean, professional quote format
- Send via WhatsApp or Email
- Download as text file
- Save/load quotes for later editing
- Profit margin calculator (hidden from customer)
- Show/hide waste percentage in quotes

### Pricing Management
- Save material prices for reuse
- Customizable profit margins
- Price fields for all materials:
  - Adhesive (20kg bags)
  - Grout (2.5kg bags)
  - Cement Board
  - Anti-Crack Membrane
  - Tanking Membrane
  - Tile Trim

## 📋 Material Coverage Rates

| Trowel Size | Coverage per 20kg Bag |
|-------------|----------------------|
| 3mm (Wall tiles) | 8.0 m² |
| 6mm (Small floor) | 5.5 m² |
| 10mm (Medium tiles) | 3.3 m² |
| 12mm (Large tiles) | 3.3 m² |

**Grout Coverage:**
- Simple mode: 5m² per 2.5kg bag
- Advanced mode: Calculated based on tile dimensions using industry formula

## 🛠️ Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/tiling-estimator.git
cd tiling-estimator
```

2. **Install dependencies**
```bash
npm install
```

3. **Install required packages**
```bash
npm install lucide-react
npm install -D tailwindcss
npx tailwindcss init
```

4. **Configure Tailwind CSS**

Create/update `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. **Start the development server**
```bash
npm start
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 📱 Usage Guide

### Creating a Quote

1. **Add Customer Details**
   - Enter name, phone, email, address
   - Use "Find" button to auto-detect address via GPS
   - Click "Save" to add to customer database

2. **Add Rooms**
   - Click "Add Room" for each area
   - Enter dimensions (length × width)
   - Select floor or wall
   - Choose trowel size
   - Add preparation materials if needed
   - Optional: Calculate grout by tile size
   - Optional: Add tile trim
   - Optional: Add room notes and extra work costs

3. **Set Labour Costs**
   - Choose per m² or day rate
   - Add preparation work if needed (hourly rate)

4. **Review Summary**
   - Check materials needed
   - Verify total cost
   - Adjust waste percentage if needed (in Pricing tab)

5. **Generate Quote**
   - Go to Quote tab
   - Review full breakdown
   - Send via WhatsApp or Email
   - Or download as text file

### Saving & Loading

- **Save Quote**: Click "Save" button (quotes stored in browser)
- **Load Quote**: Click "Quotes" button, select quote to edit
- **Save Customer**: Click "Save Customer" to add to database
- **Load Customer**: Click "Customers" button, select customer

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`:
- Quotes persist between sessions
- Customer database saved locally
- Material prices saved automatically
- No data sent to external servers

**Note:** Clearing browser data will delete saved quotes and customers. Export important quotes before clearing browser cache.

## 🎨 Customization

### Default Values

Edit these in the component state to change defaults:
```javascript
// Labour rates
m2Rate: '50'      // £50 per m²
dayRate: '250'    // £250 per day
prepRate: '30'    // £30 per hour

// Material prices
adhesivePrice: '15'
groutPrice: '8'
cementBoardPrice: '12'
// ... etc

// Waste percentage
wastePercentage: '20'  // 20% default

// Profit margin
profitMargin: '20'     // 20% markup
```

### Styling

The app uses Tailwind CSS. Customize colors and styles by editing the JSX classes or extending `tailwind.config.js`.

## 🔧 Advanced Features

### Grout Calculation Formula

When "Calculate Grout by Tile Size" is enabled, the app uses:
```
Step 1: A = Tile Width + Tile Height
Step 2: B = Grout Width × Tile Thickness
Step 3: C = A × B × 1.2
Step 4: D = Tile Width × Tile Height
Step 5: E = C ÷ D (kg per m²)
Step 6: Total = E × Area
```

### Waste Calculation

All materials include adjustable waste percentage:
- Adhesive: bags × (1 + waste%)
- Grout: bags × (1 + waste%)
- Cement Board: boards × (1 + waste%)
- Trim: No waste (sold in fixed lengths)

## 📊 Quote Breakdown

Quotes include:
- Customer details
- Room-by-room breakdown
- Material quantities with prices
- Labour costs (tiling + prep + extra work)
- Total cost
- Room notes with associated costs
- Waste percentage disclosure

## 🚧 Roadmap

Potential future enhancements:
- [ ] PDF export
- [ ] VAT toggle
- [ ] Multiple tile prices
- [ ] Payment terms tracking
- [ ] Job status (Pending/Approved/Complete)
- [ ] Company branding (logo, terms & conditions)
- [ ] Cloud sync across devices
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Icons by Lucide React
- Developed for professional tiling contractors

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your.email@example.com

## 🔒 Privacy

This app stores all data locally in your browser. No information is sent to external servers. Your quotes and customer data remain private on your device.

---

**Made with ❤️ for tiling professionals**
