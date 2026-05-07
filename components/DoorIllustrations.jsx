'use client'

const T = {
  navy: "#00387B",
  blue: "#1470B1",
  white: "#FFFFFF",
};

function IconShell({ children }) {
  return (
    <div style={{ width: "100%", maxWidth: 180, margin: "0 auto", background: T.white, borderRadius: 16, padding: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  );
}

function AutomaticSlidingDoor() {
  return (
    <IconShell>
      <svg viewBox="0 0 180 120" width="100%" height="auto" role="img" aria-label="Automatic sliding door illustration">
        <rect x="10" y="18" width="160" height="16" rx="4" fill="none" stroke={T.navy} strokeWidth="3" />
        <line x1="10" y1="34" x2="170" y2="34" stroke={T.navy} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="38" x2="10" y2="102" stroke={T.navy} strokeWidth="3" />
        <line x1="170" y1="38" x2="170" y2="102" stroke={T.navy} strokeWidth="3" />
        <rect x="12" y="42" width="66" height="56" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <rect x="102" y="42" width="66" height="56" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <line x1="90" y1="42" x2="90" y2="98" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="102" x2="26" y2="114" stroke={T.navy} strokeWidth="4" strokeLinecap="round" />
        <line x1="154" y1="102" x2="154" y2="114" stroke={T.navy} strokeWidth="4" strokeLinecap="round" />
        <path d="M42 42 L54 34 L66 42" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114 42 L126 34 L138 42" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconShell>
  );
}

function ManualSwingDoor() {
  return (
    <IconShell>
      <svg viewBox="0 0 180 120" width="100%" height="auto" role="img" aria-label="Manual swing door illustration">
        <rect x="24" y="24" width="96" height="72" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <line x1="24" y1="24" x2="24" y2="96" stroke={T.navy} strokeWidth="3" />
        <path d="M120 24 A72 72 0 0 1 108 100" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx="106" cy="60" r="2" fill={T.blue} />
        <rect x="76" y="12" width="52" height="8" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <rect x="112" y="58" width="8" height="20" rx="2" fill={T.navy} />
        <line x1="52" y1="108" x2="130" y2="108" stroke={T.navy} strokeWidth="3" />
      </svg>
    </IconShell>
  );
}

function AccessibleDoor() {
  return (
    <IconShell>
      <svg viewBox="0 0 180 120" width="100%" height="auto" role="img" aria-label="Accessible door illustration">
        <rect x="24" y="24" width="96" height="72" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <line x1="24" y1="24" x2="24" y2="96" stroke={T.navy} strokeWidth="3" />
        <path d="M120 24 A72 72 0 0 1 108 100" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx="106" cy="60" r="2" fill={T.blue} />
        <rect x="76" y="12" width="52" height="8" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <rect x="112" y="58" width="8" height="20" rx="2" fill={T.navy} />
        <line x1="52" y1="108" x2="130" y2="108" stroke={T.navy} strokeWidth="3" />
        <circle cx="50" cy="80" r="10" fill="none" stroke={T.blue} strokeWidth="3" />
        <path d="M45 82 L45 92 L55 92" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <path d="M50 80 L57 76 L65 84" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <line x1="57" y1="84" x2="57" y2="98" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </IconShell>
  );
}

function FireDoor() {
  return (
    <IconShell>
      <svg viewBox="0 0 180 120" width="100%" height="auto" role="img" aria-label="Fire door illustration">
        <rect x="24" y="24" width="96" height="72" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <line x1="24" y1="24" x2="24" y2="96" stroke={T.navy} strokeWidth="3" />
        <path d="M120 24 A72 72 0 0 1 108 100" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx="106" cy="60" r="2" fill={T.blue} />
        <rect x="76" y="12" width="52" height="8" rx="2" fill="none" stroke={T.navy} strokeWidth="3" />
        <rect x="112" y="58" width="8" height="20" rx="2" fill={T.navy} />
        <line x1="52" y1="108" x2="130" y2="108" stroke={T.navy} strokeWidth="3" />
        <path d="M70 54 C72 44 82 44 84 54 C86 44 94 44 96 54 C98 64 86 68 84 74 C82 80 70 78 70 70 Z" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="110" y="74" width="34" height="18" rx="4" fill="none" stroke={T.navy} strokeWidth="3" />
        <text x="127" y="87" fill={T.navy} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="DM Sans, sans-serif">F60</text>
      </svg>
    </IconShell>
  );
}

const illustrationMap = {
  "automatic-sliding": AutomaticSlidingDoor,
  "manual-swing-standard": ManualSwingDoor,
  "manual-swing-accessible": AccessibleDoor,
  "fire-door": FireDoor,
};

export default function DoorIllustrations({ doorTypeId }) {
  const Illustration = illustrationMap[doorTypeId] || ManualSwingDoor;
  return <Illustration />;
}
