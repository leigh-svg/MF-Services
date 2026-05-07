'use client'
import { useState, useCallback } from "react";
import { jsPDF } from "jspdf";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  navy:         "#00387B",
  blue:         "#1470B1",
  blueLight:    "#E8F2FA",
  orange:       "#ED6E02",
  orangeLight:  "#FEF3E8",
  green:        "#B1C638",
  greenDark:    "#8A9B2A",
  greenLight:   "#F4F7E0",
  red:          "#D63B3B",
  redLight:     "#FDF0F0",
  canvas:       "#F8F9FA",
  surface:      "#FFFFFF",
  surface2:     "#F2F4F7",
  border:       "#E2E8F0",
  borderStrong: "#C8D3E0",
  textPrimary:  "#0F1C2E",
  textBody:     "#374151",
  textMuted:    "#6B7280",
  textFaint:    "#9CA3AF",
  white:        "#FFFFFF",
};

const shadow = {
  xs: "0 1px 2px rgba(0,56,123,0.04)",
  sm: "0 2px 8px rgba(0,56,123,0.06), 0 1px 2px rgba(0,56,123,0.04)",
  md: "0 4px 16px rgba(0,56,123,0.08), 0 2px 4px rgba(0,56,123,0.04)",
  lg: "0 8px 32px rgba(0,56,123,0.10), 0 2px 8px rgba(0,56,123,0.06)",
};

// ─── PDF GENERATION ───────────────────────────────────────────────────────────
function generateSpecPDF(doorType, hardwareSelections, projectData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Hardware Specification", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`MF Services — ${hardwareData.contact.website}`, margin, y);
  y += 5;
  doc.text(`Phone: ${hardwareData.contact.phone} | Email: ${hardwareData.contact.email}`, margin, y);
  y += 15;

  // Project Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Project Details", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const details = [
    `Construction Project: ${projectData.constructionProject}`,
    `Door Number/Naming: ${projectData.doorNumberOrNaming}`,
    `Installation Location: ${projectData.installationLocation}`,
    `Position No. in Specifications: ${projectData.positionNumberInSpec}`,
    `Function Description: ${projectData.functionDescription}`,
    `Miscellaneous: ${projectData.miscellaneous}`,
  ];
  details.forEach(detail => {
    doc.text(detail, margin, y);
    y += 6;
  });
  y += 10;

  // Door Type
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Door Type", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${doorType.label} — ${doorType.description}`, margin, y);
  y += 6;
  doc.text(`Manufacturer: ${doorType.manufacturer}`, margin, y);
  y += 10;

  // Hardware Schedule
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Hardware Schedule", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  if (doorType.id === "automatic-sliding") {
    // LEANA hardware display
    if (hardwareSelections.glazingOption) {
      const glazing = doorType.glazingOptions.find(g => g.id === hardwareSelections.glazingOption);
      doc.text(`Glazing Option: ${glazing.label}`, margin, y);
      y += 6;
    }
    if (hardwareSelections.leanaOptions && hardwareSelections.leanaOptions.length > 0) {
      doc.text("LEANA Options:", margin, y);
      y += 6;
      hardwareSelections.leanaOptions.forEach(optId => {
        const opt = doorType.options.find(o => o.id === optId);
        if (opt) {
          doc.text(`• ${opt.label}`, margin + 5, y);
          y += 6;
        }
      });
    }
  } else {
    // Traditional hardware display
    if (hardwareSelections.closer) {
      const closer = hardwareData.hardware.doorClosers.find(c => c.id === hardwareSelections.closer);
      const variant = hardwareSelections.closerVariant ? closer.variants.find(v => v.id === hardwareSelections.closerVariant) : null;
      doc.text(`Door Closer: ${closer.label}${variant ? ` (${variant.label})` : ''}`, margin, y);
      y += 6;
      if (variant) {
        doc.text(`Article No: ${variant.articleNo}`, margin + 10, y);
        y += 6;
      }
    }
    if (hardwareSelections.leverHandle) {
      const handle = hardwareData.hardware.leverHandles.find(h => h.id === hardwareSelections.leverHandle);
      doc.text(`Lever Handle: ${handle.label}`, margin, y);
      y += 6;
    }
    if (hardwareSelections.panicHardware) {
      const panic = hardwareData.hardware.panicHardware.find(p => p.id === hardwareSelections.panicHardware);
      doc.text(`Panic Hardware: ${panic.label}`, margin, y);
      y += 6;
    }
  }
  y += 10;

  // Applicable Standards
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Applicable EN Standards", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doorType.standards.forEach(standard => {
    doc.text(`${standard.code} — ${standard.description}`, margin, y);
    y += 6;
  });

  // Footer
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);

  doc.save(`Hardware_Spec_${projectData.doorNumberOrNaming || 'Door'}.pdf`);
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
import hardwareData from '../data/hardware-products.json';

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
const STEPS = ["Select Door Type", "Configure Hardware", "Project Details", "Review and Generate"];

function StepIndicator({ currentStep, setCurrentStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
      {STEPS.map((label, i) => (
        <div key={i} onClick={i < currentStep ? () => setCurrentStep(i) : undefined} style={{ display: "flex", alignItems: "center", flex: 1, cursor: i < currentStep ? "pointer" : "default" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "all 250ms",
              background: i < currentStep ? T.green : i === currentStep ? T.navy : T.surface,
              color: i < currentStep ? T.white : i === currentStep ? T.white : T.textMuted,
              border: i === currentStep ? `2px solid ${T.navy}` : i < currentStep ? `2px solid ${T.green}` : `2px solid ${T.border}`,
              boxShadow: i === currentStep ? `0 0 0 4px rgba(0,56,123,0.12)` : "none",
            }}>
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 12, fontWeight: i === currentStep ? 600 : 400, color: i === currentStep ? T.textPrimary : T.textMuted, whiteSpace: "nowrap" }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: "0 12px", background: i < currentStep ? T.green : T.border, borderRadius: 1, transition: "background 250ms" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SpecGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDoorType, setSelectedDoorType] = useState(null);
  const [hardwareSelections, setHardwareSelections] = useState({});
  const [projectData, setProjectData] = useState({ constructionProject: "", doorNumberOrNaming: "", installationLocation: "", positionNumberInSpec: "", functionDescription: "", miscellaneous: "" });

  const doorType = selectedDoorType ? hardwareData.doorTypes.find(dt => dt.id === selectedDoorType) : null;

  const handleSelectDoorType = id => { setSelectedDoorType(id); setHardwareSelections({}); };
  const handleHardwareChange = useCallback((key, value) => { setHardwareSelections(prev => ({ ...prev, [key]: value })); }, []);
  const handleNext = () => { setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ minHeight: "100vh", background: T.canvas, fontFamily: "DM Sans, sans-serif", color: T.textBody }}>
      {/* ── HEADER ── */}
      <header style={{ background: T.navy, borderBottom: `3px solid ${T.orange}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 100, boxShadow: shadow.md }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAC4A50DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKAE3V8gf8FC/2lvE/wCz/wCGfCVr4Mv4tN17WLuaSS4eCKfbbxIAy7HUj5nlQ5x/Afevr73r8i/+ClvjY+Lv2kJtJV823h3T4LEKpyPMcee7fX96in/cHpz34Ciq9dJq6IlLlVzmP+HjHx9/6HC3/wDBPaf/ABqj/h4x8ff+hwtv/BRaf/Gq+d/s/tR9n9q+u+pUP5EY+2Poj/h4v8fv+hvt/wDwT2n/AMapP+HjHx+/6G+3/wDBRaf/Gq+d/s/tR9n9q+u+pUP5EHtj6I/4eMfH3/ob7f/wT2f8A8ar6Q/YS/bH+IPxa+Lk3hrx5rUOpWl7YytYqllDAyzx7W6xqMgoJOvoK/Of7P7V65+z74qPwz+KXgzxDuMcdjqMMlwVOP3TNsk/8cdqUsupVKc4xgr2/E8vHZh9V5L9WvuP3IwKDzTIZBJGGByCM5p26vhNj3E7q6HUUUUDEyK+Mv+Chv7UHiz4B2vg7TvBOpw6drGpvcXNzJJbxzsIIwqqNrqQNzOTnGf3dfZn8Vfjx/wAFFvHA8cftN6vaRTCS10C0g0qMr03BTLIPr5krqf8Acr0MvoqtXtJXSIlLlVzL/wCHjHx+/wChvt//AAT2f/xqj/h4x8fv+hvt/wDwT2f/AMar53+z+1H2cV9Z9RofyIx9sfRH/Dxf4/f9Dfb/APgntP8A41R/w8Y+P3/Q4Qf+Cez/APjVfO/2cUfZxR9SofyIPbH0R/w8Y+P3/Q32/wD4J7P/AONV9OfsF/tfePvjH8StR8OePNah1KK4sXl08pZw25WWMqWUbEGcoWPOfuGvzb+z9a9t/Zr8Wf8ACsfi54J15pPIhtb+MXLn/njIdkufojtUVMupSpT5YK9vxOWtivZuK7v8D9uKKYrBlBHIpzdK+GPTFooooAKKKKACiiuf8ZeNtD+H/h2917xFqcGkaRZpvmurltqr2AA6sxPAUAkkgAEmkrt2QG7uGK82+K/7RPw8+CVvu8X+J7PTbkrujsFYy3cvHG2FMuQem7G3PUivgP8AaQ/4KReJPGUl1onw1WbwxofKNrD4+3XIzglO0IOeMEvwCCvSvinULi51W8nvL25mvLydt81xcO0kkjE8lmJySff0r3sPlU6i5qjt5GLqxR+ifxG/4K0abatLB4H8EXN/wRHf65cCBc46+THuLDP+2teDeI/+Cmnxv1ubfZXui6An/PPT9MVx/wCRjIf1r5d+z9Txk45/nS/Z/avap5fh6f2b+pHtj6I/4eMfH3/obrf/AME9p/8AGqP+Hi/x+/6G+3/8E9p/8ar53+zij7OK2+pUP5EHtj6I/wCHjHx+/wChvt//AAT2f/xqj/h4x8fv+hvt/wDwT2f/AMar53+z+1H2cUvqVD+RC9sfRH/Dxj4/f9Dfb/8Agns//jVH/Dxj4/f9Dfb/APgns/8A41Xzv9nFH2f2o+pUP5EHtj6I/wCHjHx9/wChwg/8E9n/APGqP+HjHx9/6HCD/wAE9n/8ar53+zij7P7UfUqH8iH7Y+iP+HjHx+/6G+3/APBPZ/8Axqvpz9gP9pH4u/tAfFDWbbxZ4gS+8NaVpjXEscen28W6d5FSJS6IGHAlbr/BX5t/Z/av1Q/4Ja/D3/hG/grrPieWLbceItTIjkx963t12Kf+/jTivMzChRo0G4xSdy4T5mfatFFFfLGwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBWvLqKxtZbiaRYoIkMkkjHAVQMkn8K/B34m+KJPiF8RPE3ieXO7V9SnvAp/gV3JVfwU4/Cv2E/a+8cf8ACB/s6eNb+NgtxdWR06HnB3XBEJI91V2b/gNfjV9l9j/Ovq8jo35qvyPMxdZRaiZX2f2pPs3tWt9l9qPsvtX1Hs2ed9YRk/Zval+y1q/Zfal+zexo9mw+sIy4bPzJEX+83OK6VYf3ZGKrWNp+/B6YFa6w/LXqYWj7rbPhM9xjlVjFdD9jP2b/ABsfiD8EPB+tvJ5lxNYRxTtnOZo/3bn8WQn8a9OzzXxx/wAE2fGf9pfDnxD4Ymk3TaTf/aIkJ6QzLnH03o5/4FX2P3r8mx9H6viqlPzP0zLcQsThKdRdUOooorhPTKGsapbaHpV5qN5J5VpaQvcTSHoqIpZj+QNfgv428QXPjbxlrviG8G251a/nv5RnOGldnI/Amv1+/bY8bHwP+zd4ulil8q61KFdKh/2vOYI4H/bIyn8K/Hz7L7V9ZklC8Z1PkeZi6yg1Eyfs3tS/ZT6Vq/ZRS/ZRX0/s2ed9YRk/Z/ak+ze1a32X2pfs3saPZsPrBm29l5k0aEfePNdSIcKMcYHGO1UtPtMT7sfdFbQh+X8K7aVG0G31PncVjubEqmui/E/Y/wDZ78bH4ifBfwhr7v5s9zYRpcN/02jzHJ/4+jV6KOtfHn/BNrxr/avw08QeGpJN0uj6h50S5+7DMuQB7B0kP/Aq+xDX5VjKPsa84eZ95hqiq0oyQ6iiiuQ6gopMiqOpapa6Tp91fXlxHa2drG0080jbVjRVLMzHsAASaNegHN/FD4oeH/hD4L1DxN4jvBaafaLwowZJ5CDtijUkbnbHAz7kgAkfkB+0d+0f4o/aM8UG91V2sNDt2P8AZ+iQyEw2y9N5/vyEZyx9cDaBiuq/az/aIvv2hPHzvbPLB4U012i0qzbK7hnBncf32xn2UAepPhf2X2zX22W5aqUVUqL3n+B41bFqT5YvQyTa/wA8/wD1/rR9m9q1vsvtS/ZvY17vI1scn1hGT9n9qT7N7Vr/AGb2NJ9l9qPZsPrCMn7N7Uv2f2rV+y+1L9lFHs2L6wjI+ze1L9lrV+y+1H2Wj2bD26Mr7KP7tJ9m9q1/s3saT7L7UezYe3RlfZR/do+y1rfZvY0fZ/8AZo9mx/WEZK2ZZtoUk5xj39K/dD4DeA1+GPwc8H+GfL8qbT9NhS4X/puV3zH8ZGc/jX5K/sx/D0fET49eCtEkhE1q2oJc3KN0MMIMzqfYrGR+OO9ftMF7V8lndS040vmephG5pyJaKKK+ZPQCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKSgD4g/4KaeMTH4a8I+E4pBm8updRnQHkLEuyPPsxlf/AL4r8+/s3tX0x+3N4s/4TD9oLVII2322i28Omoe2QDJJ+IaRh+FfPv2b2Nfp+U4X2eEgnu9fvPg8djFLESXYyfs3tR9m9q1fs3tR9m9q9j2TPO+tmV9m9qPs3tWr9m9qPs3tR7Ji+tFSztdvOKvLD7VPDb7eMVZW3/d169KnyxSPzzHYr2teUrn0B+wL4wHhn47Lpkj7YNcs5bXBPWVMSJ+iMP8AgVfpz71+Mfw98SS+BfHvh/X4+G06+huD7qrZYfiMj8a/ZWzuUvLWKaNt6SIGVh0IIyDX5nxPhnSxMattJL8j9U4QxarYWVF7xf4MtUUlGRXxp96fCH/BTjxkJLXwZ4Qif7zy6rcR5xjA8qI/+PT/AJV8F/Zvavoj9tLxYfGn7QfiEq/mW2liPS4ec48tT5g/7+NJXhn2b2r9RyvCunhIX33+8+Bx2M5sRJLoZX2b2o+ze1av2b2o+ze1er7I8/60ZX2b2o+ze1av2b2o+ze1P2TD611KtpabYWOOpq5DHlenbFXRa7bdRjHFJDD8pr0/ZctOx8XTxntMVKd92fQX7AfjL/hF/j3Hpckm2312yltME4HmKPNQ/X5GX/gdfp5X4r+B/E0vgbx5oHiCEkPpl9Dd4U/eCOGK/QjI/Gv2gs7yK+s4bmFxLDMgkR15DKRkEfhX5bxBh3TxEandfkfr+S11UoOHYt0UUV8ufRjM18R/8FEPji+k6PbfDXSLgrc6lGt1qrxtztvu/dw+xcgsenyqByGNfZHibxBZeE/D+p61qMvkWOn28l1PJ/dRFLMR+Ar8a/iR4w1D4meONa8T6o2bvUrhptuSREvREHsqhV+iivoslwX1qs5y+GP5nh5pjFhqagt2cKbUdh/jS/ZvatX7N7Uv2f8A2a/RPZM+O+tIyfs3tR9m9q1fs3tS/Z/9mn7Jh9aXcyfs3tR9nrW+z/7NDWo+lL2ejZX1pGT9m9qT7OM44r274c/so/Ej4nQxXWleHpLTTZRlb/UmFtEw9V3fM491UivatJ/4Jp+KZlX+0/F2kWbfxLawyzjp2z5fevLq4/CUXyyqK53U6OJrLmhB2Pij7PR9nr7q/wCHZep/9D5a/wDgtf8A+O0f8Oy9T/6Hy1/8Fr//AB2sP7UwP85v9Txf8h8K/Z6Ps9fdX/DsvU/+h8tf/Ba//wAdo/4dl6n/AND5a/8Agtf/AOO0f2pgf5x/U8X/ACHwr9no+z191f8ADsvU/wDofbX/AMFr/wDx2m/8Uy9T/wCh8tf/AAWP/wDHaP7UwP8AOH1PF/ymH/wTR8B/bvHnijxVMgKabZJZQhl482Z9xIPqFiI+klfotxzXkH7NfwHX9n/wLc6EdRXVrq5vXu57pYTEDlVRVCljwAg79zXr4xXweYYhYjESnHbofUYOm6VFRluOooorgO0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBN1U9U1KDSdNur65fy7e2ieaRv7qqCSfyBq1XjX7W3i7/hEfgR4kdH8u51CNdPiGcbvNYK4Hv5e8/hW+GpPEVoUo7yaX3nJiq8cPQnWltFNn5ieKtYuPFvibV9aux/pOpXc13IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AAknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5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wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiimswWgD8sf8Agpt8QV1z45ad4cilLQeHtNQSp/dnmPmMf++PIr5A+0+9dJ8cviJ/ws74xeMPFCyM8GpanNLbljkiANsiGfaMIPwrhvtPvX6DhIujQhHyPMqU+aVzV+0+9H2n3rK+0+9H2quznM/ZGr9p96PtXvisr7T70fauel7IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrw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KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBN1U9U1KDSdNur65fy7e2ieaRv7qqCSfyBq1XjX7W3i7/hEfgR4kdH8u51CNdPiGcbvNYK4Hv5e8/hW+GpPEVoUo7yaX3nJiq8cPQnWltFNn5ieKtYuPFvibV9aux/pOpXc13IOuGkcsR+tZf2b2q/tX2o2r7V+8U8KqcFFLY/BKmaKUnJvcofZvaj7N7Vf8selG1K09gZ/2ku5n/ZfbNHke1aG0egoaMHpTVDUznmS5XZlOGD5elWlh/d4xU8MHSrSwjZXaoHy9SrdmPNBjOBjjn+lfqt+y74wHjT4GeFLxpPNuILUWUx774T5fPuQoP41+Xc0Py19tf8ABPTxZ52g+JvDUr5a1uEvoVY87ZBtYfgUB/4FXxfFWF9pg1VS+Fr8dD9C4Mxvs8c6L+2rfdqfYeay/EOuW3h3QNS1a7bZaWVtJdStnGERSzH8hWnzXhf7Zni4eF/gPrMayeXc6o8emxe+9suPxjR6/K8LReIrwpL7TSP2fGYiOFw86svsps/MvWr2417Wb/VLxjJdXtxJcyt6u7FmP5k1T+ze1X9q0u1fav3aGF5YKKPwWeaKUm2zO+zezflR9l/zitDyx6UbVrT2Bn/aUe5n/Zf84pVtdzAdqv7U9qlt4Q0g4zinHD66mVbMl7N2epWlh+XoelV44cMwrZltxtqm0YVyeldcoaHhYfEWmmZF1F144r9Wf2S/GP8Awm3wB8J3TuJLmztv7Om55DQExrn3Kqjf8Cr8sriMNk5r7a/4Jw+MA2n+LvCksnMM0epQJnsw8uQj2+SL/vqvz7iTDc2G9ovsv/gH7Bw1i17bk/mR9sUUUlfmJ+mny3+3x4/bw/8ACq08O20gS71+6COvf7PEQ74+reUPcE1+dn2X/OK+lf24/F//AMknxsm01ZN1tolpHahc5XzHHmu31+dV/wCACvnratfsOQ4D2OCjJrWWv37H4tnubRqY2cE9I6fcZ/2X/Zo8j2rQ2rS+WnrX0PsGfO/2jHuZ/wBm9qPs3tV/avtS+Uvp+ho9gP8AtCPci0fw/e+INUtdN020mvb66kEUNvChLuxOAAK/Qz9nf9jXQ/hvZW2t+KbeDW/FTAOI5FD21keoVF6M47ue/wB3HU5X7E3wFh8M+H08d6xb51rUkP2BZF5trZujj0Zx37LgdyK+sCv51+XZ5mzqVHh6DtGO77v/ACP1fI8t5aSxFde9LZdhwj2rgU7bS0V8cfZibRRzS0UAJzRzS0UAJzSc06igApOaWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBNoo2ijlooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==" alt="MF Services Logo" style={{ width: 40, height: 13, objectFit: "contain" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: T.white, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Hardware Spec Generator</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>MF Services — Door Systems</div>
            </div>
          </div>
          {doorType && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: T.white, fontWeight: 500 }}>
                {doorType.label}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px" }}>
        <StepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

        {/* STEP 0: Select Door Type */}
        {currentStep === 0 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.03em", marginBottom: 6 }}>Select Door Type</h1>
            <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 32 }}>Choose the door type you are generating a specification for.</p>
          
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {hardwareData.doorTypes.map(dt => (
                <div key={dt.id} onClick={() => handleSelectDoorType(dt.id)}
                  style={{ background: T.surface, border: `2px solid ${selectedDoorType === dt.id ? T.blue : T.border}`, borderRadius: 14, padding: 24, cursor: "pointer", transition: "all 200ms", boxShadow: selectedDoorType === dt.id ? `0 0 0 4px rgba(20,112,177,0.12), ${shadow.md}` : shadow.sm }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.02em", marginBottom: 4 }}>{dt.label}</div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 12 }}>{dt.description}</div>
                  <div style={{ fontSize: 12, color: T.textFaint }}>{dt.manufacturer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Configure Hardware */}
        {currentStep === 1 && doorType && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 20, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.03em", marginBottom: 6 }}>Configure Hardware</h1>
                <p style={{ color: T.textMuted, fontSize: 15 }}>Select hardware components for your door specification.</p>
              </div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 32, boxShadow: shadow.sm }}>
              {/* LEANA-specific configuration for automatic-sliding doors */}
              {doorType.id === "automatic-sliding" ? (
                <>
                  {/* Glazing Options */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, display: "block", marginBottom: 12 }}>Glazing Option</label>
                    <select value={hardwareSelections.glazingOption || ""} onChange={e => handleHardwareChange("glazingOption", e.target.value)}
                      style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                      onFocus={e => e.target.style.borderColor = T.blue}
                      onBlur={e => e.target.style.borderColor = T.border}
                    >
                      <option value="">Select Glazing Option</option>
                      {doorType.glazingOptions?.map(g => (
                        <option key={g.id} value={g.id}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* LEANA Options */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, display: "block", marginBottom: 12 }}>LEANA Options</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {doorType.options?.map(opt => (
                        <label key={opt.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={(hardwareSelections.leanaOptions || []).includes(opt.id)}
                            onChange={e => {
                              const current = hardwareSelections.leanaOptions || [];
                              const updated = e.target.checked ? [...current, opt.id] : current.filter(id => id !== opt.id);
                              handleHardwareChange("leanaOptions", updated);
                            }}
                            style={{ marginTop: 2, cursor: "pointer", width: 18, height: 18 }}
                          />
                          <div>
                            <div style={{ fontSize: 14, color: T.textPrimary, fontWeight: 500 }}>{opt.label}</div>
                            {opt.description && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{opt.description}</div>}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Door Closer */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, display: "block", marginBottom: 12 }}>Door Closer</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 8 }}>Model</label>
                        <select value={hardwareSelections.closer || doorType.recommendedCloser || ""} onChange={e => handleHardwareChange("closer", e.target.value)}
                          style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                          onFocus={e => e.target.style.borderColor = T.blue}
                          onBlur={e => e.target.style.borderColor = T.border}
                        >
                          <option value="">Select Closer</option>
                          {hardwareData.hardware.doorClosers.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 8 }}>Variant</label>
                        <select value={hardwareSelections.closerVariant || ""} onChange={e => handleHardwareChange("closerVariant", e.target.value)}
                          style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                          onFocus={e => e.target.style.borderColor = T.blue}
                          onBlur={e => e.target.style.borderColor = T.border}
                        >
                          <option value="">Select Variant</option>
                          {hardwareSelections.closer && hardwareData.hardware.doorClosers.find(c => c.id === hardwareSelections.closer)?.variants.map(v => (
                            <option key={v.id} value={v.id}>{v.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Lever Handles */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, display: "block", marginBottom: 12 }}>Lever Handles</label>
                    <select value={hardwareSelections.leverHandle || ""} onChange={e => handleHardwareChange("leverHandle", e.target.value)}
                      style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                      onFocus={e => e.target.style.borderColor = T.blue}
                      onBlur={e => e.target.style.borderColor = T.border}
                    >
                      <option value="">Select Lever Handle</option>
                      {hardwareData.hardware.leverHandles.map(h => (
                        <option key={h.id} value={h.id}>{h.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Panic Hardware (if applicable) */}
                  {(doorType.id === "fire-door" || doorType.id === "manual-swing-accessible") && (
                    <div style={{ marginBottom: 32 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, display: "block", marginBottom: 12 }}>Panic Hardware</label>
                      <select value={hardwareSelections.panicHardware || ""} onChange={e => handleHardwareChange("panicHardware", e.target.value)}
                        style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                        onFocus={e => e.target.style.borderColor = T.blue}
                        onBlur={e => e.target.style.borderColor = T.border}
                      >
                        <option value="">Select Panic Hardware</option>
                        {hardwareData.hardware.panicHardware.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Project Details */}
        {currentStep === 2 && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.03em", marginBottom: 6 }}>Project Details</h1>
            <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 32 }}>This information will appear on the generated PDF.</p>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 32, boxShadow: shadow.sm }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  ["constructionProject", "Construction Project"],
                  ["doorNumberOrNaming", "Door Number / Naming"],
                  ["installationLocation", "Installation Location"],
                  ["positionNumberInSpec", "Position No. in Specifications"],
                  ["functionDescription", "Function Description"],
                  ["miscellaneous", "Miscellaneous"],
                ].map(([key, label]) => (
                  <div key={key} style={{ gridColumn: key === "functionDescription" || key === "miscellaneous" ? "1 / -1" : "auto" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 8 }}>{label}</label>
                    <input type="text" value={projectData[key]} onChange={e => setProjectData(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 8, padding: "11px 14px", fontSize: 14, color: T.textPrimary, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans, sans-serif", transition: "border-color 150ms" }}
                      onFocus={e => e.target.style.borderColor = T.blue}
                      onBlur={e => e.target.style.borderColor = T.border}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review and Generate */}
        {currentStep === 3 && doorType && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, letterSpacing: "-0.03em", marginBottom: 6 }}>Review and Generate</h1>
            <p style={{ color: T.textMuted, fontSize: 15, marginBottom: 32 }}>Review your selections and download the hardware specification PDF.</p>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 32, boxShadow: shadow.sm, marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Door Type Summary</h2>
              <p style={{ color: T.textBody, marginBottom: 16 }}>{doorType.label} — {doorType.description}</p>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Hardware Schedule</h2>
              <ul style={{ color: T.textBody, marginBottom: 16 }}>
                {doorType.id === "automatic-sliding" ? (
                  <>
                    {hardwareSelections.glazingOption && (
                      <li>Glazing Option: {doorType.glazingOptions?.find(g => g.id === hardwareSelections.glazingOption)?.label}</li>
                    )}
                    {hardwareSelections.leanaOptions && hardwareSelections.leanaOptions.length > 0 && (
                      <li>
                        Options:
                        <ul>
                          {hardwareSelections.leanaOptions.map(optId => {
                            const opt = doorType.options?.find(o => o.id === optId);
                            return <li key={optId}>{opt?.label}</li>;
                          })}
                        </ul>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    {hardwareSelections.closer && <li>Door Closer: {hardwareData.hardware.doorClosers.find(c => c.id === hardwareSelections.closer)?.label} {hardwareSelections.closerVariant && `(${hardwareData.hardware.doorClosers.find(c => c.id === hardwareSelections.closer)?.variants.find(v => v.id === hardwareSelections.closerVariant)?.label})`}</li>}
                    {hardwareSelections.leverHandle && <li>Lever Handle: {hardwareData.hardware.leverHandles.find(h => h.id === hardwareSelections.leverHandle)?.label}</li>}
                    {hardwareSelections.panicHardware && <li>Panic Hardware: {hardwareData.hardware.panicHardware.find(p => p.id === hardwareSelections.panicHardware)?.label}</li>}
                  </>
                )}
              </ul>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Applicable EN Standards</h2>
              <ul style={{ color: T.textBody }}>
                {doorType.standards.map(s => <li key={s.code}>{s.code} — {s.description}</li>)}
              </ul>
            </div>
            <button onClick={() => generateSpecPDF(doorType, hardwareSelections, projectData)} style={{ background: T.blue, color: T.white, border: "none", borderRadius: 10, padding: "13px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 150ms", boxShadow: shadow.sm }}>
              Download Spec PDF
            </button>
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          <button onClick={handleBack} disabled={currentStep === 0}
            style={{ background: T.surface, color: T.textBody, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 500, cursor: currentStep === 0 ? "not-allowed" : "pointer", opacity: currentStep === 0 ? 0.4 : 1, fontFamily: "DM Sans, sans-serif", transition: "all 150ms" }}>
            ← Previous
          </button>
          {currentStep < STEPS.length - 1 && (
            <button onClick={handleNext} disabled={currentStep === 0 && !selectedDoorType}
              style={{ background: (currentStep === 0 && !selectedDoorType) ? T.borderStrong : T.blue, color: T.white, border: "none", borderRadius: 10, padding: "13px 32px", fontSize: 14, fontWeight: 600, cursor: (currentStep === 0 && !selectedDoorType) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 150ms", boxShadow: (currentStep === 0 && !selectedDoorType) ? "none" : shadow.sm }}>
              Next Step →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}