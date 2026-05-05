'use client'
import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:        "#00387B",
  blue:        "#1470B1",
  blueLight:   "#E8F2FA",
  orange:      "#ED6E02",
  orangeLight: "#FEF3E8",
  green:       "#B1C638",
  red:         "#D63B3B",
  redLight:    "#FDF0F0",
  border:      "#E2E8F0",
  textPrimary: "#0F1C2E",
  textMuted:   "#6B7280",
  canvas:      "#FFFFFF",
  surface2:    "#F2F4F7",
  wire:        "#94A3B8",
  wireMandatory: "#1470B1",
};

// ─── COMPONENT LAYOUT CONFIG ──────────────────────────────────────────────────
// Positions are in the SVG coordinate space (viewBox 0 0 680 520)
// Power supply is the central hub at bottom centre
// All other components connect to it with cable paths

const POWER_SUPPLY_POS = { x: 340, y: 430, w: 100, h: 44 };

const COMPONENT_POSITIONS = {
  "comp-1":   { x: 340, y: 430, w: 100, h: 44, zone: "center",  label: "PSU" },   // power supply = hub
  "comp-2":   { x: 100, y: 300, w: 90,  h: 40, zone: "left",    label: "E-Open" },
  "comp-3":   { x: 100, y: 200, w: 90,  h: 40, zone: "left",    label: "Bolt Sw." },
  "comp-4":   { x: 490, y: 300, w: 90,  h: 40, zone: "right",   label: "Cable" },
  "comp-5":   { x: 220, y: 100, w: 90,  h: 40, zone: "top",     label: "Flatscan" },
  "comp-5-1": { x: 340, y: 60,  w: 90,  h: 36, zone: "top",     label: "Sensor" },
  "comp-6":   { x: 490, y: 180, w: 90,  h: 40, zone: "right",   label: "Flip Sw." },
  "comp-6-1": { x: 490, y: 110, w: 90,  h: 36, zone: "right",   label: "Flip Out" },
  "comp-7":   { x: 100, y: 110, w: 90,  h: 40, zone: "left",    label: "Radar In" },
  "comp-7-1": { x: 220, y: 60,  w: 90,  h: 36, zone: "top",     label: "Radar Out" },
  "comp-8":   { x: 490, y: 390, w: 90,  h: 40, zone: "right",   label: "Prog. Sw." },
  "comp-9":   { x: 340, y: 300, w: 90,  h: 40, zone: "center",  label: "Release" },
  "comp-11":  { x: 100, y: 390, w: 90,  h: 40, zone: "left",    label: "Smoke 1" },
  "comp-12":  { x: 220, y: 390, w: 90,  h: 40, zone: "bottom",  label: "Smoke 2" },
};

// Door frame geometry
const DOOR = {
  single: {
    frame: { x: 240, y: 130, w: 200, h: 270 },
    leaf:  { x: 244, y: 134, w: 192, h: 262 },
    handle:{ x: 415, y: 265, r: 6 },
    hinge1:{ x: 248, y: 160 },
    hinge2:{ x: 248, y: 370 },
  },
  double: {
    frame:  { x: 170, y: 130, w: 340, h: 270 },
    leaf1:  { x: 174, y: 134, w: 163, h: 262 },
    leaf2:  { x: 341, y: 134, w: 163, h: 262 },
    handle1:{ x: 328, y: 265, r: 6 },
    handle2:{ x: 350, y: 265, r: 6 },
    hinge1: { x: 178, y: 160 },
    hinge2: { x: 178, y: 370 },
    hinge3: { x: 500, y: 160 },
    hinge4: { x: 500, y: 370 },
  },
};

// Icon shapes per component type (pure SVG primitives, no images)
const ICON_SHAPES = {
  power_supply:          (cx, cy) => <><rect x={cx-8} y={cy-8} width={16} height={16} rx={3} fill={C.navy} opacity={0.9}/><text x={cx} y={cy+5} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">P</text></>,
  e_opener:              (cx, cy) => <><rect x={cx-7} y={cy-9} width={14} height={18} rx={2} fill="none" stroke={C.blue} strokeWidth={1.5}/><circle cx={cx} cy={cy} r={3} fill={C.blue}/></>,
  bolt_switch:           (cx, cy) => <><circle cx={cx} cy={cy} r={8} fill="none" stroke={C.navy} strokeWidth={1.5}/><rect x={cx-3} y={cy-5} width={6} height={10} rx={1} fill={C.navy}/></>,
  cable_transition:      (cx, cy) => <><line x1={cx-8} y1={cy} x2={cx+8} y2={cy} stroke={C.blue} strokeWidth={2}/><circle cx={cx-8} cy={cy} r={3} fill={C.blue}/><circle cx={cx+8} cy={cy} r={3} fill={C.blue}/></>,
  sensor_strip:          (cx, cy) => <><ellipse cx={cx} cy={cy} rx={9} ry={6} fill="none" stroke={C.navy} strokeWidth={1.5}/><circle cx={cx} cy={cy} r={3} fill={C.navy}/></>,
  flip_switch:           (cx, cy) => <><rect x={cx-8} y={cy-7} width={16} height={14} rx={2} fill="none" stroke={C.blue} strokeWidth={1.5}/><line x1={cx-4} y1={cy} x2={cx+4} y2={cy} stroke={C.blue} strokeWidth={2} strokeLinecap="round"/></>,
  radar_sensor:          (cx, cy) => <><path d={`M${cx},${cy} A10,10 0 0,1 ${cx+10},${cy}`} fill="none" stroke={C.navy} strokeWidth={1.5}/><path d={`M${cx},${cy} A6,6 0 0,1 ${cx+6},${cy}`} fill="none" stroke={C.navy} strokeWidth={1.5}/><circle cx={cx} cy={cy} r={2.5} fill={C.navy}/></>,
  program_switch:        (cx, cy) => <><rect x={cx-8} y={cy-8} width={16} height={16} rx={2} fill="none" stroke={C.blue} strokeWidth={1.5}/><circle cx={cx-3} cy={cy-2} r={2} fill={C.blue}/><circle cx={cx+3} cy={cy+2} r={2} fill={C.blue}/></>,
  manual_release_button: (cx, cy) => <><rect x={cx-9} y={cy-9} width={18} height={18} rx={3} fill={C.redLight} stroke={C.red} strokeWidth={1.5}/><circle cx={cx} cy={cy} r={5} fill={C.red}/></>,
  smoke_detector:        (cx, cy) => <><circle cx={cx} cy={cy} r={9} fill="none" stroke={C.navy} strokeWidth={1.5}/><circle cx={cx} cy={cy} r={4} fill={C.navy} opacity={0.4}/><line x1={cx} y1={cy-12} x2={cx} y2={cy-16} stroke={C.navy} strokeWidth={1.5}/><line x1={cx+8} y1={cy-8} x2={cx+11} y2={cy-11} stroke={C.navy} strokeWidth={1.5}/><line x1={cx-8} y1={cy-8} x2={cx-11} y2={cy-11} stroke={C.navy} strokeWidth={1.5}/></>,
};

// ─── CABLE PATH LOGIC ─────────────────────────────────────────────────────────
// Generates an SVG path string from component centre to power supply
function getCablePath(compId, hubPos) {
  const pos = COMPONENT_POSITIONS[compId];
  if (!pos || compId === "comp-1") return null;

  const cx = pos.x + pos.w / 2;
  const cy = pos.y + pos.h / 2;
  const hx = hubPos.x + hubPos.w / 2;
  const hy = hubPos.y + hubPos.h / 2;

  // Use L-shaped routing to avoid crossing the door frame area
  // Door occupies roughly x:240-440, y:130-400
  const inDoorZone = (x, y) => x > 230 && x < 450 && y > 120 && y < 410;

  if (pos.zone === "left") {
    // Route: down then right
    const midY = Math.max(cy, hy - 20);
    return `M${cx+pos.w/2} ${cy} L${hx - 60} ${cy} L${hx - 60} ${hy} L${hx} ${hy}`;
  }
  if (pos.zone === "right") {
    const midY = cy;
    return `M${cx} ${cy} L${hx + 60} ${cy} L${hx + 60} ${hy} L${hx + pos.w/2} ${hy}`;
  }
  if (pos.zone === "top") {
    // Route up and around
    if (cx < hx) {
      return `M${cx + pos.w/2} ${cy + pos.h/2} L${cx + pos.w/2} ${hy - 20} L${hx} ${hy - 20} L${hx} ${hy}`;
    }
    return `M${cx} ${cy + pos.h/2} L${cx} ${hy - 20} L${hx + pos.w/2} ${hy - 20} L${hx + pos.w/2} ${hy}`;
  }
  if (pos.zone === "bottom") {
    return `M${cx} ${cy} L${hx} ${hy}`;
  }
  if (pos.zone === "center") {
    return `M${cx} ${cy + pos.h/2} L${hx + pos.w/2} ${hy}`;
  }
  return `M${cx} ${cy} L${hx} ${hy}`;
}

// ─── DOOR FRAME SVG ───────────────────────────────────────────────────────────
function DoorFrame({ leafType }) {
  const isDouble = leafType === "double-leaf";
  const d = isDouble ? DOOR.double : DOOR.single;

  return (
    <g>
      <rect x={d.frame.x} y={d.frame.y} width={d.frame.w} height={d.frame.h}
        rx={4} fill="none" stroke={C.navy} strokeWidth={3} opacity={0.15}/>
      <line x1={d.frame.x} y1={d.frame.y + d.frame.h}
            x2={d.frame.x + d.frame.w} y2={d.frame.y + d.frame.h}
            stroke={C.navy} strokeWidth={4} opacity={0.2}/>
      {!isDouble && (
        <>
          <rect x={d.leaf.x} y={d.leaf.y} width={d.leaf.w} height={d.leaf.h}
            rx={2} fill={C.blueLight} stroke={C.navy} strokeWidth={1.5} opacity={0.5}/>
          <circle cx={d.handle.x} cy={d.handle.y} r={d.handle.r}
            fill="none" stroke={C.navy} strokeWidth={2} opacity={0.6}/>
          <rect x={d.handle.x - 2} y={d.handle.y - 12} width={4} height={24}
            rx={2} fill={C.navy} opacity={0.4}/>
          <rect x={d.hinge1.x} y={d.hinge1.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
          <rect x={d.hinge2.x} y={d.hinge2.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
        </>
      )}
      {isDouble && (
        <>
          <rect x={d.leaf1.x} y={d.leaf1.y} width={d.leaf1.w} height={d.leaf1.h}
            rx={2} fill={C.blueLight} stroke={C.navy} strokeWidth={1.5} opacity={0.5}/>
          <rect x={d.leaf2.x} y={d.leaf2.y} width={d.leaf2.w} height={d.leaf2.h}
            rx={2} fill={C.blueLight} stroke={C.navy} strokeWidth={1.5} opacity={0.5}/>
          <line x1={340} y1={d.leaf1.y} x2={340} y2={d.leaf1.y + d.leaf1.h}
            stroke={C.navy} strokeWidth={1} strokeDasharray="4 3" opacity={0.4}/>
          <rect x={d.hinge1.x} y={d.hinge1.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
          <rect x={d.hinge2.x} y={d.hinge2.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
          <rect x={d.hinge3.x} y={d.hinge3.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
          <rect x={d.hinge4.x} y={d.hinge4.y - 6} width={8} height={12} rx={2} fill={C.navy} opacity={0.4}/>
        </>
      )}
      <text x={d.frame.x + d.frame.w/2} y={d.frame.y + d.frame.h/2}
        textAnchor="middle" fontSize={11} fill={C.navy} opacity={0.25}
        fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="0.08em">
        {isDouble ? "DOUBLE-LEAF" : "SINGLE-LEAF"}
      </text>
    </g>
  );
}

// ─── COMPONENT NODE ───────────────────────────────────────────────────────────
function ComponentNode({ comp, state, position, isSelected, isHighlighted, onClick, system }) {
  const isMandatory = comp.mandatory ||
    (comp.conditions?.some(c => system[c.if?.property] === c.if?.equals && c.then?.mandatory) ?? false);
  const isIncluded = state?.included ?? true;

  if (!isIncluded) return null;

  const cx = position.x + position.w / 2;
  const cy = position.y + position.h / 2;
  const iconFn = ICON_SHAPES[comp.type];

  const borderColor = isSelected ? C.orange :
                      isMandatory ? C.red :
                      isHighlighted ? C.blue : C.border;
  const bgColor = isSelected ? C.orangeLight :
                  isMandatory ? C.redLight :
                  C.canvas;
  const borderWidth = isSelected ? 2 : 1.5;

  return (
    <g onClick={() => onClick(comp.id)} style={{ cursor: "pointer" }}>
      {/* Highlight ring when selected */}
      {isSelected && (
        <rect x={position.x - 4} y={position.y - 4}
          width={position.w + 8} height={position.h + 8}
          rx={10} fill="none" stroke={C.orange} strokeWidth={2} opacity={0.3}/>
      )}

      {/* Card */}
      <rect x={position.x} y={position.y} width={position.w} height={position.h}
        rx={7} fill={bgColor} stroke={borderColor} strokeWidth={borderWidth}
        style={{ filter: isSelected ? "drop-shadow(0 2px 8px rgba(237,110,2,0.3))" : "none" }}/>

      {/* Icon */}
      {iconFn && iconFn(cx - 18, cy)}

      {/* Label */}
      <text x={cx + 4} y={cy - 3} textAnchor="middle" fontSize={10}
        fontFamily="DM Sans, sans-serif" fontWeight="600"
        fill={isSelected ? C.orange : isMandatory ? C.red : C.textPrimary}>
        {position.label}
      </text>

      {/* Position badge */}
      <text x={position.x + position.w - 6} y={position.y + 12}
        textAnchor="end" fontSize={9} fontFamily="DM Mono, monospace"
        fill={isSelected ? C.orange : C.textMuted}>
        {comp.position}
      </text>
    </g>
  );
}

// ─── CABLE LINE ───────────────────────────────────────────────────────────────
function CableLine({ comp, state, system, isSelected }) {
  const isMandatory = comp.mandatory ||
    (comp.conditions?.some(c => system[c.if?.property] === c.if?.equals && c.then?.mandatory) ?? false);
  const isIncluded = state?.included;

  if (!isIncluded || comp.id === "comp-1") return null;

  const pathD = getCablePath(comp.id, POWER_SUPPLY_POS);
  if (!pathD) return null;

  const pos = COMPONENT_POSITIONS[comp.id];
  const cable = state?.isOther ? `Other: ${state?.otherValue || "?"}` : (state?.selectedCable || comp.cable?.defaultCable || "");

  // Label position — midpoint of the path segment
  const labelX = (COMPONENT_POSITIONS[comp.id].x + COMPONENT_POSITIONS[comp.id].w/2 + POWER_SUPPLY_POS.x + POWER_SUPPLY_POS.w/2) / 2;
  const labelY = (COMPONENT_POSITIONS[comp.id].y + COMPONENT_POSITIONS[comp.id].h/2 + POWER_SUPPLY_POS.y + POWER_SUPPLY_POS.h/2) / 2;

  const strokeColor = isSelected ? C.orange : isMandatory ? C.wireMandatory : C.wire;
  const strokeWidth = isSelected ? 2 : 1;
  const dashArray = isSelected ? "none" : "5 4";

  return (
    <g>
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}
        strokeDasharray={dashArray} strokeLinecap="round" strokeLinejoin="round"
        opacity={isSelected ? 1 : 0.5}/>

      {/* Cable label */}
      {cable && (
        <>
          <rect x={labelX - cable.length * 3 - 4} y={labelY - 9}
            width={cable.length * 6 + 8} height={14} rx={3}
            fill="white" stroke={strokeColor} strokeWidth={0.5} opacity={0.9}/>
          <text x={labelX} y={labelY + 1} textAnchor="middle"
            fontSize={8} fontFamily="DM Mono, monospace" fill={strokeColor}>
            {cable}
          </text>
        </>
      )}
    </g>
  );
}

// ─── MAIN WIRING DIAGRAM ──────────────────────────────────────────────────────
export default function WiringDiagram({ system, componentStates }) {
  const [selectedId, setSelectedId] = useState(null);

  if (!system) {
    return (
      <div style={{ background: "#F8F9FA", border: `1px solid ${C.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 15, color: C.textMuted, fontFamily: "DM Sans, sans-serif" }}>
          Select a door system to view the wiring diagram
        </div>
      </div>
    );
  }

  const selectedComp = selectedId
    ? [...system.components, ...(system.components.flatMap(c => c.subComponents || []))].find(c => c.id === selectedId)
    : null;

  const selectedState = selectedId ? componentStates[selectedId] : null;

  // Build flat list of all components
  const allComps = [];
  system.components.forEach(c => {
    allComps.push(c);
    if (c.subComponents) c.subComponents.forEach(s => allComps.push(s));
  });

  const handleClick = (id) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1470B1", marginBottom: 4 }}>
            Wiring Diagram
          </div>
          <div style={{ fontSize: 13, color: C.textMuted }}>
            {system.name} · {system.leafType} {system.isFireDoor ? "· Fire Door" : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 11, color: C.textMuted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke={C.wireMandatory} strokeWidth={1.5}/></svg>
            Mandatory
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke={C.wire} strokeWidth={1} strokeDasharray="4 3"/></svg>
            Optional
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14"><rect x="1" y="1" width="12" height="12" rx="3" fill="none" stroke={C.orange} strokeWidth={1.5}/></svg>
            Selected
          </span>
        </div>
      </div>

      {/* SVG Diagram */}
      <div style={{ background: C.canvas, border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,56,123,0.06)" }}>
        <svg
          width="100%"
          viewBox="0 0 680 510"
          role="img"
          style={{ display: "block" }}
        >
          <title>MF Services Cable Wiring Diagram — {system.name}</title>
          <desc>Interactive wiring diagram showing cable connections between door system components</desc>

          {/* Grid pattern background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={C.border} strokeWidth={0.3}/>
            </pattern>
          </defs>
          <rect width="680" height="510" fill="url(#grid)" opacity={0.6}/>

          {/* Door Frame */}
          <DoorFrame leafType={system.leafType} />

          {/* Cable lines (drawn BEHIND components) */}
          {allComps.map(comp => {
            const state = componentStates[comp.id];
            if (!state?.included || comp.id === "comp-1") return null;
            return (
              <CableLine
                key={`cable-${comp.id}`}
                comp={comp}
                state={state}
                system={system}
                isSelected={selectedId === comp.id}
              />
            );
          })}

          {/* Component nodes */}
          {allComps.map(comp => {
            const pos = COMPONENT_POSITIONS[comp.id];
            const state = componentStates[comp.id];
            if (!pos || !state?.included) return null;
            return (
              <ComponentNode
                key={comp.id}
                comp={comp}
                state={state}
                position={pos}
                isSelected={selectedId === comp.id}
                isHighlighted={false}
                onClick={handleClick}
                system={system}
              />
            );
          })}

          {/* Title */}
          <text x={340} y={497} textAnchor="middle" fontSize={10}
            fontFamily="DM Sans, sans-serif" fill={C.textMuted} letterSpacing="0.04em">
            Click any component to highlight its cable run
          </text>
        </svg>
      </div>

      {/* Selected component detail panel */}
      {selectedComp && selectedState && (
        <div style={{ marginTop: 16, background: C.orangeLight, border: `1.5px solid #FCD9B0`, borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, marginBottom: 4 }}>
                Position {selectedComp.position} — {selectedComp.label}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
                {selectedComp.type.replace(/_/g, " ")}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 12, background: "white", border: `1px solid #FCD9B0`, borderRadius: 6, padding: "3px 10px", color: C.orange }}>
                  {selectedState.isOther ? `Other: ${selectedState.otherValue || "unspecified"}` : selectedState.selectedCable}
                </span>
                {selectedState.userRemarks && (
                  <span style={{ fontSize: 12, color: C.textMuted, padding: "3px 0" }}>
                    📝 {selectedState.userRemarks}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setSelectedId(null)}
              style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1 }}>
              ✕
            </button>
          </div>
          {selectedComp.remarks && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.textMuted, borderTop: `1px solid #FCD9B0`, paddingTop: 10 }}>
              {selectedComp.remarks}
            </div>
          )}
        </div>
      )}
    </div>
  );
}