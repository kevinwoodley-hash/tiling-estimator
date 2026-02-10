import { useState } from "react";
import { Download, Share2, Calculator, Package, DollarSign, User, Mail, Phone, MapPin } from "lucide-react";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Material consumption rates per m²
const MATERIAL_RATES = {
  adhesive: 3.5, // kg per m²
  grout: 0.5, // kg per m²
  primer: 0.15, // L per m²
  sealer: 0.1, // L per m²
};

const AREA_TYPES = [
  "Main Floor",
  "Alcove",
  "Window Recess",
  "Bay Window",
  "Fireplace Hearth",
  "Shower Area",
  "Bath Surround",
  "Splashback",
  "Feature Wall",
  "Custom Area",
];

const TILE_SIZES = [
  { label: "300 × 300mm", w: 0.3, h: 0.3 },
  { label: "300 × 600mm", w: 0.3, h: 0.6 },
  { label: "450 × 450mm", w: 0.45, h: 0.45 },
  { label: "500 × 500mm", w: 0.5, h: 0.5 },
  { label: "600 × 600mm", w: 0.6, h: 0.6 },
  { label: "600 × 1200mm", w: 0.6, h: 1.2 },
  { label: "800 × 800mm", w: 0.8, h: 0.8 },
  { label: "Custom", w: 0, h: 0 },
];

const WASTAGE_OPTIONS = [5, 10, 15, 20];

const defaultArea = () => ({
  id: generateId(),
  type: "Main Floor",
  customName: "",
  length: "",
  width: "",
  shape: "rectangle",
});

const defaultRoom = () => ({
  id: generateId(),
  name: "Room 1",
  areas: [defaultArea()],
  tileSize: 5,
  customTileW: "",
  customTileH: "",
  wastage: 10,
});

function AreaCard({ area, index, onUpdate, onRemove, canRemove }) {
  const areaName = area.type === "Custom Area" ? area.customName || "Custom Area" : area.type;
  const sqm = area.length && area.width ? (parseFloat(area.length) * parseFloat(area.width)).toFixed(2) : "0.00";

  return (
    <div style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "16px",
      position: "relative",
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#000",
            fontWeight: 700,
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "6px",
            fontFamily: "'DM Mono', monospace",
          }}>
            {String.fromCharCode(65 + index)}
          </span>
          <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {areaName}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove(area.id)}
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              borderRadius: "6px",
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✕ Remove
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={labelStyle}>Area Type</label>
          <select
            value={area.type}
            onChange={(e) => onUpdate(area.id, "type", e.target.value)}
            style={selectStyle}
          >
            {AREA_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {area.type === "Custom Area" && (
          <div>
            <label style={labelStyle}>Custom Name</label>
            <input
              type="text"
              placeholder="e.g. Pantry Nook"
              value={area.customName}
              onChange={(e) => onUpdate(area.id, "customName", e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>Length (m)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={area.length}
              onChange={(e) => onUpdate(area.id, "length", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Width (m)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={area.width}
              onChange={(e) => onUpdate(area.id, "width", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "6px",
          padding: "6px 0 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Area:</span>
          <span style={{
            color: "#f59e0b",
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: "'DM Mono', monospace",
          }}>
            {sqm} m²
          </span>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, roomIndex, onUpdateRoom, onRemoveRoom, canRemoveRoom }) {
  const addArea = () => {
    onUpdateRoom(room.id, {
      ...room,
      areas: [...room.areas, defaultArea()],
    });
  };

  const removeArea = (areaId) => {
    onUpdateRoom(room.id, {
      ...room,
      areas: room.areas.filter((a) => a.id !== areaId),
    });
  };

  const updateArea = (areaId, field, value) => {
    onUpdateRoom(room.id, {
      ...room,
      areas: room.areas.map((a) => (a.id === areaId ? { ...a, [field]: value } : a)),
    });
  };

  const updateField = (field, value) => {
    onUpdateRoom(room.id, { ...room, [field]: value });
  };

  const totalSqm = room.areas.reduce((sum, a) => {
    const l = parseFloat(a.length) || 0;
    const w = parseFloat(a.width) || 0;
    return sum + l * w;
  }, 0);

  const tileInfo = TILE_SIZES[room.tileSize];
  const isCustomTile = tileInfo.label === "Custom";
  const tileW = isCustomTile ? (parseFloat(room.customTileW) || 0) / 1000 : tileInfo.w;
  const tileH = isCustomTile ? (parseFloat(room.customTileH) || 0) / 1000 : tileInfo.h;
  const tileArea = tileW * tileH;
  const wastageMultiplier = 1 + room.wastage / 100;
  const tilesNeeded = tileArea > 0 ? Math.ceil((totalSqm * wastageMultiplier) / tileArea) : 0;
  const totalWithWastage = (totalSqm * wastageMultiplier).toFixed(2);

  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}>
      {/* Room Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "16px",
            color: "#000",
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0,
          }}>
            {roomIndex + 1}
          </div>
          <input
            type="text"
            value={room.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{
              ...inputStyle,
              fontSize: "18px",
              fontWeight: 700,
              background: "transparent",
              border: "1px solid transparent",
              padding: "4px 8px",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onFocus={(e) => { e.target.style.border = "1px solid rgba(245,158,11,0.4)"; }}
            onBlur={(e) => { e.target.style.border = "1px solid transparent"; }}
          />
        </div>
        {canRemoveRoom && (
          <button
            onClick={() => onRemoveRoom(room.id)}
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Remove Room
          </button>
        )}
      </div>

      {/* Tile & Wastage Settings */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isCustomTile ? "1fr 1fr 1fr" : "2fr 1fr",
        gap: "12px",
        marginBottom: "16px",
      }}>
        <div>
          <label style={labelStyle}>Tile Size</label>
          <select
            value={room.tileSize}
            onChange={(e) => updateField("tileSize", parseInt(e.target.value))}
            style={selectStyle}
          >
            {TILE_SIZES.map((ts, i) => (
              <option key={i} value={i}>{ts.label}</option>
            ))}
          </select>
        </div>
        {isCustomTile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label style={labelStyle}>Tile W (mm)</label>
              <input
                type="number"
                min="0"
                placeholder="mm"
                value={room.customTileW}
                onChange={(e) => updateField("customTileW", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tile H (mm)</label>
              <input
                type="number"
                min="0"
                placeholder="mm"
                value={room.customTileH}
                onChange={(e) => updateField("customTileH", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}
        <div>
          <label style={labelStyle}>Wastage %</label>
          <select
            value={room.wastage}
            onChange={(e) => updateField("wastage", parseInt(e.target.value))}
            style={selectStyle}
          >
            {WASTAGE_OPTIONS.map((w) => (
              <option key={w} value={w}>{w}%</option>
            ))}
          </select>
        </div>
      </div>

      {/* Areas */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{
            color: "#94a3b8",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Areas ({room.areas.length})
          </span>
          <button
            onClick={addArea}
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.15))",
              border: "1px solid rgba(245,158,11,0.35)",
              color: "#f59e0b",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            + Add Area
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {room.areas.map((area, i) => (
            <AreaCard
              key={area.id}
              area={area}
              index={i}
              onUpdate={updateArea}
              onRemove={removeArea}
              canRemove={room.areas.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Room Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))",
        border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: "12px",
        padding: "16px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "12px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Net Area</div>
          <div style={{ color: "#e2e8f0", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{totalSqm.toFixed(2)}<span style={{ fontSize: "12px", color: "#94a3b8" }}> m²</span></div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Inc. Wastage</div>
          <div style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{totalWithWastage}<span style={{ fontSize: "12px", color: "#94a3b8" }}> m²</span></div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Tiles Needed</div>
          <div style={{ color: "#22c55e", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{tilesNeeded}</div>
        </div>
      </div>
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "4px",
  fontFamily: "'DM Sans', sans-serif",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "10px 12px",
  color: "#e2e8f0",
  fontSize: "14px",
  fontFamily: "'DM Mono', monospace",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto",
};

export default function App() {
  const [rooms, setRooms] = useState([defaultRoom()]);
  const [showProfessional, setShowProfessional] = useState(false);
  
  // Customer Information
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Pricing
  const [pricing, setPricing] = useState({
    tilePricePerSqm: "",
    labourPricePerSqm: "",
    adhesivePrice: "",
    groutPrice: "",
    primerPrice: "",
    sealerPrice: "",
    markup: 15,
  });

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      { ...defaultRoom(), name: `Room ${prev.length + 1}` },
    ]);
  };

  const removeRoom = (roomId) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const updateRoom = (roomId, updatedRoom) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? updatedRoom : r)));
  };

  // Grand totals
  const grandTotals = rooms.reduce(
    (acc, room) => {
      const roomSqm = room.areas.reduce((s, a) => {
        return s + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
      }, 0);
      const tileInfo = TILE_SIZES[room.tileSize];
      const isCustom = tileInfo.label === "Custom";
      const tileW = isCustom ? (parseFloat(room.customTileW) || 0) / 1000 : tileInfo.w;
      const tileH = isCustom ? (parseFloat(room.customTileH) || 0) / 1000 : tileInfo.h;
      const tileArea = tileW * tileH;
      const wastageMultiplier = 1 + room.wastage / 100;
      const withWastage = roomSqm * wastageMultiplier;
      const tiles = tileArea > 0 ? Math.ceil(withWastage / tileArea) : 0;

      return {
        netArea: acc.netArea + roomSqm,
        totalArea: acc.totalArea + withWastage,
        totalTiles: acc.totalTiles + tiles,
        totalAreas: acc.totalAreas + room.areas.length,
      };
    },
    { netArea: 0, totalArea: 0, totalTiles: 0, totalAreas: 0 }
  );

  // Material calculations
  const materials = {
    adhesive: (grandTotals.totalArea * MATERIAL_RATES.adhesive).toFixed(1),
    grout: (grandTotals.totalArea * MATERIAL_RATES.grout).toFixed(1),
    primer: (grandTotals.totalArea * MATERIAL_RATES.primer).toFixed(1),
    sealer: (grandTotals.totalArea * MATERIAL_RATES.sealer).toFixed(1),
  };

  // Cost calculations
  const costs = {
    tiles: grandTotals.totalArea * (parseFloat(pricing.tilePricePerSqm) || 0),
    labour: grandTotals.totalArea * (parseFloat(pricing.labourPricePerSqm) || 0),
    adhesive: parseFloat(materials.adhesive) * (parseFloat(pricing.adhesivePrice) || 0),
    grout: parseFloat(materials.grout) * (parseFloat(pricing.groutPrice) || 0),
    primer: parseFloat(materials.primer) * (parseFloat(pricing.primerPrice) || 0),
    sealer: parseFloat(materials.sealer) * (parseFloat(pricing.sealerPrice) || 0),
  };

  const subtotal = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  const markupAmount = subtotal * (pricing.markup / 100);
  const total = subtotal + markupAmount;

  // Export to WhatsApp
  const exportToWhatsApp = () => {
    let message = `📋 *TILING ESTIMATE*\n\n`;
    
    if (customer.name) {
      message += `👤 *Customer:* ${customer.name}\n`;
      if (customer.phone) message += `📞 ${customer.phone}\n`;
      if (customer.email) message += `📧 ${customer.email}\n`;
      if (customer.address) message += `📍 ${customer.address}\n`;
      message += `\n`;
    }

    message += `📐 *PROJECT SUMMARY*\n`;
    message += `Rooms: ${rooms.length}\n`;
    message += `Total Areas: ${grandTotals.totalAreas}\n`;
    message += `Net Area: ${grandTotals.netArea.toFixed(2)} m²\n`;
    message += `Total Area (inc. wastage): ${grandTotals.totalArea.toFixed(2)} m²\n`;
    message += `Tiles Required: ${grandTotals.totalTiles}\n\n`;

    message += `📦 *MATERIALS NEEDED*\n`;
    message += `Adhesive: ${materials.adhesive} kg\n`;
    message += `Grout: ${materials.grout} kg\n`;
    message += `Primer: ${materials.primer} L\n`;
    message += `Sealer: ${materials.sealer} L\n`;

    if (subtotal > 0) {
      message += `\n💰 *COST BREAKDOWN*\n`;
      if (costs.tiles > 0) message += `Tiles: £${costs.tiles.toFixed(2)}\n`;
      if (costs.labour > 0) message += `Labour: £${costs.labour.toFixed(2)}\n`;
      if (costs.adhesive > 0) message += `Adhesive: £${costs.adhesive.toFixed(2)}\n`;
      if (costs.grout > 0) message += `Grout: £${costs.grout.toFixed(2)}\n`;
      if (costs.primer > 0) message += `Primer: £${costs.primer.toFixed(2)}\n`;
      if (costs.sealer > 0) message += `Sealer: £${costs.sealer.toFixed(2)}\n`;
      message += `\nSubtotal: £${subtotal.toFixed(2)}\n`;
      message += `Markup (${pricing.markup}%): £${markupAmount.toFixed(2)}\n`;
      message += `*TOTAL: £${total.toFixed(2)}*`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Export to text file
  const exportToFile = () => {
    let content = `TILING ESTIMATE\n${'='.repeat(50)}\n\n`;
    
    if (customer.name) {
      content += `CUSTOMER INFORMATION\n`;
      content += `Name: ${customer.name}\n`;
      if (customer.phone) content += `Phone: ${customer.phone}\n`;
      if (customer.email) content += `Email: ${customer.email}\n`;
      if (customer.address) content += `Address: ${customer.address}\n`;
      content += `\n`;
    }

    content += `PROJECT SUMMARY\n${'-'.repeat(50)}\n`;
    content += `Rooms: ${rooms.length}\n`;
    content += `Total Areas: ${grandTotals.totalAreas}\n`;
    content += `Net Area: ${grandTotals.netArea.toFixed(2)} m²\n`;
    content += `Total Area (inc. wastage): ${grandTotals.totalArea.toFixed(2)} m²\n`;
    content += `Tiles Required: ${grandTotals.totalTiles}\n\n`;

    rooms.forEach((room, idx) => {
      const roomTotal = room.areas.reduce((sum, a) => {
        return sum + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
      }, 0);
      content += `ROOM ${idx + 1}: ${room.name}\n`;
      content += `  Total Area: ${roomTotal.toFixed(2)} m²\n`;
      room.areas.forEach((area, aIdx) => {
        const sqm = (parseFloat(area.length) || 0) * (parseFloat(area.width) || 0);
        const areaName = area.type === "Custom Area" ? area.customName || "Custom Area" : area.type;
        content += `  ${String.fromCharCode(65 + aIdx)}. ${areaName}: ${area.length}m × ${area.width}m = ${sqm.toFixed(2)} m²\n`;
      });
      content += `\n`;
    });

    content += `MATERIALS NEEDED\n${'-'.repeat(50)}\n`;
    content += `Adhesive: ${materials.adhesive} kg\n`;
    content += `Grout: ${materials.grout} kg\n`;
    content += `Primer: ${materials.primer} L\n`;
    content += `Sealer: ${materials.sealer} L\n`;

    if (subtotal > 0) {
      content += `\nCOST BREAKDOWN\n${'-'.repeat(50)}\n`;
      if (costs.tiles > 0) content += `Tiles: £${costs.tiles.toFixed(2)}\n`;
      if (costs.labour > 0) content += `Labour: £${costs.labour.toFixed(2)}\n`;
      if (costs.adhesive > 0) content += `Adhesive: £${costs.adhesive.toFixed(2)}\n`;
      if (costs.grout > 0) content += `Grout: £${costs.grout.toFixed(2)}\n`;
      if (costs.primer > 0) content += `Primer: £${costs.primer.toFixed(2)}\n`;
      if (costs.sealer > 0) content += `Sealer: £${costs.sealer.toFixed(2)}\n`;
      content += `\nSubtotal: £${subtotal.toFixed(2)}\n`;
      content += `Markup (${pricing.markup}%): £${markupAmount.toFixed(2)}\n`;
      content += `TOTAL: £${total.toFixed(2)}\n`;
    }

    content += `\n${'='.repeat(50)}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiling-estimate-${customer.name || 'quote'}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #0c1222 0%, #111827 50%, #0f172a 100%)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px 16px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: "720px", margin: "0 auto 24px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}>
            ◧
          </div>
          <h1 style={{
            color: "#f1f5f9",
            fontSize: "28px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.5px",
          }}>
            Tiling Estimator
          </h1>
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 12px 0" }}>
          Add rooms and multiple areas per room for accurate tile calculations
        </p>
        <button
          onClick={() => setShowProfessional(!showProfessional)}
          style={{
            background: showProfessional 
              ? "linear-gradient(135deg, #f59e0b, #d97706)" 
              : "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: showProfessional ? "#000" : "#f59e0b",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
          }}
        >
          <Calculator size={16} />
          {showProfessional ? "Hide" : "Show"} Professional Mode
        </button>
      </div>

      {/* Professional Mode Sections */}
      {showProfessional && (
        <div style={{ maxWidth: "720px", margin: "0 auto 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Customer Information */}
          <div style={{
            background: "linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <User size={20} color="#f59e0b" />
              <h3 style={{
                color: "#f1f5f9",
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Customer Information
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Customer Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  placeholder="07700 900000"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Address</label>
                <input
                  type="text"
                  placeholder="123 High Street, London"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Materials Summary */}
          <div style={{
            background: "linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Package size={20} color="#f59e0b" />
              <h3 style={{
                color: "#f1f5f9",
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Materials Required
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              <div style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "10px",
                padding: "12px",
              }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Adhesive</div>
                <div style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                  {materials.adhesive}<span style={{ fontSize: "12px", color: "#94a3b8" }}> kg</span>
                </div>
              </div>
              <div style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "10px",
                padding: "12px",
              }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Grout</div>
                <div style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                  {materials.grout}<span style={{ fontSize: "12px", color: "#94a3b8" }}> kg</span>
                </div>
              </div>
              <div style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "10px",
                padding: "12px",
              }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Primer</div>
                <div style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                  {materials.primer}<span style={{ fontSize: "12px", color: "#94a3b8" }}> L</span>
                </div>
              </div>
              <div style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "10px",
                padding: "12px",
              }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Sealer</div>
                <div style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                  {materials.sealer}<span style={{ fontSize: "12px", color: "#94a3b8" }}> L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Costing */}
          <div style={{
            background: "linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <DollarSign size={20} color="#f59e0b" />
              <h3 style={{
                color: "#f1f5f9",
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Pricing & Costs
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Tile Price (£/m²)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  value={pricing.tilePricePerSqm}
                  onChange={(e) => setPricing({ ...pricing, tilePricePerSqm: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Labour (£/m²)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="35.00"
                  value={pricing.labourPricePerSqm}
                  onChange={(e) => setPricing({ ...pricing, labourPricePerSqm: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Adhesive (£/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.50"
                  value={pricing.adhesivePrice}
                  onChange={(e) => setPricing({ ...pricing, adhesivePrice: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Grout (£/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="3.00"
                  value={pricing.groutPrice}
                  onChange={(e) => setPricing({ ...pricing, groutPrice: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Primer (£/L)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="8.00"
                  value={pricing.primerPrice}
                  onChange={(e) => setPricing({ ...pricing, primerPrice: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Sealer (£/L)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.00"
                  value={pricing.sealerPrice}
                  onChange={(e) => setPricing({ ...pricing, sealerPrice: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Markup %</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="15"
                  value={pricing.markup}
                  onChange={(e) => setPricing({ ...pricing, markup: parseFloat(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Cost Summary */}
            {subtotal > 0 && (
              <div style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(22,163,74,0.05))",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "12px",
                padding: "16px",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {costs.tiles > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Tiles</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.tiles.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.labour > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Labour</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.labour.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.adhesive > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Adhesive</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.adhesive.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.grout > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Grout</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.grout.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.primer > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Primer</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.primer.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.sealer > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Sealer</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.sealer.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
                    <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Markup ({pricing.markup}%)</span>
                    <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{markupAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ height: "1px", background: "rgba(34,197,94,0.3)", margin: "4px 0" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#22c55e", fontSize: "16px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>TOTAL</span>
                    <span style={{ color: "#22c55e", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={exportToWhatsApp}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                color: "#000",
                borderRadius: "12px",
                padding: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Share2 size={18} />
              Share via WhatsApp
            </button>
            <button
              onClick={exportToFile}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Download size={18} />
              Download Estimate
            </button>
          </div>
        </div>
      )}

      {/* Grand Summary Bar */}
      <div style={{
        maxWidth: "720px",
        margin: "0 auto 24px",
        background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))",
        border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: "14px",
        padding: "16px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}>
        {[
          { label: "Rooms", value: rooms.length, color: "#e2e8f0" },
          { label: "Areas", value: grandTotals.totalAreas, color: "#e2e8f0" },
          { label: "Total m²", value: grandTotals.totalArea.toFixed(2), color: "#f59e0b" },
          { label: "Total Tiles", value: grandTotals.totalTiles, color: "#22c55e" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ color: "#64748b", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "2px" }}>{stat.label}</div>
            <div style={{ color: stat.color, fontSize: "22px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {rooms.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            roomIndex={i}
            onUpdateRoom={updateRoom}
            onRemoveRoom={removeRoom}
            canRemoveRoom={rooms.length > 1}
          />
        ))}

        <button
          onClick={addRoom}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "none",
            color: "#000",
            borderRadius: "12px",
            padding: "14px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
            transition: "all 0.2s ease",
          }}
        >
          + Add Room
        </button>
      </div>
    </div>
  );
}
