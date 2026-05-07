'use client'

export function ETS64RDiagram({ system, componentStates }) {
  // system and componentStates are available for future enhancements
  // (e.g., highlighting included/excluded components)
  return (
    <svg viewBox="0 0 760 320" preserveAspectRatio="xMidYMid meet" width="100%" height="auto" style={{ maxWidth: 800, margin: "0 auto", minHeight: 300 }} role="img" aria-label="ETS 64-R Single Leaf Fire Door System Diagram">

      <defs>
        <marker id="cableArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#1470B1" />
        </marker>
        <marker id="fireArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#ED6E02" />
        </marker>
      </defs>

      {/* DOOR FRAME */}
      {/* Left jamb */}
      <rect x="240" y="20" width="16" height="260" fill="#00387B" />
      {/* Right jamb */}
      <rect x="374" y="20" width="16" height="260" fill="#00387B" />
      {/* Top frame */}
      <rect x="240" y="20" width="150" height="14" fill="#00387B" />
      {/* Floor threshold */}
      <rect x="240" y="266" width="150" height="8" fill="#00387B" />

      {/* DOOR LEAF */}
      <rect x="252" y="34" width="136" height="232" fill="#FFFFFF" stroke="#00387B" strokeWidth="1.5" />
      
      {/* Glass panel lines (subtle vertical divisions) */}
      <line x1="318" y1="34" x2="318" y2="266" stroke="#00387B" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="286" y1="80" x2="378" y2="80" stroke="#00387B" strokeWidth="0.5" strokeOpacity="0.15" />
      <line x1="286" y1="140" x2="378" y2="140" stroke="#00387B" strokeWidth="0.5" strokeOpacity="0.15" />
      <line x1="286" y1="200" x2="378" y2="200" stroke="#00387B" strokeWidth="0.5" strokeOpacity="0.15" />

      {/* INTUMESCENT STRIP */}
      <line x1="252" y1="34" x2="252" y2="266" stroke="#ED6E02" strokeWidth="4" strokeOpacity="0.8" />

      {/* DOOR HANDLE */}
      <circle cx="370" cy="150" r="4" fill="#00387B" />
      <line x1="374" y1="150" x2="385" y2="150" stroke="#00387B" strokeWidth="3" strokeLinecap="round" />

      {/* FIRE DOOR BADGE */}
      <rect x="285" y="110" width="88" height="28" rx="4" fill="#ED6E02" fillOpacity="0.15" stroke="#ED6E02" strokeWidth="1.5" />
      <text x="329" y="131" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ED6E02" fontFamily="DM Sans, monospace">FIRE DOOR</text>

      {/* CABLE ROUTING */}
      {/* Main bus line along top frame */}
      <line x1="256" y1="26" x2="464" y2="26" stroke="#1470B1" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#cableArrow)" />

      {/* Vertical run down right side */}
      <line x1="464" y1="26" x2="464" y2="268" stroke="#1470B1" strokeWidth="2" strokeDasharray="4 3" />

      {/* Horizontal drops to right-side components */}
      <line x1="464" y1="75" x2="495" y2="75" stroke="#1470B1" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#cableArrow)" />
      <line x1="464" y1="155" x2="495" y2="155" stroke="#1470B1" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#cableArrow)" />
      <line x1="464" y1="240" x2="495" y2="240" stroke="#1470B1" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#cableArrow)" />

      {/* Fire alarm cable (orange) from left side */}
      <line x1="230" y1="26" x2="256" y2="26" stroke="#ED6E02" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#fireArrow)" />

      {/* COMPONENT CIRCLES */}
      {/* 1 — PWR (Mandatory) */}
      <circle cx="290" cy="45" r="18" fill="none" stroke="#ED6E02" strokeWidth="2.5" />
      <text x="290" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#00387B" fontFamily="monospace">1</text>
      <text x="290" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#00387B" fontFamily="sans-serif">PWR</text>

      {/* 2 — EOP (Mandatory) */}
      <circle cx="510" cy="75" r="18" fill="none" stroke="#ED6E02" strokeWidth="2.5" />
      <text x="510" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill="#00387B" fontFamily="monospace">2</text>
      <text x="510" y="98" textAnchor="middle" fontSize="10" fontWeight="600" fill="#00387B" fontFamily="sans-serif">EOP</text>

      {/* 3 — BLT (Mandatory) */}
      <circle cx="510" cy="155" r="18" fill="none" stroke="#ED6E02" strokeWidth="2.5" />
      <text x="510" y="160" textAnchor="middle" fontSize="12" fontWeight="700" fill="#00387B" fontFamily="monospace">3</text>
      <text x="510" y="178" textAnchor="middle" fontSize="10" fontWeight="600" fill="#00387B" fontFamily="sans-serif">BLT</text>

      {/* 5 — SNS (Mandatory) */}
      <circle cx="240" cy="170" r="18" fill="none" stroke="#ED6E02" strokeWidth="2.5" />
      <text x="240" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#00387B" fontFamily="monospace">5</text>
      <text x="240" y="193" textAnchor="middle" fontSize="10" fontWeight="600" fill="#00387B" fontFamily="sans-serif">SNS</text>

      {/* 5.1 — SUB (Optional) */}
      <circle cx="258" cy="230" r="16" fill="none" stroke="#1470B1" strokeWidth="2.5" />
      <text x="258" y="235" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1470B1" fontFamily="monospace">5.1</text>
      <text x="258" y="251" textAnchor="middle" fontSize="9" fontWeight="600" fill="#1470B1" fontFamily="sans-serif">SUB</text>

      {/* 9 — PRG (Optional) */}
      <circle cx="510" cy="240" r="18" fill="none" stroke="#1470B1" strokeWidth="2.5" />
      <text x="510" y="245" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1470B1" fontFamily="monospace">9</text>
      <text x="510" y="263" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1470B1" fontFamily="sans-serif">PRG</text>

      {/* MRB FIRE (Mandatory) */}
      <circle cx="290" cy="285" r="18" fill="none" stroke="#ED6E02" strokeWidth="2.5" />
      <text x="290" y="287" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ED6E02" fontFamily="sans-serif">MRB</text>
      <text x="290" y="300" textAnchor="middle" fontSize="9" fontWeight="600" fill="#ED6E02" fontFamily="sans-serif">FIRE</text>

      {/* LEGEND */}
      <text x="230" y="312" fontSize="11" fontWeight="600" fill="#00387B" fontFamily="DM Sans, sans-serif">Legend:</text>

      {/* Mandatory legend */}
      <circle cx="315" cy="310" r="6" fill="none" stroke="#ED6E02" strokeWidth="2" />
      <text x="328" y="314" fontSize="10" fill="#00387B" fontFamily="DM Sans, sans-serif">Mandatory</text>

      {/* Optional legend */}
      <circle cx="445" cy="310" r="6" fill="none" stroke="#1470B1" strokeWidth="2" />
      <text x="458" y="314" fontSize="10" fill="#00387B" fontFamily="DM Sans, sans-serif">Optional</text>

      {/* Fire cable legend */}
      <line x1="585" y1="310" x2="605" y2="310" stroke="#ED6E02" strokeWidth="2" strokeDasharray="3 2" />
      <text x="615" y="314" fontSize="10" fill="#00387B" fontFamily="DM Sans, sans-serif">Fire Alarm Cable</text>
    </svg>
  );
}
