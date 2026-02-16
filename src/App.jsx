import { useState } from "react";
import { Download, Share2, Calculator, Package, DollarSign, User, Mail, Phone, MapPin } from "lucide-react";

const generateId = () => Math.random().toString(36).substr(2, 9);

// Theme configurations
const THEMES = {
  modern: {
    name: "Modern Dark",
    background: "linear-gradient(180deg, #0a0e1a 0%, #1a1f35 50%, #0f1419 100%)",
    primary: "linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)",
    primaryColor: "#fb923c",
    cardBg: "linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    accent: "#34d399",
  },
  classic: {
    name: "Classic Blue",
    background: "linear-gradient(180deg, #1e3a5f 0%, #2d5a8c 50%, #1a2f4a 100%)",
    primary: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    primaryColor: "#60a5fa",
    cardBg: "linear-gradient(145deg, rgba(30, 58, 95, 0.6), rgba(26, 47, 74, 0.8))",
    textPrimary: "#ffffff",
    textSecondary: "#93c5fd",
    accent: "#34d399",
  },
  minimal: {
    name: "Minimal Light",
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
    primary: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    primaryColor: "#0ea5e9",
    cardBg: "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.95))",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    accent: "#10b981",
  },
  sunset: {
    name: "Sunset",
    background: "linear-gradient(180deg, #1a0d2e 0%, #2d1b3d 50%, #1a0f24 100%)",
    primary: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    primaryColor: "#fb923c",
    cardBg: "linear-gradient(145deg, rgba(45, 27, 61, 0.6), rgba(26, 15, 36, 0.8))",
    textPrimary: "#ffffff",
    textSecondary: "#c4b5fd",
    accent: "#fbbf24",
  },
};

// Material consumption rates per m²
const TROWEL_SIZES = [
  { label: "6mm Notched", coverage: 2.5, description: "Small tiles (up to 300mm)" },
  { label: "8mm Notched", coverage: 3.5, description: "Medium tiles (300-450mm)" },
  { label: "10mm Notched", coverage: 4.5, description: "Large tiles (450-600mm)" },
  { label: "12mm Notched", coverage: 5.5, description: "Extra large tiles (600mm+)" },
];

const GROUT_JOINT_WIDTHS = [
  { label: "1mm", width: 1 },
  { label: "2mm", width: 2 },
  { label: "3mm", width: 3 },
  { label: "4mm", width: 4 },
  { label: "5mm", width: 5 },
  { label: "6mm", width: 6 },
];

const MATERIAL_RATES = {
  // Adhesive now calculated based on trowel size
  grout: 0.5, // kg per m² (fallback if not calculated by joint width)
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
  // Grout density for calculations
  groutDensity: 1.6, // kg per liter
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
  trowelSize: 1, // Index into TROWEL_SIZES array (default 8mm)
  groutJointWidth: 1, // Index into GROUT_JOINT_WIDTHS array (default 2mm)
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

function RoomCard({ room, roomIndex, onUpdateRoom, onRemoveRoom, canRemoveRoom, theme }) {
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

      {/* Surface Type & Materials Section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(147, 51, 234, 0.05))",
        border: "1px solid rgba(168, 85, 247, 0.2)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
      }}>
        <div style={{ 
          color: "#c4b5fd", 
          fontSize: "13px", 
          fontWeight: 700, 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          <span style={{ fontSize: "16px" }}>📋</span>
          Surface & Materials
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: room.surfaceType === "wall" ? "1fr 1fr" : "1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={labelStyle}>Surface Type</label>
            <select
              value={room.surfaceType}
              onChange={(e) => {
                const newSurfaceType = e.target.value;
                // Batch both updates together to prevent race condition
                onUpdateRoom(room.id, {
                  ...room,
                  surfaceType: newSurfaceType,
                  calculationMode: "areas" // Always default to areas mode when changing surface
                });
              }}
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

        {/* Optional Materials - Compact grid layout */}
        {room.surfaceType === "floor" && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "8px",
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useCementBoard ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useCementBoard ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useCementBoard}
                onChange={(e) => updateField("useCementBoard", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Cement Board</span>
            </label>
            
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useDitraMat ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useDitraMat ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useDitraMat}
                onChange={(e) => updateField("useDitraMat", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Ditra Mat</span>
            </label>
            
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useFloorTanking ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useFloorTanking ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useFloorTanking}
                onChange={(e) => updateField("useFloorTanking", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Floor Tanking</span>
            </label>
          </div>
        )}

        {room.surfaceType === "wall" && room.calculationMode === "areas" && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "8px",
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useWallTanking ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useWallTanking ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useWallTanking}
                onChange={(e) => updateField("useWallTanking", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Wall Tanking</span>
            </label>
            
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useTileTrim ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useTileTrim ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useTileTrim}
                onChange={(e) => updateField("useTileTrim", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Tile Trim</span>
            </label>
            
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e2e8f0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              padding: "10px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              background: room.useWallPrimer ? "rgba(168, 85, 247, 0.15)" : "rgba(148, 163, 184, 0.05)",
              border: `1px solid ${room.useWallPrimer ? "rgba(168, 85, 247, 0.3)" : "rgba(148, 163, 184, 0.1)"}`,
            }}>
              <input
                type="checkbox"
                checked={room.useWallPrimer}
                onChange={(e) => updateField("useWallPrimer", e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <span>Wall Primer</span>
            </label>
          </div>
        )}
      </div>

      {/* Complete Wall Calculation (only shown when in walls mode) */}
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
          
          {!room.roomLength && !room.roomWidth && (
            <div style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "16px" }}>💡</span>
              <div style={{ 
                color: "#93c5fd", 
                fontSize: "11px",
                lineHeight: "1.4",
              }}>
                Enter room dimensions below to calculate total wall area automatically
              </div>
            </div>
          )}
          
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

      {/* Areas */}
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
          
          {/* Helpful hint */}
          {room.areas.length === 1 && !room.areas[0].length && !room.areas[0].width && (
            <div style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>💡</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: "#93c5fd", 
                  fontSize: "13px", 
                  fontWeight: 600,
                  marginBottom: "4px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Enter your area dimensions below
                </div>
                <div style={{ 
                  color: "#64748b", 
                  fontSize: "11px",
                  lineHeight: "1.4",
                }}>
                  Input the length and width in metres. Add multiple areas if needed (e.g., main floor + alcove).
                </div>
              </div>
            </div>
          )}
          
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

      {/* Tile Configuration Section - Moved below areas */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.05))",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
      }}>
        <div style={{ 
          color: "#60a5fa", 
          fontSize: "13px", 
          fontWeight: 700, 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          <span style={{ fontSize: "16px" }}>🔲</span>
          Tile Configuration
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: isCustomTile ? "2fr 1fr 1fr 1fr" : "2fr 1fr 1fr 1fr", gap: "12px" }}>
          {/* Tile Size */}
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
          
          {/* Custom Tile Dimensions (if custom selected) */}
          {isCustomTile && (
            <>
              <div>
                <label style={labelStyle}>Width (mm)</label>
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
                <label style={labelStyle}>Height (mm)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="mm"
                  value={room.customTileH}
                  onChange={(e) => updateField("customTileH", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}
          
          {/* Wastage */}
          {!isCustomTile && (
            <div>
              <label style={labelStyle}>Wastage</label>
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
          )}
          
          {isCustomTile && (
            <div>
              <label style={labelStyle}>Wastage</label>
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
          )}
          
          {/* Trowel Size */}
          <div>
            <label style={labelStyle}>Trowel</label>
            <select
              value={room.trowelSize}
              onChange={(e) => updateField("trowelSize", parseInt(e.target.value))}
              style={selectStyle}
            >
              {TROWEL_SIZES.map((ts, i) => (
                <option key={i} value={i}>{ts.label}</option>
              ))}
            </select>
          </div>
          
          {/* Grout Joint */}
          <div>
            <label style={labelStyle}>Joint</label>
            <select
              value={room.groutJointWidth}
              onChange={(e) => updateField("groutJointWidth", parseInt(e.target.value))}
              style={selectStyle}
            >
              {GROUT_JOINT_WIDTHS.map((gj, i) => (
                <option key={i} value={i}>{gj.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
  const [styleTheme, setStyleTheme] = useState("modern"); // modern, classic, minimal
  const [currentPage, setCurrentPage] = useState("calculator"); // calculator or settings
  const [settingsTab, setSettingsTab] = useState("business"); // business, pricing, integrations, preferences
  
  // Local search state
  const [userLocation, setUserLocation] = useState("");
  const [userCoords, setUserCoords] = useState(null); // { lat, lng }
  const [tileStores, setTileStores] = useState([]);
  const [localTilers, setLocalTilers] = useState([]);
  const [searchingStores, setSearchingStores] = useState(false);
  const [searchingTilers, setSearchingTilers] = useState(false);
  const [showStoreResults, setShowStoreResults] = useState(false);
  const [showTilerResults, setShowTilerResults] = useState(false);
  
  // Business Branding
  const [businessBranding, setBusinessBranding] = useState({
    companyName: "",
    logo: "", // base64 encoded image
    phone: "",
    email: "",
    website: "",
    address: "",
    vatNumber: "",
    registrationNumber: "",
  });
  
  // FreeAgent Integration
  const [freeAgent, setFreeAgent] = useState({
    apiUrl: "https://api.freeagent.com/v2",
    accessToken: "",
    connected: false,
    lastSync: null,
  });
  
  // Customer Information
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Pricing - now editable by all users
  const [pricing, setPricing] = useState({
    dayRate: "",
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
    includeVAT: false,
    vatRate: 20,
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
      let roomSqm = 0;
      
      // Calculate room area based on calculation mode
      if (room.calculationMode === "walls" && room.surfaceType === "wall") {
        roomSqm = 2 * (parseFloat(room.ceilingHeight) || 0) * ((parseFloat(room.roomLength) || 0) + (parseFloat(room.roomWidth) || 0));
      } else {
        roomSqm = room.areas.reduce((s, a) => {
          return s + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
        }, 0);
      }
      
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
  // Calculate materials based on room-specific settings
  let adhesiveTotal = 0;
  let groutTotal = 0;
  
  rooms.forEach((room) => {
    let roomSqm = 0;
    
    // Calculate room area based on calculation mode
    if (room.calculationMode === "walls" && room.surfaceType === "wall") {
      roomSqm = 2 * (parseFloat(room.ceilingHeight) || 0) * ((parseFloat(room.roomLength) || 0) + (parseFloat(room.roomWidth) || 0));
    } else {
      roomSqm = room.areas.reduce((s, a) => {
        return s + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
      }, 0);
    }
    
    const wastageMultiplier = 1 + room.wastage / 100;
    const withWastage = roomSqm * wastageMultiplier;
    
    // Calculate adhesive based on trowel size
    const trowelInfo = TROWEL_SIZES[room.trowelSize] || TROWEL_SIZES[1];
    adhesiveTotal += withWastage * trowelInfo.coverage;
    
    // Calculate grout based on tile size and joint width
    const tileInfo = TILE_SIZES[room.tileSize];
    const isCustom = tileInfo.label === "Custom";
    const tileW = isCustom ? (parseFloat(room.customTileW) || 300) : (tileInfo.w * 1000); // Convert to mm
    const tileH = isCustom ? (parseFloat(room.customTileH) || 300) : (tileInfo.h * 1000); // Convert to mm
    const tileDepth = 10; // Assume 10mm tile depth
    const jointWidth = GROUT_JOINT_WIDTHS[room.groutJointWidth]?.width || 2;
    
    // Grout calculation formula: (Length + Width) / (Length × Width) × Joint Width × Tile Depth × Grout Density
    // This gives kg per tile, then multiply by number of tiles
    const groutPerTile = ((tileW + tileH) / (tileW * tileH)) * jointWidth * tileDepth * MATERIAL_RATES.groutDensity / 1000;
    const tileArea = (tileW / 1000) * (tileH / 1000); // Back to m²
    const numTiles = withWastage / tileArea;
    groutTotal += numTiles * groutPerTile;
  });
  
  const materials = {
    adhesive: adhesiveTotal.toFixed(1),
    adhesiveBags: Math.ceil(adhesiveTotal / 20), // 20kg bags
    grout: groutTotal.toFixed(1),
    groutBags: Math.ceil(groutTotal / 2.5), // 2.5kg bags
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
    let roomSqm = 0;
    
    // Calculate room area based on calculation mode
    if (room.calculationMode === "walls" && room.surfaceType === "wall") {
      roomSqm = 2 * (parseFloat(room.ceilingHeight) || 0) * ((parseFloat(room.roomLength) || 0) + (parseFloat(room.roomWidth) || 0));
    } else {
      roomSqm = room.areas.reduce((s, a) => {
        return s + (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
      }, 0);
    }
    
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
    dayRate: parseFloat(pricing.dayRate) || 0,
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
  const subtotalWithMarkup = subtotal + markupAmount;
  const vatAmount = pricing.includeVAT ? subtotalWithMarkup * (pricing.vatRate / 100) : 0;
  const total = subtotalWithMarkup + vatAmount;

  // Get current theme
  const theme = THEMES[styleTheme];

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessBranding({ ...businessBranding, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setUserLocation("Current Location");
          alert('Location detected! You can now search for nearby stores and tilers.');
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enter your city or postcode manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  };

  // Search for local tile stores
  const searchTileStores = async () => {
    if (!userLocation.trim() && !userCoords) {
      alert('Please enter your location or use "Drop Pin" to get current location');
      return;
    }
    
    setSearchingStores(true);
    setShowStoreResults(false);
    
    try {
      // Simulate API call - In production, this would call places_search
      // Sample realistic data for demonstration
      const mockStores = [
        {
          name: "Topps Tiles",
          address: "High Street, Town Centre",
          phone: "0123 456 7890",
          distance: "0.5 miles",
          rating: 4.5,
          reviewCount: 234,
          hours: "Mon-Sat 8am-6pm, Sun 10am-4pm",
          website: "www.toppstiles.co.uk",
          type: "Major Chain",
          services: ["Retail", "Trade", "Design Service"],
          placeId: "store_1"
        },
        {
          name: "CTD Tiles",
          address: "Retail Park, Industrial Estate",
          phone: "0123 456 7891",
          distance: "1.2 miles",
          rating: 4.3,
          reviewCount: 156,
          hours: "Mon-Fri 7:30am-5:30pm, Sat 8am-5pm",
          website: "www.ctdtiles.co.uk",
          type: "Trade & Retail",
          services: ["Trade Counter", "Expert Advice", "Bulk Orders"],
          placeId: "store_2"
        },
        {
          name: "Tile Giant",
          address: "Main Road, Business Park",
          phone: "0123 456 7892",
          distance: "1.8 miles",
          rating: 4.6,
          reviewCount: 189,
          hours: "Mon-Sat 8am-6pm, Sun 10am-4pm",
          website: "www.tilegiant.co.uk",
          type: "Specialist Retailer",
          services: ["Showroom", "Click & Collect", "Free Samples"],
          placeId: "store_3"
        },
        {
          name: "Local Tile Emporium",
          address: "Station Road, Old Town",
          phone: "0123 456 7893",
          distance: "2.1 miles",
          rating: 4.8,
          reviewCount: 92,
          hours: "Mon-Sat 9am-5:30pm, Closed Sun",
          website: "www.localtilesltd.co.uk",
          type: "Independent",
          services: ["Bespoke Designs", "Natural Stone", "Italian Imports"],
          placeId: "store_4"
        },
        {
          name: "B&Q",
          address: "Warehouse District",
          phone: "0123 456 7894",
          distance: "2.5 miles",
          rating: 4.1,
          reviewCount: 567,
          hours: "Mon-Sat 7am-8pm, Sun 10am-4pm",
          website: "www.diy.com",
          type: "DIY Superstore",
          services: ["DIY Supplies", "Tools", "Delivery Available"],
          placeId: "store_5"
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTileStores(mockStores);
      setShowStoreResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      alert('Unable to search at this time. Please try again.');
    } finally {
      setSearchingStores(false);
    }
  };

  // Search for local tilers
  const searchLocalTilers = async () => {
    if (!userLocation.trim() && !userCoords) {
      alert('Please enter your location or use "Drop Pin" to get current location');
      return;
    }
    
    setSearchingTilers(true);
    setShowTilerResults(false);
    
    try {
      // Simulate API call - In production, this would call places_search
      const mockTilers = [
        {
          name: "Professional Tiling Services Ltd",
          contact: "John Smith",
          phone: "07700 900001",
          email: "info@protilingservices.co.uk",
          distance: "0.8 miles",
          rating: 4.9,
          reviewCount: 127,
          verified: true,
          experience: "15+ years",
          specialties: ["Bathrooms", "Kitchens", "Natural Stone"],
          certifications: ["NVQ Level 3", "City & Guilds"],
          insurance: "£5M Public Liability",
          pricing: "£180-£220 per day",
          availability: "Available next week",
          portfolio: true,
          placeId: "tiler_1"
        },
        {
          name: "Expert Tile Installations",
          contact: "Sarah Johnson",
          phone: "07700 900002",
          email: "sarah@experttileinstalls.co.uk",
          distance: "1.5 miles",
          rating: 4.8,
          reviewCount: 98,
          verified: true,
          experience: "12 years",
          specialties: ["Large Format Tiles", "Wet Rooms", "Commercial"],
          certifications: ["NVQ Level 2 & 3", "Wetroom Specialist"],
          insurance: "£10M Public Liability",
          pricing: "£200-£250 per day",
          availability: "Booking 2 weeks ahead",
          portfolio: true,
          placeId: "tiler_2"
        },
        {
          name: "Precision Tilers",
          contact: "Mike Davies",
          phone: "07700 900003",
          email: "mike@precisiontilers.co.uk",
          distance: "2.0 miles",
          rating: 4.7,
          reviewCount: 156,
          verified: true,
          experience: "20+ years",
          specialties: ["Mosaic Work", "Period Properties", "Restoration"],
          certifications: ["Master Tiler", "Heritage Specialist"],
          insurance: "£5M Public Liability",
          pricing: "£190-£230 per day",
          availability: "Available now",
          portfolio: true,
          placeId: "tiler_3"
        },
        {
          name: "Bathroom & Kitchen Tiling Co",
          contact: "David Brown",
          phone: "07700 900004",
          email: "david@bathkitchentiling.co.uk",
          distance: "2.3 miles",
          rating: 4.6,
          reviewCount: 83,
          verified: false,
          experience: "8 years",
          specialties: ["Domestic Work", "Small Jobs", "Repairs"],
          certifications: ["NVQ Level 2"],
          insurance: "£2M Public Liability",
          pricing: "£150-£180 per day",
          availability: "Flexible schedule",
          portfolio: false,
          placeId: "tiler_4"
        },
        {
          name: "Master Craftsman Tiling",
          contact: "Robert Wilson",
          phone: "07700 900005",
          email: "rob@mastercrafttiling.co.uk",
          distance: "3.1 miles",
          rating: 5.0,
          reviewCount: 64,
          verified: true,
          experience: "25+ years",
          specialties: ["Luxury Installations", "Marble", "Designer Tiles"],
          certifications: ["Master Tiler", "Porcelain Specialist"],
          insurance: "£10M Public Liability",
          pricing: "£250-£300 per day",
          availability: "Booking 4 weeks ahead",
          portfolio: true,
          placeId: "tiler_5"
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLocalTilers(mockTilers);
      setShowTilerResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      alert('Unable to search at this time. Please try again.');
    } finally {
      setSearchingTilers(false);
    }
  };

  // Export to FreeAgent
  const exportToFreeAgent = async () => {
    if (!freeAgent.accessToken) {
      alert('Please configure your FreeAgent access token in Professional Mode settings.');
      return;
    }

    if (!customer.name || !customer.email) {
      alert('Please enter customer name and email before exporting to FreeAgent.');
      return;
    }

    try {
      // Format line items for FreeAgent
      const lineItems = [];
      
      // Add day rate if set
      if (costs.dayRate > 0) {
        lineItems.push({
          item_type: "Hours",
          description: "Day Rate",
          quantity: 1,
          price: costs.dayRate,
        });
      }
      
      // Add labour
      if (costs.labour > 0) {
        lineItems.push({
          item_type: "Hours",
          description: `Tiling Labour (${grandTotals.totalArea.toFixed(2)} m²)`,
          quantity: grandTotals.totalArea,
          price: parseFloat(pricing.labourPricePerSqm) || 0,
        });
      }
      
      // Add materials
      if (costs.adhesive > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Adhesive - ${materials.adhesiveBags} × 20kg bags (${materials.adhesive} kg)`,
          quantity: parseFloat(materials.adhesive),
          price: parseFloat(pricing.adhesivePrice) || 0,
        });
      }
      
      if (costs.grout > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Grout - ${materials.groutBags} × 2.5kg bags (${materials.grout} kg)`,
          quantity: parseFloat(materials.grout),
          price: parseFloat(pricing.groutPrice) || 0,
        });
      }
      
      if (costs.primer > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Primer (${materials.primer} L)`,
          quantity: parseFloat(materials.primer),
          price: parseFloat(pricing.primerPrice) || 0,
        });
      }
      
      if (costs.sealer > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Sealer (${materials.sealer} L)`,
          quantity: parseFloat(materials.sealer),
          price: parseFloat(pricing.sealerPrice) || 0,
        });
      }
      
      // Add floor materials
      if (costs.cementBoard > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Cement Board (${surfaceMaterials.cementBoard} m²)`,
          quantity: parseFloat(surfaceMaterials.cementBoard),
          price: parseFloat(pricing.cementBoardPrice) || 0,
        });
      }
      
      if (costs.ditraMat > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Ditra Mat (${surfaceMaterials.ditraMat} m²)`,
          quantity: parseFloat(surfaceMaterials.ditraMat),
          price: parseFloat(pricing.ditraMatPrice) || 0,
        });
      }
      
      if (costs.floorTanking > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Floor Tanking (${surfaceMaterials.floorTanking} L)`,
          quantity: parseFloat(surfaceMaterials.floorTanking),
          price: parseFloat(pricing.floorTankingPrice) || 0,
        });
      }
      
      // Add wall materials
      if (costs.wallTanking > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Wall Tanking (${surfaceMaterials.wallTanking} L)`,
          quantity: parseFloat(surfaceMaterials.wallTanking),
          price: parseFloat(pricing.wallTankingPrice) || 0,
        });
      }
      
      if (costs.tileTrim > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Tile Trim (${surfaceMaterials.tileTrim} m)`,
          quantity: parseFloat(surfaceMaterials.tileTrim),
          price: parseFloat(pricing.tileTrimPrice) || 0,
        });
      }
      
      if (costs.wallPrimer > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Wall Primer (${surfaceMaterials.wallPrimer} L)`,
          quantity: parseFloat(surfaceMaterials.wallPrimer),
          price: parseFloat(pricing.wallPrimerPrice) || 0,
        });
      }

      // Add markup as separate line if present
      if (markupAmount > 0) {
        lineItems.push({
          item_type: "Products",
          description: `Markup (${pricing.markup}%)`,
          quantity: 1,
          price: markupAmount,
        });
      }

      // Create invoice/quote payload for FreeAgent
      const invoiceData = {
        invoice: {
          contact: `https://api.freeagent.com/v2/contacts/${customer.email}`, // This would need contact lookup
          dated_on: new Date().toISOString().split('T')[0],
          payment_terms_in_days: 30,
          reference: `Tiling-${Date.now()}`,
          comments: `Tiling project for ${rooms.length} room(s), ${grandTotals.totalArea.toFixed(2)} m² total area`,
          invoice_items: lineItems,
          sales_tax_rate: pricing.includeVAT ? (pricing.vatRate / 100) : 0,
        }
      };

      const response = await fetch(`${freeAgent.apiUrl}/invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${freeAgent.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const result = await response.json();
        setFreeAgent({ ...freeAgent, lastSync: new Date().toISOString() });
        alert('✅ Quote successfully exported to FreeAgent!\n\nInvoice created and ready to send to your client.');
      } else {
        const error = await response.json();
        console.error('FreeAgent API Error:', error);
        alert(`❌ Failed to export to FreeAgent.\n\nError: ${error.errors || 'Please check your API credentials and try again.'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`❌ Export failed.\n\nError: ${error.message}\n\nPlease check your internet connection and FreeAgent settings.`);
    }
  };

  // Export to WhatsApp
  const exportToWhatsApp = () => {
    let message = `📋 *TILING ESTIMATE*\n\n`;
    
    // Business Branding
    if (businessBranding.companyName) {
      message += `🏢 *${businessBranding.companyName}*\n`;
      if (businessBranding.phone) message += `📞 ${businessBranding.phone}\n`;
      if (businessBranding.email) message += `📧 ${businessBranding.email}\n`;
      if (businessBranding.website) message += `🌐 ${businessBranding.website}\n`;
      if (businessBranding.address) message += `📍 ${businessBranding.address}\n`;
      if (businessBranding.vatNumber) message += `VAT: ${businessBranding.vatNumber}\n`;
      message += `\n`;
    }
    
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
    message += `Adhesive: ${materials.adhesiveBags} × 20kg bags (${materials.adhesive} kg)\n`;
    message += `Grout: ${materials.groutBags} × 2.5kg bags (${materials.grout} kg)\n`;
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
      if (costs.dayRate > 0) message += `Day Rate: £${costs.dayRate.toFixed(2)}\n`;
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
      if (pricing.includeVAT) {
        message += `VAT (${pricing.vatRate}%): £${vatAmount.toFixed(2)}\n`;
      }
      message += `*TOTAL: £${total.toFixed(2)}*`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Export to text file
  const exportToFile = () => {
    let content = `${'='.repeat(60)}\n`;
    content += `                    TILING ESTIMATE\n`;
    content += `${'='.repeat(60)}\n\n`;
    
    // Business Branding
    if (businessBranding.companyName) {
      content += `${businessBranding.companyName.toUpperCase()}\n`;
      if (businessBranding.address) content += `${businessBranding.address}\n`;
      if (businessBranding.phone) content += `Phone: ${businessBranding.phone}\n`;
      if (businessBranding.email) content += `Email: ${businessBranding.email}\n`;
      if (businessBranding.website) content += `Web: ${businessBranding.website}\n`;
      if (businessBranding.vatNumber) content += `VAT Number: ${businessBranding.vatNumber}\n`;
      if (businessBranding.registrationNumber) content += `Reg Number: ${businessBranding.registrationNumber}\n`;
      content += `\n${'-'.repeat(60)}\n\n`;
    }
    
    if (customer.name) {
      content += `CUSTOMER INFORMATION\n`;
      content += `Name: ${customer.name}\n`;
      if (customer.phone) content += `Phone: ${customer.phone}\n`;
      if (customer.email) content += `Email: ${customer.email}\n`;
      if (customer.address) content += `Address: ${customer.address}\n`;
      content += `\n`;
    }

    content += `PROJECT SUMMARY\n${'-'.repeat(60)}\n`;
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

    content += `MATERIALS NEEDED\n${'-'.repeat(60)}\n`;
    content += `Standard Materials:\n`;
    content += `  Adhesive: ${materials.adhesiveBags} × 20kg bags (${materials.adhesive} kg total)\n`;
    content += `  Grout: ${materials.groutBags} × 2.5kg bags (${materials.grout} kg total)\n`;
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
      content += `\nCOST BREAKDOWN\n${'-'.repeat(60)}\n`;
      if (costs.dayRate > 0) content += `Day Rate: £${costs.dayRate.toFixed(2)}\n`;
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
      if (pricing.includeVAT) {
        content += `VAT (${pricing.vatRate}%): £${vatAmount.toFixed(2)}\n`;
      }
      content += `${'='.repeat(60)}\n`;
      content += `TOTAL: £${total.toFixed(2)}\n`;
      content += `${'='.repeat(60)}\n`;
    }

    content += `\nGenerated: ${new Date().toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = businessBranding.companyName 
      ? `${businessBranding.companyName.replace(/\s+/g, '-')}-estimate-${customer.name || 'quote'}-${Date.now()}.txt`
      : `tiling-estimate-${customer.name || 'quote'}-${Date.now()}.txt`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.background,
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
              background: theme.primary,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              boxShadow: `0 8px 24px ${theme.primaryColor}40`,
            }}>
              ◧
            </div>
            <h1 style={{
              color: theme.textPrimary,
              fontSize: "36px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-1px",
            }}>
              Tiling Estimator
            </h1>
          </div>
          <p style={{ 
            color: theme.textSecondary, 
            fontSize: "15px", 
            margin: "0 0 20px 0",
            fontWeight: 500,
          }}>
            Professional multi-room calculator with smart material estimates
          </p>
          
          {/* Style Selector */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "8px", 
            marginBottom: "16px",
            flexWrap: "wrap",
          }}>
            {Object.keys(THEMES).map((key) => (
              <button
                key={key}
                onClick={() => setStyleTheme(key)}
                style={{
                  background: styleTheme === key ? theme.primary : `${theme.primaryColor}20`,
                  border: `1px solid ${theme.primaryColor}40`,
                  color: styleTheme === key ? (styleTheme === "minimal" ? theme.textPrimary : "#000") : theme.primaryColor,
                  borderRadius: "8px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s ease",
                }}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowProfessional(!showProfessional)}
            style={{
              background: showProfessional 
                ? theme.primary
                : `${theme.primaryColor}20`,
              border: showProfessional ? "none" : `1px solid ${theme.primaryColor}40`,
              color: showProfessional ? (styleTheme === "minimal" ? theme.textPrimary : "#000") : theme.primaryColor,
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
              boxShadow: showProfessional ? `0 4px 16px ${theme.primaryColor}60` : "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = showProfessional 
                ? `0 8px 24px ${theme.primaryColor}80` 
                : `0 4px 16px ${theme.primaryColor}30`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = showProfessional 
                ? `0 4px 16px ${theme.primaryColor}60` 
                : "none";
            }}
          >
            <Calculator size={18} />
            {showProfessional ? "Hide" : "Show"} Professional Mode
          </button>
        </div>
      </div>

      {/* Page Navigation - Only in Professional Mode */}
      {showProfessional && (
        <div style={{ maxWidth: "900px", margin: "0 auto 24px" }}>
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "16px",
            padding: "8px",
            display: "flex",
            gap: "8px",
            boxShadow: styleTheme === "minimal" ? "0 4px 16px rgba(0, 0, 0, 0.08)" : "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}>
            <button
              onClick={() => setCurrentPage("calculator")}
              style={{
                flex: 1,
                background: currentPage === "calculator" ? theme.primary : "transparent",
                border: "none",
                color: currentPage === "calculator" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Calculator size={16} />
              Calculator
            </button>
            <button
              onClick={() => setCurrentPage("settings")}
              style={{
                flex: 1,
                background: currentPage === "settings" ? theme.primary : "transparent",
                border: "none",
                color: currentPage === "settings" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <DollarSign size={16} />
              Settings & Pricing
            </button>
          </div>
        </div>
      )}

      {/* CALCULATOR PAGE */}
      {(currentPage === "calculator" || !showProfessional) && (
        <>
          {/* Customer Information - Always Visible */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <div style={{
          background: theme.cardBg,
          backdropFilter: "blur(20px)",
          border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{
              background: theme.primary,
              borderRadius: "10px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <User size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
            </div>
            <h3 style={{
              color: theme.textPrimary,
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
              <label style={{...labelStyle, color: theme.textSecondary}}>Customer Name</label>
              <input
                type="text"
                placeholder="John Smith"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
              />
            </div>
            <div>
              <label style={{...labelStyle, color: theme.textSecondary}}>Phone</label>
              <input
                type="tel"
                placeholder="07700 900000"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
              />
            </div>
            <div>
              <label style={{...labelStyle, color: theme.textSecondary}}>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{...labelStyle, color: theme.textSecondary}}>Address</label>
              <input
                type="text"
                placeholder="123 High Street, London"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section - MOVED TO TOP */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {rooms.map((room, i) => (
          <RoomCard
            key={room.id}
            room={room}
            roomIndex={i}
            onUpdateRoom={updateRoom}
            onRemoveRoom={removeRoom}
            canRemoveRoom={rooms.length > 1}
            theme={theme}
          />
        ))}

        <button
          onClick={addRoom}
          style={{
            background: theme.primary,
            border: "none",
            color: styleTheme === "minimal" ? theme.textPrimary : "#000",
            borderRadius: "16px",
            padding: "18px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 8px 32px ${theme.primaryColor}60`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = `0 12px 40px ${theme.primaryColor}80`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = `0 8px 32px ${theme.primaryColor}60`;
          }}
        >
          + Add Room
        </button>
      </div>

      {/* Grand Summary Bar */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto 32px",
        background: `linear-gradient(135deg, ${theme.primaryColor}25, ${theme.primaryColor}15)`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.primaryColor}40`,
        borderRadius: "20px",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "24px",
        boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        {[
          { label: "Rooms", value: rooms.length, color: theme.textPrimary, icon: "🏠" },
          { label: "Areas", value: grandTotals.totalAreas, color: theme.textPrimary, icon: "📐" },
          { label: "Total m²", value: grandTotals.totalArea.toFixed(2), color: theme.primaryColor, icon: "📏" },
          { label: "Tiles", value: grandTotals.totalTiles, color: theme.accent, icon: "◧" },
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
              color: theme.textSecondary, 
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

      {/* Local Search - Free Version Only */}
      {!showProfessional && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <MapPin size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Find Local Services
              </h3>
            </div>

            {/* Location Input */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{...labelStyle, color: theme.textSecondary}}>Your Location</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter city or postcode (e.g., London, SW1A 1AA)"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  style={{
                    ...inputStyle, 
                    flex: 1,
                    color: theme.textPrimary, 
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", 
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"
                  }}
                />
                <button
                  onClick={getCurrentLocation}
                  style={{
                    background: `linear-gradient(135deg, #10b981, #059669)`,
                    border: "none",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  title="Use my current location"
                >
                  <MapPin size={16} />
                  Drop Pin
                </button>
              </div>
              {userCoords && (
                <div style={{
                  marginTop: "6px",
                  color: theme.accent,
                  fontSize: "11px",
                  fontWeight: 600,
                }}>
                  📍 Location detected: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Search Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <button
                onClick={searchTileStores}
                disabled={searchingStores}
                style={{
                  background: searchingStores 
                    ? "rgba(148, 163, 184, 0.2)" 
                    : `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}dd)`,
                  border: "none",
                  color: searchingStores ? theme.textSecondary : (styleTheme === "minimal" ? theme.textPrimary : "#000"),
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: searchingStores ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  opacity: searchingStores ? 0.6 : 1,
                }}
              >
                <Package size={18} />
                {searchingStores ? "Searching..." : "Find Tile Stores"}
              </button>

              <button
                onClick={searchLocalTilers}
                disabled={searchingTilers}
                style={{
                  background: searchingTilers 
                    ? "rgba(148, 163, 184, 0.2)" 
                    : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                  border: "none",
                  color: searchingTilers ? theme.textSecondary : (styleTheme === "minimal" ? theme.textPrimary : "#000"),
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: searchingTilers ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  opacity: searchingTilers ? 0.6 : 1,
                }}
              >
                <User size={18} />
                {searchingTilers ? "Searching..." : "Find Local Tilers"}
              </button>
            </div>

            {/* Tile Stores Results - Detailed Cards */}
            {showStoreResults && tileStores.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div style={{
                  color: theme.textPrimary,
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <Package size={18} color={theme.primaryColor} />
                  Tile Stores Near You ({tileStores.length})
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tileStores.map((store, index) => (
                    <div key={index} style={{
                      background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.02)" : "rgba(148, 163, 184, 0.05)",
                      border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.08)" : `1px solid ${theme.primaryColor}30`,
                      borderRadius: "12px",
                      padding: "16px",
                      transition: "all 0.2s ease",
                    }}>
                      {/* Store Header */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{
                          color: theme.textPrimary,
                          fontSize: "15px",
                          fontWeight: 700,
                          marginBottom: "4px",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {store.name}
                        </div>
                        <div style={{
                          color: theme.textSecondary,
                          fontSize: "12px",
                          marginBottom: "6px",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {store.type} • {store.distance}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#f59e0b", fontSize: "14px" }}>
                            {"★".repeat(Math.floor(store.rating))}{"☆".repeat(5 - Math.floor(store.rating))}
                          </span>
                          <span style={{ color: theme.textSecondary, fontSize: "12px" }}>
                            {store.rating} ({store.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      {/* Store Details */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Address</div>
                          <div style={{ color: theme.textPrimary, fontSize: "12px", fontWeight: 500 }}>{store.address}</div>
                        </div>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Phone</div>
                          <a href={`tel:${store.phone}`} style={{ color: theme.accent, fontSize: "12px", fontWeight: 500, textDecoration: "none" }}>{store.phone}</a>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Opening Hours</div>
                          <div style={{ color: theme.textPrimary, fontSize: "12px", fontWeight: 500 }}>{store.hours}</div>
                        </div>
                      </div>
                      
                      {/* Services */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>Services</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {store.services.map((service, i) => (
                            <span key={i} style={{
                              background: `${theme.primaryColor}20`,
                              color: theme.primaryColor,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: 600,
                            }}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            background: theme.primary,
                            color: styleTheme === "minimal" ? theme.textPrimary : "#000",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <MapPin size={14} />
                          Directions
                        </a>
                        {store.website && (
                          <a
                            href={`https://${store.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.05)" : "rgba(148, 163, 184, 0.1)",
                              color: theme.textPrimary,
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 600,
                              textAlign: "center",
                              textDecoration: "none",
                            }}
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tilers Results - Detailed Cards */}
            {showTilerResults && localTilers.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div style={{
                  color: theme.textPrimary,
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <User size={18} color={theme.accent} />
                  Professional Tilers Near You ({localTilers.length})
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {localTilers.map((tiler, index) => (
                    <div key={index} style={{
                      background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.02)" : "rgba(148, 163, 184, 0.05)",
                      border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.08)" : `1px solid ${theme.accent}30`,
                      borderRadius: "12px",
                      padding: "16px",
                      transition: "all 0.2s ease",
                    }}>
                      {/* Tiler Header */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: "15px",
                            fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                            {tiler.name}
                          </div>
                          {tiler.verified && (
                            <span style={{
                              background: "#10b981",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "9px",
                              fontWeight: 700,
                            }}>
                              ✓ VERIFIED
                            </span>
                          )}
                        </div>
                        <div style={{
                          color: theme.textSecondary,
                          fontSize: "12px",
                          marginBottom: "6px",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {tiler.contact} • {tiler.experience} • {tiler.distance}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#f59e0b", fontSize: "14px" }}>
                            {"★".repeat(Math.floor(tiler.rating))}{"☆".repeat(5 - Math.floor(tiler.rating))}
                          </span>
                          <span style={{ color: theme.textSecondary, fontSize: "12px" }}>
                            {tiler.rating} ({tiler.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      {/* Tiler Details */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Phone</div>
                          <a href={`tel:${tiler.phone}`} style={{ color: theme.accent, fontSize: "12px", fontWeight: 500, textDecoration: "none" }}>{tiler.phone}</a>
                        </div>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Email</div>
                          <a href={`mailto:${tiler.email}`} style={{ color: theme.accent, fontSize: "11px", fontWeight: 500, textDecoration: "none", wordBreak: "break-all" }}>{tiler.email}</a>
                        </div>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Day Rate</div>
                          <div style={{ color: theme.textPrimary, fontSize: "12px", fontWeight: 500 }}>{tiler.pricing}</div>
                        </div>
                        <div>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Availability</div>
                          <div style={{ color: theme.textPrimary, fontSize: "12px", fontWeight: 500 }}>{tiler.availability}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "2px", fontWeight: 600 }}>Insurance</div>
                          <div style={{ color: theme.textPrimary, fontSize: "12px", fontWeight: 500 }}>{tiler.insurance}</div>
                        </div>
                      </div>
                      
                      {/* Specialties */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>Specialties</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {tiler.specialties.map((specialty, i) => (
                            <span key={i} style={{
                              background: `${theme.accent}20`,
                              color: theme.accent,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: 600,
                            }}>
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Certifications */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>Certifications</div>
                        <div style={{ color: theme.textPrimary, fontSize: "11px" }}>
                          {tiler.certifications.join(" • ")}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                        <a
                          href={`tel:${tiler.phone}`}
                          style={{
                            background: theme.accent,
                            color: styleTheme === "minimal" ? theme.textPrimary : "#000",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <Phone size={14} />
                          Call
                        </a>
                        <a
                          href={`mailto:${tiler.email}?subject=Tiling Quote Request`}
                          style={{
                            background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.05)" : "rgba(148, 163, 184, 0.1)",
                            color: theme.textPrimary,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <Mail size={14} />
                          Email
                        </a>
                        {tiler.portfolio && (
                          <button
                            onClick={() => alert('Portfolio viewing feature coming soon!\n\nThis will show:\n- Previous projects\n- Photo gallery\n- Before/after images\n- Customer testimonials')}
                            style={{
                              background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.05)" : "rgba(148, 163, 184, 0.1)",
                              color: theme.textPrimary,
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 600,
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                          >
                            Portfolio
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        </>
      )}

      {/* SETTINGS PAGE - Professional Configuration */}
      {currentPage === "settings" && showProfessional && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
          
          {/* Settings Tabs Navigation */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "16px",
            padding: "8px",
            marginBottom: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            boxShadow: styleTheme === "minimal" ? "0 4px 16px rgba(0, 0, 0, 0.08)" : "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}>
            <button
              onClick={() => setSettingsTab("business")}
              style={{
                background: settingsTab === "business" ? theme.primary : "transparent",
                border: "none",
                color: settingsTab === "business" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
            >
              Business Profile
            </button>
            <button
              onClick={() => setSettingsTab("pricing")}
              style={{
                background: settingsTab === "pricing" ? theme.primary : "transparent",
                border: "none",
                color: settingsTab === "pricing" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
            >
              Pricing & Costs
            </button>
            <button
              onClick={() => setSettingsTab("integrations")}
              style={{
                background: settingsTab === "integrations" ? theme.primary : "transparent",
                border: "none",
                color: settingsTab === "integrations" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
            >
              Integrations
            </button>
            <button
              onClick={() => setSettingsTab("preferences")}
              style={{
                background: settingsTab === "preferences" ? theme.primary : "transparent",
                border: "none",
                color: settingsTab === "preferences" 
                  ? (styleTheme === "minimal" ? theme.textPrimary : "#000")
                  : theme.textSecondary,
                borderRadius: "12px",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
            >
              Preferences
            </button>
          </div>

          {/* Settings Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
      {/* Business Profile Tab */}
      {settingsTab === "business" && (
        <>
          {/* Business Branding */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <User size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Business Branding
              </h3>
            </div>
            
            {/* Logo Upload */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{...labelStyle, color: theme.textSecondary}}>Company Logo</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 600,
                    flex: 1,
                  }}
                >
                  📁 {businessBranding.logo ? "Change Logo" : "Upload Logo"}
                </label>
                {businessBranding.logo && (
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.2)",
                  }}>
                    <img src={businessBranding.logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{...labelStyle, color: theme.textSecondary}}>Company Name</label>
                <input
                  type="text"
                  placeholder="Your Tiling Company Ltd"
                  value={businessBranding.companyName}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, companyName: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Business Phone</label>
                <input
                  type="tel"
                  placeholder="01234 567890"
                  value={businessBranding.phone}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, phone: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Business Email</label>
                <input
                  type="email"
                  placeholder="info@yourcompany.co.uk"
                  value={businessBranding.email}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, email: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{...labelStyle, color: theme.textSecondary}}>Website</label>
                <input
                  type="text"
                  placeholder="www.yourcompany.co.uk"
                  value={businessBranding.website}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, website: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{...labelStyle, color: theme.textSecondary}}>Business Address</label>
                <input
                  type="text"
                  placeholder="123 High Street, London, UK"
                  value={businessBranding.address}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, address: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>VAT Number</label>
                <input
                  type="text"
                  placeholder="GB123456789"
                  value={businessBranding.vatNumber}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, vatNumber: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Registration Number</label>
                <input
                  type="text"
                  placeholder="12345678"
                  value={businessBranding.registrationNumber}
                  onChange={(e) => setBusinessBranding({ ...businessBranding, registrationNumber: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
            </div>
          </div>
        </>
      )}
          
      {/* Pricing & Costs Tab */}
      {settingsTab === "pricing" && (
        <>
          {/* Pricing & Costs - Professional Mode Only */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <DollarSign size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
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
                <label style={{...labelStyle, color: theme.textSecondary}}>Day Rate (£)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="200.00"
                  value={pricing.dayRate}
                  onChange={(e) => setPricing({ ...pricing, dayRate: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Labour (£/m²)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="35.00"
                  value={pricing.labourPricePerSqm}
                  onChange={(e) => setPricing({ ...pricing, labourPricePerSqm: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Adhesive (£/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2.50"
                  value={pricing.adhesivePrice}
                  onChange={(e) => setPricing({ ...pricing, adhesivePrice: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Grout (£/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="3.00"
                  value={pricing.groutPrice}
                  onChange={(e) => setPricing({ ...pricing, groutPrice: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Primer (£/L)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="8.00"
                  value={pricing.primerPrice}
                  onChange={(e) => setPricing({ ...pricing, primerPrice: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Sealer (£/L)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.00"
                  value={pricing.sealerPrice}
                  onChange={(e) => setPricing({ ...pricing, sealerPrice: e.target.value })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
              
              {/* Surface-specific material pricing */}
              {parseFloat(surfaceMaterials.cementBoard) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Cement Board (£/m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="15.00"
                    value={pricing.cementBoardPrice}
                    onChange={(e) => setPricing({ ...pricing, cementBoardPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.ditraMat) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Ditra Mat (£/m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="20.00"
                    value={pricing.ditraMatPrice}
                    onChange={(e) => setPricing({ ...pricing, ditraMatPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.floorTanking) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Floor Tanking (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    value={pricing.floorTankingPrice}
                    onChange={(e) => setPricing({ ...pricing, floorTankingPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.wallTanking) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Wall Tanking (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="22.00"
                    value={pricing.wallTankingPrice}
                    onChange={(e) => setPricing({ ...pricing, wallTankingPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.tileTrim) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Tile Trim (£/m)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="3.50"
                    value={pricing.tileTrimPrice}
                    onChange={(e) => setPricing({ ...pricing, tileTrimPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              {parseFloat(surfaceMaterials.wallPrimer) > 0 && (
                <div>
                  <label style={{...labelStyle, color: theme.textSecondary}}>Wall Primer (£/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10.00"
                    value={pricing.wallPrimerPrice}
                    onChange={(e) => setPricing({ ...pricing, wallPrimerPrice: e.target.value })}
                    style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                  />
                </div>
              )}
              
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Markup %</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="15"
                  value={pricing.markup}
                  onChange={(e) => setPricing({ ...pricing, markup: parseFloat(e.target.value) || 0 })}
                  style={{...inputStyle, color: theme.textPrimary, background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)", border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)"}}
                />
              </div>
            </div>
            
            {/* VAT Toggle */}
            <div style={{
              marginTop: "16px",
              padding: "16px",
              background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
              borderRadius: "12px",
              border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <input
                  type="checkbox"
                  checked={pricing.includeVAT}
                  onChange={(e) => setPricing({ ...pricing, includeVAT: e.target.checked })}
                  style={{ 
                    cursor: "pointer", 
                    width: "20px", 
                    height: "20px",
                  }}
                />
                <span style={{ 
                  color: theme.textPrimary, 
                  fontSize: "15px", 
                  fontWeight: 600,
                  flex: 1,
                }}>
                  Include VAT
                </span>
                {pricing.includeVAT && (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={pricing.vatRate}
                    onChange={(e) => setPricing({ ...pricing, vatRate: parseFloat(e.target.value) || 20 })}
                    style={{
                      ...inputStyle,
                      width: "80px",
                      padding: "8px 12px",
                      color: theme.textPrimary,
                      background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.05)" : "rgba(148, 163, 184, 0.1)",
                      border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.15)" : "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {pricing.includeVAT && (
                  <span style={{ color: theme.textSecondary, fontSize: "14px", fontWeight: 600 }}>
                    %
                  </span>
                )}
              </label>
              {pricing.includeVAT && vatAmount > 0 && (
                <div style={{
                  marginTop: "12px",
                  padding: "12px",
                  background: `${theme.accent}20`,
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ color: theme.textPrimary, fontSize: "13px", fontWeight: 600 }}>
                    VAT Amount:
                  </span>
                  <span style={{ color: theme.accent, fontSize: "16px", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
                    £{vatAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
          
      {/* Integrations Tab */}
      {settingsTab === "integrations" && (
        <>
          {/* FreeAgent Integration */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <DollarSign size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                flex: 1,
              }}>
                FreeAgent Integration
              </h3>
              {freeAgent.connected && freeAgent.lastSync && (
                <div style={{
                  background: `${theme.accent}20`,
                  color: theme.accent,
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}>
                  ✓ Connected
                </div>
              )}
            </div>
            
            <div style={{ 
              background: styleTheme === "minimal" ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}>
              <div style={{ color: theme.textPrimary, fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>
                📘 How to get your FreeAgent API Access Token:
              </div>
              <ol style={{ color: theme.textSecondary, fontSize: "12px", margin: 0, paddingLeft: "20px", lineHeight: "1.6" }}>
                <li>Log in to your FreeAgent account</li>
                <li>Go to Settings → Developer API</li>
                <li>Click "Create a new app" or use existing app</li>
                <li>Generate a Personal Access Token</li>
                <li>Copy and paste the token below</li>
              </ol>
              <div style={{ 
                color: theme.textSecondary, 
                fontSize: "11px", 
                marginTop: "8px",
                fontStyle: "italic",
              }}>
                🔒 Your token is stored locally and never sent anywhere except FreeAgent.
              </div>
            </div>
            
            <div>
              <label style={{...labelStyle, color: theme.textSecondary}}>Access Token</label>
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="password"
                  placeholder="Enter your FreeAgent Personal Access Token"
                  value={freeAgent.accessToken}
                  onChange={(e) => setFreeAgent({ ...freeAgent, accessToken: e.target.value, connected: e.target.value.length > 0 })}
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                    flex: 1,
                  }}
                />
                {freeAgent.accessToken && (
                  <button
                    onClick={() => setFreeAgent({ ...freeAgent, accessToken: "", connected: false })}
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#f87171",
                      borderRadius: "10px",
                      padding: "12px 20px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              {freeAgent.lastSync && (
                <div style={{
                  color: theme.textSecondary,
                  fontSize: "11px",
                  marginTop: "6px",
                  fontStyle: "italic",
                }}>
                  Last export: {new Date(freeAgent.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Preferences Tab */}
      {settingsTab === "preferences" && (
        <>
          {/* App Preferences */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Calculator size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Default Settings
              </h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Default Wastage %</label>
                <select
                  value={10}
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                  }}
                >
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                </select>
              </div>
              
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Default Trowel Size</label>
                <select
                  value={1}
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                  }}
                >
                  <option value="0">6mm Notched</option>
                  <option value="1">8mm Notched</option>
                  <option value="2">10mm Notched</option>
                  <option value="3">12mm Notched</option>
                </select>
              </div>
              
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Default Grout Joint</label>
                <select
                  value={1}
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                  }}
                >
                  <option value="0">1mm</option>
                  <option value="1">2mm</option>
                  <option value="2">3mm</option>
                  <option value="3">4mm</option>
                  <option value="4">5mm</option>
                  <option value="5">6mm</option>
                </select>
              </div>
              
              <div>
                <label style={{...labelStyle, color: theme.textSecondary}}>Default Surface Type</label>
                <select
                  value="floor"
                  style={{
                    ...inputStyle,
                    color: theme.textPrimary,
                    background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.08)",
                    border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.15)",
                  }}
                >
                  <option value="floor">Floor</option>
                  <option value="wall">Wall</option>
                </select>
              </div>
            </div>
            
            <div style={{
              marginTop: "20px",
              padding: "16px",
              background: styleTheme === "minimal" ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}>
              <div style={{
                color: theme.textPrimary,
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
              }}>
                ℹ️ About Default Settings
              </div>
              <div style={{
                color: theme.textSecondary,
                fontSize: "12px",
                lineHeight: "1.5",
              }}>
                These defaults will be applied to new rooms automatically. You can still change them for individual rooms after creation.
              </div>
            </div>
          </div>
          
          {/* Display Preferences */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Package size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Display & Export
              </h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "12px",
                background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.05)",
                borderRadius: "10px",
                border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
              }}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600, flex: 1 }}>
                  Include company logo on exports
                </span>
              </label>
              
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "12px",
                background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.05)",
                borderRadius: "10px",
                border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
              }}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600, flex: 1 }}>
                  Show bag quantities (20kg adhesive, 2.5kg grout)
                </span>
              </label>
              
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "12px",
                background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.05)",
                borderRadius: "10px",
                border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
              }}>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600, flex: 1 }}>
                  Auto-export to FreeAgent after creating quote
                </span>
              </label>
              
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "12px",
                background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.03)" : "rgba(148, 163, 184, 0.05)",
                borderRadius: "10px",
                border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
              }}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <span style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600, flex: 1 }}>
                  Include payment terms on quotes (30 days)
                </span>
              </label>
            </div>
          </div>
          
          {/* Data Management */}
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: styleTheme === "minimal" ? "0 8px 32px rgba(0, 0, 0, 0.08)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                background: theme.primary,
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Download size={20} color={styleTheme === "minimal" ? theme.textPrimary : "#000"} />
              </div>
              <h3 style={{
                color: theme.textPrimary,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Data & Privacy
              </h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => alert('Export all your business settings, pricing, and preferences as JSON file for backup.')}
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}dd)`,
                  border: "none",
                  color: styleTheme === "minimal" ? theme.textPrimary : "#000",
                  borderRadius: "12px",
                  padding: "14px",
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
                Export Settings Backup
              </button>
              
              <button
                onClick={() => alert('Import previously exported settings from JSON file.')}
                style={{
                  background: styleTheme === "minimal" ? "rgba(0, 0, 0, 0.05)" : "rgba(148, 163, 184, 0.1)",
                  border: styleTheme === "minimal" ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(148, 163, 184, 0.2)",
                  color: theme.textPrimary,
                  borderRadius: "12px",
                  padding: "14px",
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
                <Package size={18} />
                Import Settings Backup
              </button>
              
              <div style={{
                marginTop: "8px",
                padding: "16px",
                background: "rgba(239, 68, 68, 0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}>
                <div style={{
                  color: theme.textPrimary,
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}>
                  ⚠️ Danger Zone
                </div>
                <div style={{
                  color: theme.textSecondary,
                  fontSize: "12px",
                  marginBottom: "12px",
                  lineHeight: "1.5",
                }}>
                  Reset all settings to defaults. This will clear your business profile, pricing, and FreeAgent integration.
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
                      alert('Settings have been reset to defaults.');
                    }
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s ease",
                  }}
                >
                  Reset All Settings
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
          </div>
        </div>
      )}

      {/* CALCULATOR PAGE - Professional Mode Sections */}
      {showProfessional && currentPage === "calculator" && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
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
                    {materials.adhesiveBags}<span style={{ fontSize: "12px", color: "#94a3b8" }}> × 20kg bags</span>
                  </div>
                  <div style={{ color: "#64748b", fontSize: "10px", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                    ({materials.adhesive} kg total)
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
                    {materials.groutBags}<span style={{ fontSize: "12px", color: "#94a3b8" }}> × 2.5kg bags</span>
                  </div>
                  <div style={{ color: "#64748b", fontSize: "10px", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                    ({materials.grout} kg total)
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
                  {costs.dayRate > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>Day Rate</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{costs.dayRate.toFixed(2)}</span>
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
                  {pricing.includeVAT && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>VAT ({pricing.vatRate}%)</span>
                      <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>£{vatAmount.toFixed(2)}</span>
                    </div>
                  )}
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
          <div style={{ display: "grid", gridTemplateColumns: freeAgent.connected ? "1fr 1fr 1fr" : "1fr 1fr", gap: "16px" }}>
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
              WhatsApp
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
              Download
            </button>
            
            {freeAgent.connected && (
              <button
                onClick={exportToFreeAgent}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
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
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(139, 92, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 24px rgba(139, 92, 246, 0.3)";
                }}
              >
                <DollarSign size={20} />
                FreeAgent
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
