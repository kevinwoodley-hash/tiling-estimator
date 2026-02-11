import { useState } from "react";
import { Download, Share2, Calculator, Package, DollarSign, User, Mail, Phone, MapPin } from "lucide-react";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Material consumption rates per m²
const MATERIAL_RATES = {
  adhesive: 3.5, // kg per m²
  grout: 0.5, // kg per m²
  primer: 0.15, // L per m² (standard primer)
  sealer: 0.1, // L per m²
  // Floor materials
  cementBoard: 1, // boards per m² (600x1200mm boards)
  ditraMat: 1.1, // m² per m² (10% wastage)
  floorTanking: 0.5, // L per m²
  // Wall materials
  wallTanking: 0.4, // L per m²
  tileTrim: 4, // linear meters per m² (approximate)
  wallPrimer: 0.2, // L per m²
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
  surfaceType: "floor", // floor or wall
  calculationMode: "areas", // "areas" or "walls"
  ceilingHeight: "2.4",
  roomLength: "",
  roomWidth: "",
  areas: [defaultArea()],
  tileSize: 5,
  customTileW: "",
  customTileH: "",
  wastage: 10,
  // Floor options
  useCementBoard: false,
  useDitraMat: false,
  useFloorTanking: false,
  // Wall options
  useWallTanking: false,
  useTileTrim: false,
  useWallPrimer: false,
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

  const totalSqm = room.calculationMode === "walls" 
    ? 2 * (parseFloat(room.ceilingHeight) || 0) * ((parseFloat(room.roomLength) || 0) + (parseFloat(room.roomWidth) || 0))
    : room.areas.reduce((sum, a) => {
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
      background: "linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(148, 163, 184, 0.1)",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 24px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(251, 146, 60, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.05)";
    }}
    >
      {/* Room Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
            color: "#000",
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0,
            boxShadow: "0 8px 24px rgba(251, 146, 60, 0.3)",
          }}>
            {roomIndex + 1}
          </div>
          <input
            type="text"
            value={room.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{
              ...inputStyle,
              fontSize: "20px",
              fontWeight: 700,
              background: "transparent",
              border: "none",
              borderBottom: "2px solid transparent",
              padding: "6px 0",
              fontFamily: "'DM Sans', sans-serif",
              color: "#ffffff",
              borderRadius: 0,
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => { 
              e.target.style.borderBottom = "2px solid rgba(251, 146, 60, 0.6)"; 
            }}
            onBlur={(e) => { 
              e.target.style.borderBottom = "2px solid transparent"; 
            }}
          />
        </div>
        {canRemoveRoom && (
          <button
            onClick={() => onRemoveRoom(room.id)}
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              borderRadius: "12px",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.25)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.15)";
              e.target.style.transform = "scale(1)";
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

      {/* Surface Type & Material Options */}
      <div style={{
        background: "rgba(148, 163, 184, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={labelStyle}>Surface Type</label>
            <select
              value={room.surfaceType}
              onChange={(e) => updateField("surfaceType", e.target.value)}
              style={selectStyle}
            >
              <option value="floor">Floor</option>
              <option value="wall">Wall</option>
            </select>
          </div>
          
          {room.surfaceType === "wall" && (
            <div>
              <label style={labelStyle}>Calculation Mode</label>
              <select
                value={room.calculationMode}
                onChange={(e) => updateField("calculationMode", e.target.value)}
                style={selectStyle}
              >
                <option value="areas">Individual Areas</option>
                <option value="walls">Complete Walls</option>
              </select>
            </div>
          )}
        </div>

        {room.calculationMode === "walls" && room.surfaceType === "wall" && (
          <div style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05))",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
          }}>
            <div style={{ 
              color: "#c4b5fd", 
              fontSize: "12px", 
              fontWeight: 600, 
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ fontSize: "16px" }}>📐</span>
              Complete Wall Calculation
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Room Length (m)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 4.0"
                  value={room.roomLength}
                  onChange={(e) => updateField("roomLength", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Room Width (m)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 3.0"
                  value={room.roomWidth}
                  onChange={(e) => updateField("roomWidth", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Ceiling Height (m)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.4"
                  value={room.ceilingHeight}
                  onChange={(e) => updateField("ceilingHeight", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ 
              color: "#64748b", 
              fontSize: "11px", 
              marginTop: "8px",
              fontStyle: "italic",
              textAlign: "center",
            }}>
              Formula: 2 × Height × (Length + Width)
            </div>
            {room.roomLength && room.roomWidth && room.ceilingHeight && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                background: "rgba(168, 85, 247, 0.15)",
                borderRadius: "8px",
              }}>
                <div style={{ 
                  fontSize: "12px", 
                  color: "#c4b5fd", 
                  marginBottom: "6px",
                  fontFamily: "'DM Mono', monospace",
                }}>
                  2 × {room.ceilingHeight}m × ({room.roomLength}m + {room.roomWidth}m)
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: "#c4b5fd", fontSize: "13px", fontWeight: 600 }}>
                    Total Wall Area:
                  </span>
                  <span style={{ color: "#a855f7", fontSize: "18px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                    {totalSqm.toFixed(2)} m²
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {room.surfaceType === "floor" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ 
              color: "#94a3b8", 
              fontSize: "11px", 
              fontWeight: 600, 
              textTransform: "uppercase", 
              letterSpacing: "1px",
              marginBottom: "4px",
            }}>
              Floor Materials
            </div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useCementBoard ? "rgba(59, 130, 246, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useCementBoard ? "rgba(59, 130, 246, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useCementBoard ? "rgba(59, 130, 246, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useCementBoard}
                onChange={(e) => updateField("useCementBoard", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Cement Board</span>
            </label>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useDitraMat ? "rgba(59, 130, 246, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useDitraMat ? "rgba(59, 130, 246, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useDitraMat ? "rgba(59, 130, 246, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useDitraMat}
                onChange={(e) => updateField("useDitraMat", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Ditra Mat</span>
            </label>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useFloorTanking ? "rgba(59, 130, 246, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useFloorTanking ? "rgba(59, 130, 246, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useFloorTanking ? "rgba(59, 130, 246, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useFloorTanking}
                onChange={(e) => updateField("useFloorTanking", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Tanking (Floor)</span>
            </label>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ 
              color: "#94a3b8", 
              fontSize: "11px", 
              fontWeight: 600, 
              textTransform: "uppercase", 
              letterSpacing: "1px",
              marginBottom: "4px",
            }}>
              Wall Materials
            </div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useWallTanking ? "rgba(168, 85, 247, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useWallTanking ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useWallTanking ? "rgba(168, 85, 247, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useWallTanking}
                onChange={(e) => updateField("useWallTanking", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Tanking (Wall)</span>
            </label>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useTileTrim ? "rgba(168, 85, 247, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useTileTrim ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useTileTrim ? "rgba(168, 85, 247, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useTileTrim}
                onChange={(e) => updateField("useTileTrim", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Tile Trim</span>
            </label>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#e2e8f0",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useWallPrimer ? "rgba(168, 85, 247, 0.1)" : "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.background = room.useWallPrimer ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)"; }}
            onMouseLeave={(e) => { e.target.style.background = room.useWallPrimer ? "rgba(168, 85, 247, 0.1)" : "transparent"; }}
            >
              <input
                type="checkbox"
                checked={room.useWallPrimer}
                onChange={(e) => updateField("useWallPrimer", e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span>Wall Primer</span>
            </label>
          </div>
        )}
      </div>

      {/* Areas */}
      {room.calculationMode === "areas" && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
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
                background: "linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(245, 158, 11, 0.15))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(251, 146, 60, 0.4)",
                color: "#fb923c",
                borderRadius: "10px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(245, 158, 11, 0.2))";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(245, 158, 11, 0.15))";
                e.target.style.transform = "translateY(0)";
              }}
            >
              + Add Area
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
      )}

      {/* Room Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(245, 158, 11, 0.08))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(251, 146, 60, 0.25)",
        borderRadius: "16px",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            color: "#94a3b8", 
            fontSize: "11px", 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "1.2px", 
            marginBottom: "6px", 
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Net Area
          </div>
          <div style={{ 
            color: "#ffffff", 
            fontSize: "24px", 
            fontWeight: 800, 
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1,
          }}>
            {totalSqm.toFixed(2)}
            <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 600 }}> m²</span>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            color: "#94a3b8", 
            fontSize: "11px", 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "1.2px", 
            marginBottom: "6px", 
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Inc. Wastage
          </div>
          <div style={{ 
            color: "#fb923c", 
            fontSize: "24px", 
            fontWeight: 800, 
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1,
          }}>
            {totalWithWastage}
            <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 600 }}> m²</span>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            color: "#94a3b8", 
            fontSize: "11px", 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "1.2px", 
            marginBottom: "6px", 
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Tiles Needed
          </div>
          <div style={{ 
            color: "#34d399", 
            fontSize: "24px", 
            fontWeight: 800, 
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1,
          }}>
            {tilesNeeded}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared styles
const labelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1.2px",
  marginBottom: "6px",
  fontFamily: "'DM Sans', sans-serif",
};

const inputStyle = {
  width: "100%",
  background: "rgba(148, 163, 184, 0.08)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: "10px",
  padding: "12px 14px",
  color: "#ffffff",
  fontSize: "14px",
  fontFamily: "'DM Mono', monospace",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
    // Floor material prices
    cementBoardPrice: "",
    ditraMatPrice: "",
    floorTankingPrice: "",
    // Wall material prices
    wallTankingPrice: "",
    tileTrimPrice: "",
    wallPrimerPrice: "",
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

  // Calculate surface-specific materials
  let cementBoardTotal = 0;
  let ditraMatTotal = 0;
  let floorTankingTotal = 0;
  let wallTankingTotal = 0;
  let tileTrimTotal = 0;
  let wallPrimerTotal = 0;

  rooms.forEach((room) => {
    const roomSqm = room.areas.reduce((s, a) => {
      return s + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
    }, 0);
    const wastageMultiplier = 1 + room.wastage / 100;
    const withWastage = roomSqm * wastageMultiplier;

    if (room.surfaceType === "floor") {
      if (room.useCementBoard) cementBoardTotal += withWastage * MATERIAL_RATES.cementBoard;
      if (room.useDitraMat) ditraMatTotal += withWastage * MATERIAL_RATES.ditraMat;
      if (room.useFloorTanking) floorTankingTotal += withWastage * MATERIAL_RATES.floorTanking;
    } else {
      if (room.useWallTanking) wallTankingTotal += withWastage * MATERIAL_RATES.wallTanking;
      if (room.useTileTrim) tileTrimTotal += withWastage * MATERIAL_RATES.tileTrim;
      if (room.useWallPrimer) wallPrimerTotal += withWastage * MATERIAL_RATES.wallPrimer;
    }
  });

  const surfaceMaterials = {
    cementBoard: cementBoardTotal.toFixed(1),
    ditraMat: ditraMatTotal.toFixed(1),
    floorTanking: floorTankingTotal.toFixed(1),
    wallTanking: wallTankingTotal.toFixed(1),
    tileTrim: tileTrimTotal.toFixed(1),
    wallPrimer: wallPrimerTotal.toFixed(1),
  };

  // Cost calculations
  const costs = {
    tiles: grandTotals.totalArea * (parseFloat(pricing.tilePricePerSqm) || 0),
    labour: grandTotals.totalArea * (parseFloat(pricing.labourPricePerSqm) || 0),
    adhesive: parseFloat(materials.adhesive) * (parseFloat(pricing.adhesivePrice) || 0),
    grout: parseFloat(materials.grout) * (parseFloat(pricing.groutPrice) || 0),
    primer: parseFloat(materials.primer) * (parseFloat(pricing.primerPrice) || 0),
    sealer: parseFloat(materials.sealer) * (parseFloat(pricing.sealerPrice) || 0),
    // Floor materials
    cementBoard: parseFloat(surfaceMaterials.cementBoard) * (parseFloat(pricing.cementBoardPrice) || 0),
    ditraMat: parseFloat(surfaceMaterials.ditraMat) * (parseFloat(pricing.ditraMatPrice) || 0),
    floorTanking: parseFloat(surfaceMaterials.floorTanking) * (parseFloat(pricing.floorTankingPrice) || 0),
    // Wall materials
    wallTanking: parseFloat(surfaceMaterials.wallTanking) * (parseFloat(pricing.wallTankingPrice) || 0),
    tileTrim: parseFloat(surfaceMaterials.tileTrim) * (parseFloat(pricing.tileTrimPrice) || 0),
    wallPrimer: parseFloat(surfaceMaterials.wallPrimer) * (parseFloat(pricing.wallPrimerPrice) || 0),
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
    
    // Floor materials
    if (parseFloat(surfaceMaterials.cementBoard) > 0) {
      message += `Cement Board: ${surfaceMaterials.cementBoard} m²\n`;
    }
    if (parseFloat(surfaceMaterials.ditraMat) > 0) {
      message += `Ditra Mat: ${surfaceMaterials.ditraMat} m²\n`;
    }
    if (parseFloat(surfaceMaterials.floorTanking) > 0) {
      message += `Floor Tanking: ${surfaceMaterials.floorTanking} L\n`;
    }
    
    // Wall materials
    if (parseFloat(surfaceMaterials.wallTanking) > 0) {
      message += `Wall Tanking: ${surfaceMaterials.wallTanking} L\n`;
    }
    if (parseFloat(surfaceMaterials.tileTrim) > 0) {
      message += `Tile Trim: ${surfaceMaterials.tileTrim} m\n`;
    }
    if (parseFloat(surfaceMaterials.wallPrimer) > 0) {
      message += `Wall Primer: ${surfaceMaterials.wallPrimer} L\n`;
    }

    if (subtotal > 0) {
      message += `\n💰 *COST BREAKDOWN*\n`;
      if (costs.tiles > 0) message += `Tiles: £${costs.tiles.toFixed(2)}\n`;
      if (costs.labour > 0) message += `Labour: £${costs.labour.toFixed(2)}\n`;
      if (costs.adhesive > 0) message += `Adhesive: £${costs.adhesive.toFixed(2)}\n`;
      if (costs.grout > 0) message += `Grout: £${costs.grout.toFixed(2)}\n`;
      if (costs.primer > 0) message += `Primer: £${costs.primer.toFixed(2)}\n`;
      if (costs.sealer > 0) message += `Sealer: £${costs.sealer.toFixed(2)}\n`;
      if (costs.cementBoard > 0) message += `Cement Board: £${costs.cementBoard.toFixed(2)}\n`;
      if (costs.ditraMat > 0) message += `Ditra Mat: £${costs.ditraMat.toFixed(2)}\n`;
      if (costs.floorTanking > 0) message += `Floor Tanking: £${costs.floorTanking.toFixed(2)}\n`;
      if (costs.wallTanking > 0) message += `Wall Tanking: £${costs.wallTanking.toFixed(2)}\n`;
      if (costs.tileTrim > 0) message += `Tile Trim: £${costs.tileTrim.toFixed(2)}\n`;
      if (costs.wallPrimer > 0) message += `Wall Primer: £${costs.wallPrimer.toFixed(2)}\n`;
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
      content += `ROOM ${idx + 1}: ${room.name} (${room.surfaceType === 'floor' ? 'Floor' : 'Wall'})\n`;
      
      if (room.calculationMode === 'walls' && room.surfaceType === 'wall') {
        const wallArea = 2 * (parseFloat(room.ceilingHeight) || 0) * ((parseFloat(room.roomLength) || 0) + (parseFloat(room.roomWidth) || 0));
        content += `  Calculation: Complete Walls\n`;
        content += `  Room Dimensions: ${room.roomLength}m × ${room.roomWidth}m\n`;
        content += `  Ceiling Height: ${room.ceilingHeight}m\n`;
        content += `  Total Wall Area: ${wallArea.toFixed(2)} m²\n`;
      } else {
        content += `  Total Area: ${roomTotal.toFixed(2)} m²\n`;
      }
      
      // Show selected options
      const options = [];
      if (room.surfaceType === 'floor') {
        if (room.useCementBoard) options.push('Cement Board');
        if (room.useDitraMat) options.push('Ditra Mat');
        if (room.useFloorTanking) options.push('Floor Tanking');
      } else {
        if (room.useWallTanking) options.push('Wall Tanking');
        if (room.useTileTrim) options.push('Tile Trim');
        if (room.useWallPrimer) options.push('Wall Primer');
      }
      if (options.length > 0) {
        content += `  Options: ${options.join(', ')}\n`;
      }
      
      if (room.calculationMode === 'areas') {
        room.areas.forEach((area, aIdx) => {
          const sqm = (parseFloat(area.length) || 0) * (parseFloat(area.width) || 0);
          const areaName = area.type === "Custom Area" ? area.customName || "Custom Area" : area.type;
          content += `  ${String.fromCharCode(65 + aIdx)}. ${areaName}: ${area.length}m × ${area.width}m = ${sqm.toFixed(2)} m²\n`;
        });
      }
      content += `\n`;
    });

    content += `MATERIALS NEEDED\n${'-'.repeat(50)}\n`;
    content += `Standard Materials:\n`;
    content += `  Adhesive: ${materials.adhesive} kg\n`;
    content += `  Grout: ${materials.grout} kg\n`;
    content += `  Primer: ${materials.primer} L\n`;
    content += `  Sealer: ${materials.sealer} L\n`;
    
    // Floor materials
    if (parseFloat(surfaceMaterials.cementBoard) > 0 || 
        parseFloat(surfaceMaterials.ditraMat) > 0 || 
        parseFloat(surfaceMaterials.floorTanking) > 0) {
      content += `\nFloor Materials:\n`;
      if (parseFloat(surfaceMaterials.cementBoard) > 0) {
        content += `  Cement Board: ${surfaceMaterials.cementBoard} m²\n`;
      }
      if (parseFloat(surfaceMaterials.ditraMat) > 0) {
        content += `  Ditra Mat: ${surfaceMaterials.ditraMat} m²\n`;
      }
      if (parseFloat(surfaceMaterials.floorTanking) > 0) {
        content += `  Floor Tanking: ${surfaceMaterials.floorTanking} L\n`;
      }
    }
    
    // Wall materials
    if (parseFloat(surfaceMaterials.wallTanking) > 0 || 
        parseFloat(surfaceMaterials.tileTrim) > 0 || 
        parseFloat(surfaceMaterials.wallPrimer) > 0) {
      content += `\nWall Materials:\n`;
      if (parseFloat(surfaceMaterials.wallTanking) > 0) {
        content += `  Wall Tanking: ${surfaceMaterials.wallTanking} L\n`;
      }
      if (parseFloat(surfaceMaterials.tileTrim) > 0) {
        content += `  Tile Trim: ${surfaceMaterials.tileTrim} m\n`;
      }
      if (parseFloat(surfaceMaterials.wallPrimer) > 0) {
        content += `  Wall Primer: ${surfaceMaterials.wallPrimer} L\n`;
      }
    }

    if (subtotal > 0) {
      content += `\nCOST BREAKDOWN\n${'-'.repeat(50)}\n`;
      if (costs.tiles > 0) content += `Tiles: £${costs.tiles.toFixed(2)}\n`;
      if (costs.labour > 0) content += `Labour: £${costs.labour.toFixed(2)}\n`;
      if (costs.adhesive > 0) content += `Adhesive: £${costs.adhesive.toFixed(2)}\n`;
      if (costs.grout > 0) content += `Grout: £${costs.grout.toFixed(2)}\n`;
      if (costs.primer > 0) content += `Primer: £${costs.primer.toFixed(2)}\n`;
      if (costs.sealer > 0) content += `Sealer: £${costs.sealer.toFixed(2)}\n`;
      if (costs.cementBoard > 0) content += `Cement Board: £${costs.cementBoard.toFixed(2)}\n`;
      if (costs.ditraMat > 0) content += `Ditra Mat: £${costs.ditraMat.toFixed(2)}\n`;
      if (costs.floorTanking > 0) content += `Floor Tanking: £${costs.floorTanking.toFixed(2)}\n`;
      if (costs.wallTanking > 0) content += `Wall Tanking: £${costs.wallTanking.toFixed(2)}\n`;
      if (costs.tileTrim > 0) content += `Tile Trim: £${costs.tileTrim.toFixed(2)}\n`;
      if (costs.wallPrimer > 0) content += `Wall Primer: £${costs.wallPrimer.toFixed(2)}\n`;
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
      background: "linear-gradient(180deg, #0a0e1a 0%, #1a1f35 50%, #0f1419 100%)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "32px 20px 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <div style={{
          textAlign: "center",
          marginBottom: "20px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "12px",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: "0 8px 24px rgba(251, 146, 60, 0.3)",
            }}>
              ◧
            </div>
            <h1 style={{
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Tiling Estimator
            </h1>
          </div>
          <p style={{ 
            color: "#94a3b8", 
            fontSize: "15px", 
            margin: "0 0 20px 0",
            fontWeight: 500,
          }}>
            Professional multi-room calculator with smart material estimates
          </p>
          <button
            onClick={() => setShowProfessional(!showProfessional)}
            style={{
              background: showProfessional 
                ? "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)" 
                : "rgba(248, 113, 113, 0.1)",
              border: showProfessional ? "none" : "1px solid rgba(248, 113, 113, 0.3)",
              color: showProfessional ? "#000" : "#fb923c",
              borderRadius: "12px",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: showProfessional ? "0 4px 16px rgba(251, 146, 60, 0.4)" : "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = showProfessional 
                ? "0 8px 24px rgba(251, 146, 60, 0.5)" 
                : "0 4px 16px rgba(248, 113, 113, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = showProfessional 
                ? "0 4px 16px rgba(251, 146, 60, 0.4)" 
                : "none";
            }}
          >
            <Calculator size={18} />
            {showProfessional ? "Hide" : "Show"} Professional Mode
          </button>
        </div>
      </div>

      {/* Professional Mode Sections */}
      {showProfessional && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Customer Information */}
          <div style={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <User size={20} color="#000" />
              </div>
              <h3 style={{
                color: "#ffffff",
                fontSize: "18px",
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
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Package size={20} color="#000" />
              </div>
              <h3 style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Materials Required
              </h3>
            </div>
            
            {/* Standard Materials */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Standard Materials</div>
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

            {/* Floor Materials */}
            {(parseFloat(surfaceMaterials.cementBoard) > 0 || parseFloat(surfaceMaterials.ditraMat) > 0 || parseFloat(surfaceMaterials.floorTanking) > 0) && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Floor Materials</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {parseFloat(surfaceMaterials.cementBoard) > 0 && (
                    <div style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Cement Board</div>
                      <div style={{ color: "#3b82f6", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.cementBoard}<span style={{ fontSize: "12px", color: "#94a3b8" }}> m²</span>
                      </div>
                    </div>
                  )}
                  {parseFloat(surfaceMaterials.ditraMat) > 0 && (
                    <div style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Ditra Mat</div>
                      <div style={{ color: "#3b82f6", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.ditraMat}<span style={{ fontSize: "12px", color: "#94a3b8" }}> m²</span>
                      </div>
                    </div>
                  )}
                  {parseFloat(surfaceMaterials.floorTanking) > 0 && (
                    <div style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Floor Tanking</div>
                      <div style={{ color: "#3b82f6", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.floorTanking}<span style={{ fontSize: "12px", color: "#94a3b8" }}> L</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wall Materials */}
            {(parseFloat(surfaceMaterials.wallTanking) > 0 || parseFloat(surfaceMaterials.tileTrim) > 0 || parseFloat(surfaceMaterials.wallPrimer) > 0) && (
              <div>
                <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Wall Materials</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {parseFloat(surfaceMaterials.wallTanking) > 0 && (
                    <div style={{
                      background: "rgba(168,85,247,0.1)",
                      border: "1px solid rgba(168,85,247,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Wall Tanking</div>
                      <div style={{ color: "#a855f7", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.wallTanking}<span style={{ fontSize: "12px", color: "#94a3b8" }}> L</span>
                      </div>
                    </div>
                  )}
                  {parseFloat(surfaceMaterials.tileTrim) > 0 && (
                    <div style={{
                      background: "rgba(168,85,247,0.1)",
                      border: "1px solid rgba(168,85,247,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Tile Trim</div>
                      <div style={{ color: "#a855f7", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.tileTrim}<span style={{ fontSize: "12px", color: "#94a3b8" }}> m</span>
                      </div>
                    </div>
                  )}
                  {parseFloat(surfaceMaterials.wallPrimer) > 0 && (
                    <div style={{
                      background: "rgba(168,85,247,0.1)",
                      border: "1px solid rgba(168,85,247,0.2)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>Wall Primer</div>
                      <div style={{ color: "#a855f7", fontSize: "20px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                        {surfaceMaterials.wallPrimer}<span style={{ fontSize: "12px", color: "#94a3b8" }}> L</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Costing */}
          <div style={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <DollarSign size={20} color="#000" />
              </div>
              <h3 style={{
                color: "#ffffff",
                fontSize: "18px",
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
              
              {/* Floor Materials Pricing */}
              {parseFloat(surfaceMaterials.cementBoard) > 0 && (
                <div>
                  <label style={labelStyle}>Cement Board (£/m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="15.00"
                    value={pricing.cementBoardPrice}
                    onChange={(e) => setPricing({ ...pricing, cementBoardPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.ditraMat) > 0 && (
                <div>
                  <label style={labelStyle}>Ditra Mat (£/m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="20.00"
                    value={pricing.ditraMatPrice}
                    onChange={(e) => setPricing({ ...pricing, ditraMatPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.floorTanking) > 0 && (
                <div>
                  <label style={labelStyle}>Floor Tanking (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    value={pricing.floorTankingPrice}
                    onChange={(e) => setPricing({ ...pricing, floorTankingPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              
              {/* Wall Materials Pricing */}
              {parseFloat(surfaceMaterials.wallTanking) > 0 && (
                <div>
                  <label style={labelStyle}>Wall Tanking (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="22.00"
                    value={pricing.wallTankingPrice}
                    onChange={(e) => setPricing({ ...pricing, wallTankingPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.tileTrim) > 0 && (
                <div>
                  <label style={labelStyle}>Tile Trim (£/m)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="3.50"
                    value={pricing.tileTrimPrice}
                    onChange={(e) => setPricing({ ...pricing, tileTrimPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.wallPrimer) > 0 && (
                <div>
                  <label style={labelStyle}>Wall Primer (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10.00"
                    value={pricing.wallPrimerPrice}
                    onChange={(e) => setPricing({ ...pricing, wallPrimerPrice: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              )}
              
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
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
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
                  {costs.cementBoard > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Cement Board</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.cementBoard.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.ditraMat > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Ditra Mat</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.ditraMat.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.floorTanking > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Floor Tanking</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.floorTanking.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.wallTanking > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Wall Tanking</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.wallTanking.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.tileTrim > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Tile Trim</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.tileTrim.toFixed(2)}</span>
                    </div>
                  )}
                  {costs.wallPrimer > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Wall Primer</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.wallPrimer.toFixed(2)}</span>
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
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={exportToWhatsApp}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #34d399, #10b981)",
                border: "none",
                color: "#000",
                borderRadius: "14px",
                padding: "16px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 32px rgba(34, 197, 94, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.3)";
              }}
            >
              <Share2 size={20} />
              Share via WhatsApp
            </button>
            <button
              onClick={exportToFile}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                border: "none",
                color: "#000",
                borderRadius: "14px",
                padding: "16px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.3)";
              }}
            >
              <Download size={20} />
              Download Estimate
            </button>
          </div>
        </div>
      )}

      {/* Grand Summary Bar */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto 32px",
        background: "linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(245, 158, 11, 0.1))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(251, 146, 60, 0.2)",
        borderRadius: "20px",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        {[
          { label: "Rooms", value: rooms.length, color: "#ffffff", icon: "🏠" },
          { label: "Areas", value: grandTotals.totalAreas, color: "#ffffff", icon: "📐" },
          { label: "Total m²", value: grandTotals.totalArea.toFixed(2), color: "#fb923c", icon: "📏" },
          { label: "Tiles", value: grandTotals.totalTiles, color: "#34d399", icon: "◧" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ 
              fontSize: "20px", 
              marginBottom: "6px",
              filter: "grayscale(0.2)",
            }}>
              {stat.icon}
            </div>
            <div style={{ 
              color: "#64748b", 
              fontSize: "11px", 
              fontWeight: 600, 
              textTransform: "uppercase", 
              letterSpacing: "1.5px", 
              marginBottom: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {stat.label}
            </div>
            <div style={{ 
              color: stat.color, 
              fontSize: "28px", 
              fontWeight: 800, 
              fontFamily: "'DM Mono', monospace",
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
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
            background: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
            border: "none",
            color: "#000",
            borderRadius: "16px",
            padding: "18px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 32px rgba(251, 146, 60, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 40px rgba(251, 146, 60, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 32px rgba(251, 146, 60, 0.4)";
          }}
        >
          + Add Room
        </button>
      </div>
    </div>
  );
}
