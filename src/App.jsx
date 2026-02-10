import { useState } from "react";

const generateId = () => Math.random().toString(36).substr(2, 9);

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
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          Add rooms and multiple areas per room for accurate tile calculations
        </p>
      </div>

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
