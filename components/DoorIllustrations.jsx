// MF Services — Door Type SVG Illustrations
// Clean technical line drawings for use in SpecGenerator step 1

export function AutomaticSlidingDoor() {
  return (
    <svg width="100%" viewBox="0 0 168 145" role="img">
      <title>Automatic Sliding Door</title>
      {/* Header track */}
      <rect x="20" y="30" width="128" height="10" rx="2" fill="#00387B" fillOpacity="0.12" stroke="#00387B" strokeWidth="0.8"/>
      {/* Header unit */}
      <rect x="34" y="20" width="100" height="18" rx="3" fill="#1470B1" fillOpacity="0.18" stroke="#1470B1" strokeWidth="1"/>
      <text x="84" y="32" textAnchor="middle" fontSize="7" fill="#1470B1" fontFamily="helvetica">LEANA</text>
      {/* Left panel */}
      <rect x="22" y="40" width="56" height="80" rx="2" fill="none" stroke="#00387B" strokeWidth="1.2"/>
      <line x1="22" y1="60" x2="78" y2="60" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      <line x1="22" y1="80" x2="78" y2="80" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      <line x1="22" y1="100" x2="78" y2="100" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      {/* Right panel */}
      <rect x="90" y="40" width="56" height="80" rx="2" fill="none" stroke="#00387B" strokeWidth="1.2"/>
      <line x1="90" y1="60" x2="146" y2="60" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      <line x1="90" y1="80" x2="146" y2="80" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      <line x1="90" y1="100" x2="146" y2="100" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.4"/>
      {/* Floor guides */}
      <rect x="34" y="120" width="16" height="4" rx="1" fill="#00387B" fillOpacity="0.5"/>
      <rect x="118" y="120" width="16" height="4" rx="1" fill="#00387B" fillOpacity="0.5"/>
      {/* Floor line */}
      <line x1="12" y1="124" x2="156" y2="124" stroke="#00387B" strokeWidth="0.8" strokeOpacity="0.25"/>
      {/* Slide arrows */}
      <line x1="68" y1="80" x2="56" y2="80" stroke="#1470B1" strokeWidth="0.9" markerEnd="url(#arrS)" strokeOpacity="0.7"/>
      <line x1="100" y1="80" x2="112" y2="80" stroke="#1470B1" strokeWidth="0.9" markerEnd="url(#arrS)" strokeOpacity="0.7"/>
      <defs>
        <marker id="arrS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#1470B1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {/* Thin jamb indicators */}
      <rect x="12" y="40" width="10" height="80" rx="1" fill="#00387B" fillOpacity="0.08" stroke="#00387B" strokeWidth="0.5"/>
      <rect x="146" y="40" width="10" height="80" rx="1" fill="#00387B" fillOpacity="0.08" stroke="#00387B" strokeWidth="0.5"/>
    </svg>
  );
}

export function ManualSwingDoor() {
  return (
    <svg width="100%" viewBox="0 0 168 145" role="img">
      <title>Manual Swing Door — Standard</title>
      {/* Frame */}
      <rect x="20" y="28" width="8" height="96" rx="1" fill="#00387B" fillOpacity="0.3"/>
      <rect x="140" y="28" width="8" height="96" rx="1" fill="#00387B" fillOpacity="0.3"/>
      <line x1="20" y1="124" x2="148" y2="124" stroke="#00387B" strokeWidth="0.8" strokeOpacity="0.3"/>
      {/* Door leaf */}
      <rect x="28" y="28" width="112" height="96" rx="1" fill="none" stroke="#00387B" strokeWidth="1.3"/>
      <line x1="28" y1="56" x2="140" y2="56" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="84" x2="140" y2="84" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="112" x2="140" y2="112" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      {/* Door closer TS-50 */}
      <rect x="48" y="18" width="72" height="12" rx="2" fill="#1470B1" fillOpacity="0.2" stroke="#1470B1" strokeWidth="0.9"/>
      <text x="84" y="27" textAnchor="middle" fontSize="6.5" fill="#1470B1" fontFamily="helvetica">ECO Newton TS-50</text>
      {/* Arm */}
      <line x1="120" y1="24" x2="134" y2="30" stroke="#1470B1" strokeWidth="1.2"/>
      {/* Handle */}
      <line x1="128" y1="68" x2="128" y2="84" stroke="#00387B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="128" cy="68" r="3" fill="#00387B"/>
      {/* Swing arc */}
      <path d="M28 124 A96 96 0 0 0 124 28" fill="none" stroke="#1470B1" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.45"/>
    </svg>
  );
}

export function AccessibleDoor() {
  return (
    <svg width="100%" viewBox="0 0 168 145" role="img">
      <title>Manual Swing Door — Accessible</title>
      {/* Frame */}
      <rect x="20" y="28" width="8" height="96" rx="1" fill="#00387B" fillOpacity="0.3"/>
      <rect x="140" y="28" width="8" height="96" rx="1" fill="#00387B" fillOpacity="0.3"/>
      <line x1="20" y1="124" x2="148" y2="124" stroke="#00387B" strokeWidth="0.8" strokeOpacity="0.3"/>
      {/* Door leaf */}
      <rect x="28" y="28" width="112" height="96" rx="1" fill="none" stroke="#00387B" strokeWidth="1.3"/>
      <line x1="28" y1="56" x2="140" y2="56" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="84" x2="140" y2="84" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="112" x2="140" y2="112" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      {/* Slide rail (TS-62 feature) */}
      <line x1="28" y1="18" x2="140" y2="18" stroke="#1470B1" strokeWidth="2" strokeOpacity="0.35"/>
      {/* Door closer TS-62 */}
      <rect x="44" y="20" width="80" height="10" rx="2" fill="#1470B1" fillOpacity="0.2" stroke="#1470B1" strokeWidth="0.9"/>
      <text x="84" y="28" textAnchor="middle" fontSize="6" fill="#1470B1" fontFamily="helvetica">ECO Newton TS-62 + slide rail</text>
      {/* Handle (lever style) */}
      <line x1="128" y1="68" x2="128" y2="84" stroke="#00387B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="128" cy="68" r="3" fill="#00387B"/>
      {/* Wheelchair accessibility symbol */}
      <circle cx="72" cy="72" r="6" fill="none" stroke="#1470B1" strokeWidth="1.4"/>
      <line x1="72" y1="78" x2="72" y2="90" stroke="#1470B1" strokeWidth="1.4"/>
      <line x1="72" y1="82" x2="79" y2="82" stroke="#1470B1" strokeWidth="1.4"/>
      <line x1="72" y1="90" x2="66" y2="100" stroke="#1470B1" strokeWidth="1.4"/>
      <line x1="72" y1="90" x2="78" y2="100" stroke="#1470B1" strokeWidth="1.4"/>
      {/* DIN 18040 badge */}
      <rect x="48" y="105" width="48" height="12" rx="2" fill="#1470B1" fillOpacity="0.12" stroke="#1470B1" strokeWidth="0.7"/>
      <text x="72" y="114" textAnchor="middle" fontSize="6.5" fill="#1470B1" fontFamily="helvetica">DIN 18040 PMR</text>
      {/* Swing arc (lighter, easier opening) */}
      <path d="M28 124 A70 70 0 0 0 98 54" fill="none" stroke="#1470B1" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.45"/>
    </svg>
  );
}

export function FireDoor() {
  return (
    <svg width="100%" viewBox="0 0 168 145" role="img">
      <title>Fire Door</title>
      {/* Frame — heavier for solid core */}
      <rect x="18" y="28" width="10" height="96" rx="1" fill="#00387B" fillOpacity="0.45"/>
      <rect x="140" y="28" width="10" height="96" rx="1" fill="#00387B" fillOpacity="0.45"/>
      <line x1="18" y1="124" x2="150" y2="124" stroke="#00387B" strokeWidth="1.2" strokeOpacity="0.45"/>
      {/* Door leaf — heavier stroke */}
      <rect x="28" y="28" width="112" height="96" rx="1" fill="none" stroke="#00387B" strokeWidth="1.8"/>
      <line x1="28" y1="56" x2="140" y2="56" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="84" x2="140" y2="84" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      <line x1="28" y1="112" x2="140" y2="112" stroke="#00387B" strokeWidth="0.3" strokeOpacity="0.3"/>
      {/* Intumescent strip */}
      <line x1="28" y1="30" x2="28" y2="122" stroke="#ED6E02" strokeWidth="3" strokeOpacity="0.55"/>
      {/* Door closer TS-50 fire rated */}
      <rect x="46" y="18" width="76" height="12" rx="2" fill="#ED6E02" fillOpacity="0.18" stroke="#ED6E02" strokeWidth="0.9"/>
      <text x="84" y="27" textAnchor="middle" fontSize="6.5" fill="#ED6E02" fontFamily="helvetica">TS-50 Fire Rated (F)</text>
      {/* Closer arm */}
      <line x1="122" y1="24" x2="136" y2="30" stroke="#ED6E02" strokeWidth="1.2"/>
      {/* Handle */}
      <line x1="128" y1="68" x2="128" y2="84" stroke="#00387B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="128" cy="68" r="3" fill="#00387B"/>
      {/* Fire rating badge */}
      <rect x="44" y="42" width="52" height="14" rx="3" fill="#ED6E02" fillOpacity="0.15" stroke="#ED6E02" strokeWidth="0.8"/>
      <text x="70" y="52" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#ED6E02" fontFamily="helvetica">FD30 · FD60</text>
      {/* Flame symbols */}
      <path d="M60 110 Q63 100 67 105 Q69 96 73 110Z" fill="#ED6E02" fillOpacity="0.5"/>
      <path d="M76 110 Q79 98 83 103 Q85 94 90 110Z" fill="#ED6E02" fillOpacity="0.4"/>
      <path d="M93 110 Q96 101 100 106 Q102 97 106 110Z" fill="#ED6E02" fillOpacity="0.45"/>
      {/* EN standard note */}
      <text x="84" y="122" textAnchor="middle" fontSize="6" fill="#ED6E02" fontFamily="helvetica" fillOpacity="0.75">EN 1634 · EN 1154 F</text>
    </svg>
  );
}
