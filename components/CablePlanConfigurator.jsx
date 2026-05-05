'use client'
import { useState, useCallback } from "react";
import ReviewAndGenerate from "./ReviewAndGenerate";

const SYSTEMS = {
  "ets64r-single": {
    id: "ets64r-single", name: "ETS 64-R", leafType: "single-leaf", isFireDoor: true, systemVariant: "ETS-64-R",
    components: [
      { id: "comp-1", position: "1", label: "Voltage supply", type: "power_supply", mandatory: true, cable: { defaultCable: "NYM 3 x 1.5 mm²", allowedCables: ["NYM 3 x 1.5 mm²"], allowOther: true }, remarks: "Motor must be supplied with 230 V" },
      { id: "comp-2", position: "2", label: "24 V DC E-opener, 100% ED, Protective diode", type: "e_opener", mandatory: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "" },
      { id: "comp-3", position: "3", label: "Bolt switch contact", type: "bolt_switch", mandatory: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.8 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "" },
      { id: "comp-4", position: "4", label: "Concealed cable connection", type: "cable_transition", mandatory: false, optional: true, cable: { defaultCable: "(integrated)", allowedCables: [], allowOther: false }, remarks: "Optional, in building" },
      { id: "comp-5", position: "5", label: "Flatscan set", type: "sensor_strip", mandatory: true, cable: { defaultCable: "Cables through ECO", allowedCables: ["Cables through ECO"], allowOther: true }, remarks: "Concealed cable laying in building, otherwise surface-mounted", subComponents: [
        { id: "comp-5-1", position: "5.1", label: "Sensor strips set", type: "sensor_strip", mandatory: true, cable: { defaultCable: "Cables through ECO", allowedCables: ["Cables through ECO"], allowOther: true }, remarks: "Concealed cable laying in building, otherwise surface-mounted" }
      ]},
      { id: "comp-6", position: "6", label: "Flip switch (inside)", type: "flip_switch", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "In-wall socket, cable laying in building", subComponents: [
        { id: "comp-6-1", position: "6.1", label: "Flip switch (outside)", type: "flip_switch", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "In-wall socket, cable laying in building" }
      ]},
      { id: "comp-7", position: "7", label: "Radar (inside) e.g. BS - 50cm above hinges", type: "radar_sensor", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "Cable laying in building (in-wall if necessary)", subComponents: [
        { id: "comp-7-1", position: "7.1", label: "Radar (outside) e.g. BGS - centre of door", type: "radar_sensor", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "Cable laying in building (in-wall if necessary)" }
      ]},
      { id: "comp-8", position: "8", label: "Bedix program selection switch", type: "program_switch", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.6 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.6 mm²", "J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "In-wall socket, cable laying in building" },
      { id: "comp-9", position: "9", label: "'Close door' manual release button", type: "manual_release_button", mandatory: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.8 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "Cable laying in building; button outside the door's pivot range", conditions: [{ if: { property: "isFireDoor", equals: true }, then: { mandatory: true, remarksOverride: "Mandatory per DIGt approval. Button must be outside the door's pivot range." } }] },
      { id: "comp-11", position: "11", label: "Ceiling smoke detector", type: "smoke_detector", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.8 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "Cable laying in building as per approval" },
      { id: "comp-12", position: "12", label: "Lintel-mounted smoke detector", type: "smoke_detector", mandatory: false, optional: true, cable: { defaultCable: "J-Y(ST)Y 4 x 0.8 mm²", allowedCables: ["J-Y(ST)Y 4 x 0.8 mm²"], allowOther: true }, remarks: "Cable laying in building as per approval" },
    ],
  },
};

const TYPE_ICONS = {
  power_supply: "⚡", e_opener: "🔓", bolt_switch: "🔘", cable_transition: "🔌",
  sensor_strip: "📡", flip_switch: "🔀", radar_sensor: "📻", program_switch: "⚙️",
  manual_release_button: "🚨", smoke_detector: "🔥", door_closer: "🚪",
};

function validateConfiguration(system, componentStates) {
  const errors = [], warnings = [];
  const allComponents = [];
  system.components.forEach((c) => { allComponents.push(c); if (c.subComponents) c.subComponents.forEach((sc) => allComponents.push(sc)); });
  allComponents.forEach((comp) => {
    const state = componentStates[comp.id];
    if (!state) return;
    let isMandatory = comp.mandatory;
    if (comp.conditions) comp.conditions.forEach((condition) => { if (system[condition.if.property] === condition.if.equals && condition.then.mandatory !== undefined) isMandatory = condition.then.mandatory; });
    if (isMandatory && !state.included) errors.push({ id: comp.id, message: `"${comp.label}" is mandatory and cannot be removed.` });
    if (state.included && !state.selectedCable && comp.cable.allowedCables.length > 0) warnings.push({ id: comp.id, message: `"${comp.label}" has no cable selected.` });
  });
  return { errors, warnings, isValid: errors.length === 0 };
}

function isMandatoryForSystem(comp, system) {
  if (comp.mandatory) return true;
  if (!comp.conditions) return false;
  return comp.conditions.some((c) => system[c.if.property] === c.if.equals && c.then.mandatory === true);
}

function getRemarksOverride(comp, system) {
  if (!comp.conditions) return null;
  for (const c of comp.conditions) { if (system[c.if.property] === c.if.equals && c.then.remarksOverride) return c.then.remarksOverride; }
  return null;
}

function buildInitialState(system) {
  const state = {};
  const process = (comp) => {
    const mandatory = isMandatoryForSystem(comp, system);
    state[comp.id] = { included: mandatory || !comp.optional, selectedCable: comp.cable.defaultCable, isOther: false, otherValue: "", userRemarks: "", expanded: true };
    if (comp.subComponents) comp.subComponents.forEach(process);
  };
  system.components.forEach(process);
  return state;
}

function CableSelector({ comp, state, onChange }) {
  const { selectedCable, isOther, otherValue } = state;
  const cables = comp.cable.allowedCables;
  if (cables.length === 0 && !comp.cable.allowOther) return <div style={styles.cableFixed}><span style={styles.cableTag}>{comp.cable.defaultCable}</span></div>;
  return (
    <div style={styles.cableSection}>
      <div style={styles.cableLabel}>Cable</div>
      <div style={styles.cableOptions}>
        {cables.map((cable) => (
          <label key={cable} style={styles.radioLabel}>
            <input type="radio" name={`cable-${comp.id}`} value={cable} checked={selectedCable === cable && !isOther} onChange={() => onChange(comp.id, { selectedCable: cable, isOther: false })} style={styles.radio} />
            <span style={styles.cableOptionText}>{cable}</span>
          </label>
        ))}
        {comp.cable.allowOther && (
          <label style={styles.radioLabel}>
            <input type="radio" name={`cable-${comp.id}`} checked={isOther} onChange={() => onChange(comp.id, { isOther: true, selectedCable: "" })} style={styles.radio} />
            <span style={{ ...styles.cableOptionText, color: "#f59e0b" }}>Other cable</span>
          </label>
        )}
      </div>
      {isOther && <input type="text" placeholder="Specify cable type..." value={otherValue} onChange={(e) => onChange(comp.id, { otherValue: e.target.value })} style={styles.otherInput} />}
    </div>
  );
}

function ComponentRow({ comp, state, onStateChange, system, depth = 0 }) {
  const mandatory = isMandatoryForSystem(comp, system);
  const remarksOverride = getRemarksOverride(comp, system);
  const displayRemarks = remarksOverride || comp.remarks;
  const isIncluded = state[comp.id]?.included ?? true;
  const compState = state[comp.id] ?? {};
  const handleToggle = () => { if (mandatory) return; onStateChange(comp.id, { included: !isIncluded }); };
  return (
    <div style={{ ...styles.componentRow, marginLeft: depth * 20, opacity: isIncluded ? 1 : 0.45 }}>
      <div style={styles.componentHeader}>
        <div style={styles.componentLeft}>
          <div style={{ ...styles.positionBadge, background: mandatory ? "#dc2626" : "#1e3a5f" }}>{comp.position}</div>
          <span style={styles.componentIcon}>{TYPE_ICONS[comp.type] || "•"}</span>
          <span style={styles.componentLabel}>{comp.label}</span>
          {mandatory && <span style={styles.mandatoryBadge}>REQUIRED</span>}
          {comp.optional && !mandatory && <span style={styles.optionalBadge}>OPTIONAL</span>}
        </div>
        <label style={styles.toggleWrapper}>
          <input type="checkbox" checked={isIncluded} onChange={handleToggle} disabled={mandatory} style={{ display: "none" }} />
          <div style={{ ...styles.toggle, background: isIncluded ? "#2563eb" : "#374151", cursor: mandatory ? "not-allowed" : "pointer" }}>
            <div style={{ ...styles.toggleKnob, transform: isIncluded ? "translateX(18px)" : "translateX(2px)" }} />
          </div>
        </label>
      </div>
      {isIncluded && (
        <div style={styles.componentBody}>
          <CableSelector comp={comp} state={compState} onChange={onStateChange} />
          {displayRemarks && <div style={styles.remarksHint}>{remarksOverride ? <span style={{ color: "#fbbf24" }}>{displayRemarks}</span> : <span style={{ color: "#94a3b8" }}>{displayRemarks}</span>}</div>}
          <div style={styles.userRemarksSection}>
            <label style={styles.userRemarksLabel}>Your remarks</label>
            <textarea placeholder="Add installation notes..." value={compState.userRemarks || ""} onChange={(e) => onStateChange(comp.id, { userRemarks: e.target.value })} style={styles.textarea} rows={2} />
          </div>
        </div>
      )}
      {comp.subComponents && isIncluded && (
        <div style={styles.subComponentWrapper}>
          {comp.subComponents.map((sub) => <ComponentRow key={sub.id} comp={sub} state={state} onStateChange={onStateChange} system={system} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

function ValidationPanel({ validation }) {
  if (validation.errors.length === 0 && validation.warnings.length === 0) return <div style={styles.validationSuccess}><span>✓</span> Configuration valid</div>;
  return (
    <div style={styles.validationPanel}>
      {validation.errors.map((e, i) => <div key={i} style={styles.validationError}><span>✕</span> {e.message}</div>)}
      {validation.warnings.map((w, i) => <div key={i} style={styles.validationWarning}><span>⚠</span> {w.message}</div>)}
    </div>
  );
}

const STEPS = ["Select System", "Configure Components", "Project Details", "Review"];

function StepIndicator({ currentStep }) {
  return (
    <div style={styles.stepIndicator}>
      {STEPS.map((label, i) => (
        <div key={i} style={styles.stepItem}>
          <div style={{ ...styles.stepDot, background: i < currentStep ? "#2563eb" : i === currentStep ? "#3b82f6" : "#1e293b", border: i === currentStep ? "2px solid #60a5fa" : "2px solid transparent", boxShadow: i === currentStep ? "0 0 12px #3b82f680" : "none" }}>{i < currentStep ? "✓" : i + 1}</div>
          <span style={{ ...styles.stepLabel, color: i === currentStep ? "#e2e8f0" : "#64748b" }}>{label}</span>
          {i < STEPS.length - 1 && <div style={{ ...styles.stepLine, background: i < currentStep ? "#2563eb" : "#1e293b" }} />}
        </div>
      ))}
    </div>
  );
}

export default function CablePlanConfigurator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSystemId, setSelectedSystemId] = useState(null);
  const [componentStates, setComponentStates] = useState({});
  const [projectData, setProjectData] = useState({ constructionProject: "", doorNumberOrNaming: "", installationLocation: "", positionNumberInSpec: "", functionDescription: "", miscellaneous: "" });
  const system = selectedSystemId ? SYSTEMS[selectedSystemId] : null;
  const validation = system ? validateConfiguration(system, componentStates) : { errors: [], warnings: [], isValid: true };
  const handleSelectSystem = (id) => { setSelectedSystemId(id); setComponentStates(buildInitialState(SYSTEMS[id])); };
  const handleStateChange = useCallback((compId, updates) => { setComponentStates((prev) => ({ ...prev, [compId]: { ...prev[compId], ...updates } })); }, []);
  const handleNext = () => { if (currentStep === 1 && !validation.isValid) return; setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>◈</div>
            <div>
              <div style={styles.logoTitle}>Cable Plan Configurator</div>
              <div style={styles.logoSub}>MF Services — Door Systems</div>
            </div>
          </div>
          {system && <div style={styles.systemChip}>{system.name} · {system.leafType}{system.isFireDoor && <span style={styles.fireBadge}>FIRE DOOR</span>}</div>}
        </div>
      </div>
      <div style={styles.body}>
        <StepIndicator currentStep={currentStep} />
        {currentStep === 0 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Select Door System</h2>
            <p style={styles.stepDesc}>Choose the system you are configuring the cable plan for.</p>
            <div style={styles.systemGrid}>
              {Object.values(SYSTEMS).map((sys) => (
                <div key={sys.id} onClick={() => handleSelectSystem(sys.id)} style={{ ...styles.systemCard, border: selectedSystemId === sys.id ? "2px solid #3b82f6" : "2px solid #1e293b", boxShadow: selectedSystemId === sys.id ? "0 0 20px #3b82f640" : "none" }}>
                  <div style={styles.systemCardName}>{sys.name}</div>
                  <div style={styles.systemCardMeta}>{sys.leafType}</div>
                  {sys.isFireDoor && <div style={styles.systemCardFire}>🔥 Fire Door</div>}
                  <div style={styles.systemCardCount}>{sys.components.length} components</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 1 && system && (
          <div style={styles.stepContent}>
            <div style={styles.configHeader}>
              <div>
                <h2 style={styles.stepTitle}>Configure Components</h2>
                <p style={styles.stepDesc}>Toggle optional components, select cable types, and add remarks.</p>
              </div>
              <ValidationPanel validation={validation} />
            </div>
            <div style={styles.componentList}>
              {system.components.map((comp) => <ComponentRow key={comp.id} comp={comp} state={componentStates} onStateChange={handleStateChange} system={system} />)}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Project Details</h2>
            <p style={styles.stepDesc}>Additional data that will appear on the generated PDF.</p>
            <div style={styles.projectForm}>
              {[["constructionProject","Construction Project"],["doorNumberOrNaming","Door Number / Naming"],["installationLocation","Installation Location"],["positionNumberInSpec","Position No. in Service Specifications"],["functionDescription","Function Description"],["miscellaneous","Miscellaneous"]].map(([key, label]) => (
                <div key={key} style={styles.formField}>
                  <label style={styles.formLabel}>{label}</label>
                  <input type="text" value={projectData[key]} onChange={(e) => setProjectData((p) => ({ ...p, [key]: e.target.value }))} style={styles.formInput} placeholder={`Enter ${label.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 3 && system && (
          <ReviewAndGenerate
            system={system}
            componentStates={componentStates}
            projectData={projectData}
          />
        )}
        <div style={styles.navRow}>
          <button onClick={handleBack} disabled={currentStep === 0} style={{ ...styles.navBtn, ...styles.navBtnBack, opacity: currentStep === 0 ? 0.3 : 1 }}>← Previous</button>
          {currentStep < STEPS.length - 1 && <button onClick={handleNext} disabled={currentStep === 0 && !selectedSystemId} style={{ ...styles.navBtn, ...styles.navBtnNext, opacity: (currentStep === 0 && !selectedSystemId) ? 0.4 : 1 }}>{currentStep === 1 && !validation.isValid ? "Fix errors to continue" : "Next →"}</button>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: { minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', 'Courier New', monospace" },
  header: { background: "#0a1628", borderBottom: "1px solid #1e3a5f", padding: "0 24px" },
  headerInner: { maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { fontSize: 28, color: "#3b82f6", lineHeight: 1 },
  logoTitle: { fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", color: "#f1f5f9" },
  logoSub: { fontSize: 11, color: "#64748b", letterSpacing: "0.05em", marginTop: 2 },
  systemChip: { background: "#0f2847", border: "1px solid #1e3a5f", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 },
  fireBadge: { background: "#7f1d1d", color: "#fca5a5", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" },
  body: { maxWidth: 900, margin: "0 auto", padding: "32px 24px" },
  stepIndicator: { display: "flex", alignItems: "center", marginBottom: 40 },
  stepItem: { display: "flex", alignItems: "center", flex: 1 },
  stepDot: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#e2e8f0", flexShrink: 0, transition: "all 0.3s" },
  stepLabel: { fontSize: 11, marginLeft: 8, whiteSpace: "nowrap", letterSpacing: "0.04em" },
  stepLine: { flex: 1, height: 1, margin: "0 12px", transition: "background 0.3s" },
  stepContent: { minHeight: 400 },
  stepTitle: { fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.02em" },
  stepDesc: { color: "#64748b", fontSize: 14, marginBottom: 28 },
  systemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
  systemCard: { background: "#0a1628", borderRadius: 10, padding: 20, cursor: "pointer", transition: "all 0.2s" },
  systemCardName: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: 4 },
  systemCardMeta: { fontSize: 12, color: "#64748b", marginBottom: 8 },
  systemCardFire: { fontSize: 12, color: "#fca5a5", marginBottom: 4 },
  systemCardCount: { fontSize: 11, color: "#475569" },
  configHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 20, flexWrap: "wrap" },
  validationSuccess: { background: "#052e16", border: "1px solid #166534", color: "#4ade80", borderRadius: 8, padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 },
  validationPanel: { background: "#1c0a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "12px 16px", minWidth: 260 },
  validationError: { color: "#fca5a5", fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 },
  validationWarning: { color: "#fbbf24", fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 },
  componentList: { display: "flex", flexDirection: "column", gap: 12 },
  componentRow: { background: "#0a1628", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden", transition: "opacity 0.2s" },
  componentHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" },
  componentLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" },
  positionBadge: { borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.04em", minWidth: 28, textAlign: "center", flexShrink: 0 },
  componentIcon: { fontSize: 16, flexShrink: 0 },
  componentLabel: { fontSize: 14, color: "#cbd5e1", fontFamily: "'IBM Plex Sans', sans-serif" },
  mandatoryBadge: { background: "#450a0a", color: "#fca5a5", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0 },
  optionalBadge: { background: "#0f172a", color: "#475569", borderRadius: 4, padding: "2px 6px", fontSize: 10, letterSpacing: "0.08em", flexShrink: 0 },
  toggleWrapper: { cursor: "pointer", flexShrink: 0 },
  toggle: { width: 40, height: 22, borderRadius: 11, position: "relative", transition: "background 0.2s" },
  toggleKnob: { width: 18, height: 18, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, transition: "transform 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" },
  componentBody: { padding: "14px 16px 16px", borderTop: "1px solid #1e293b" },
  cableSection: { marginBottom: 12 },
  cableFixed: { display: "flex", alignItems: "center", gap: 8 },
  cableTag: { background: "#0f2847", border: "1px solid #1e3a5f", borderRadius: 5, padding: "3px 10px", fontSize: 12, color: "#60a5fa", fontFamily: "'IBM Plex Mono', monospace" },
  cableLabel: { fontSize: 11, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 },
  cableOptions: { display: "flex", flexWrap: "wrap", gap: 8 },
  radioLabel: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" },
  radio: { accentColor: "#3b82f6" },
  cableOptionText: { fontSize: 12, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" },
  otherInput: { marginTop: 8, width: "100%", background: "#020817", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", outline: "none", boxSizing: "border-box" },
  remarksHint: { fontSize: 12, marginBottom: 10, lineHeight: 1.6 },
  userRemarksSection: { marginTop: 8 },
  userRemarksLabel: { fontSize: 11, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 },
  textarea: { width: "100%", background: "#020817", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px", color: "#cbd5e1", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", resize: "vertical", outline: "none", boxSizing: "border-box" },
  subComponentWrapper: { borderTop: "1px solid #1e293b", paddingTop: 8, paddingBottom: 8 },
  projectForm: { display: "flex", flexDirection: "column", gap: 16 },
  formField: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: { fontSize: 11, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" },
  formInput: { background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", outline: "none" },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid #1e293b" },
  navBtn: { borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "opacity 0.2s" },
  navBtnBack: { background: "#1e293b", color: "#94a3b8" },
  navBtnNext: { background: "#2563eb", color: "#fff", marginLeft: "auto" },
};