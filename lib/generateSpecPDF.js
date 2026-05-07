import { jsPDF } from "jspdf";

// ─── LOGO ────────────────────────────────────────────────────────────────────
const LOGO_B64 = "/9j/4AAQSkZJRgABAQEBLAEsAAD/4QLKRXhpZgAATU0AKgAAAAgABAEOAAIAAAABAAAAAIdpAAQAAAABAAABSpybAAEAAAACAAAAAOocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWQAwACAAAAFAAAApiQBAACAAAAFAAAAqySkQACAAAAAzAwAACSkgACAAAAAzAwAADqHAAHAAABDAAAAYwAAAAAHOoAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMTU6MDM6MDQgMTI6NDY6NDAAMjAxNTowMzowNCAxMjo0Njo0MAAAAP/hBNFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0ZURhdGU+MjAxNS0wMy0wNFQxMjo0Njo0MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzp0aXRsZT48cmRmOkFsdCB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+PC9yZGY6bGk+PC9yZGY6QWx0Pg0KCQkJPC9kYzp0aXRsZT48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPjwvcmRmOmxpPjwvcmRmOkFsdD4NCgkJCTwvZGM6ZGVzY3JpcHRpb24+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  navy:    [0,   56,  123],
  blue:    [20,  112, 177],
  orange:  [237, 110, 2],
  green:   [140, 160, 40],
  dark:    [40,  50,  65],
  mid:     [90,  100, 115],
  light:   [150, 160, 170],
  rule:    [210, 215, 220],
  rowAlt:  [248, 249, 251],
  white:   [255, 255, 255],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const f  = (doc, rgb) => doc.setFillColor(...rgb);
const d  = (doc, rgb) => doc.setDrawColor(...rgb);
const tc = (doc, rgb) => doc.setTextColor(...rgb);
const lw = (doc, w)   => doc.setLineWidth(w);
const t  = (doc, str, x, y, opts = {}) => doc.text(String(str ?? ""), x, y, opts);

function bold(doc, sz)   { doc.setFont("helvetica","bold");   doc.setFontSize(sz); }
function normal(doc, sz) { doc.setFont("helvetica","normal"); doc.setFontSize(sz); }
function italic(doc, sz) { doc.setFont("helvetica","italic"); doc.setFontSize(sz); }

function rect(doc, x, y, w, h, fillRgb) {
  f(doc, fillRgb); doc.rect(x, y, w, h, "F");
}

function hairline(doc, x1, y1, x2, y2) {
  d(doc, C.rule); lw(doc, 0.25);
  doc.line(x1, y1, x2, y2);
}

function sectionLabel(doc, label, x, y, w) {
  rect(doc, x, y + 0.5, 2, 7, C.navy);
  bold(doc, 7); tc(doc, C.navy);
  t(doc, label, x + 6, y + 6);
  hairline(doc, x, y + 9, x + w, y + 9);
  return y + 12;
}

function drawFooter(doc, pageH, margin, pageW, p, total) {
  hairline(doc, margin, pageH - 11, pageW - margin, pageH - 11);
  normal(doc, 6); tc(doc, C.light);
  t(doc, "MF Services — Hardware Specification", margin, pageH - 6);
  if (p && total) t(doc, `Page ${p} of ${total}`, pageW - margin, pageH - 6, { align: "right" });
  t(doc, "www.mfservices.ie  |  021 4348996  |  contact@mfservices.ie", pageW/2, pageH - 6, { align: "center" });
}

// ─── MAIN GENERATOR ──────────────────────────────────────────────────────────
export async function generateSpecPDF({ doorType, selectedHardware, projectData, hardwareData }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const cW = pageW - margin * 2;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IE", { day:"2-digit", month:"short", year:"numeric" });

  rect(doc, 0, 0, pageW, pageH, C.white);

  // ── HEADER ────────────────────────────────────────────────────────────────
  try {
    doc.addImage(LOGO_B64, "JPEG", margin, 8, 40, 13);
  } catch(e) {
    bold(doc, 14); tc(doc, C.navy);
    t(doc, "MF SERVICES", margin, 18);
  }

  bold(doc, 16); tc(doc, C.dark);
  t(doc, "HARDWARE SPECIFICATION", pageW - margin, 13, { align: "right" });

  normal(doc, 7.5); tc(doc, C.mid);
  t(doc, doorType?.label || "Door Specification", pageW - margin, 19, { align: "right" });
  t(doc, `Generated: ${dateStr}`, pageW - margin, 25, { align: "right" });

  hairline(doc, margin, 28, pageW - margin, 28);

  normal(doc, 6.5); tc(doc, C.light);
  t(doc, "MF Services · Hardware Specification · Confidential", margin, 32.5);
  t(doc, `Ref: ${projectData?.doorNumberOrNaming || "—"}`, pageW - margin, 32.5, { align: "right" });

  let y = 37;

  // ── PROJECT INFORMATION ───────────────────────────────────────────────────
  y = sectionLabel(doc, "PROJECT INFORMATION", margin, y, cW);

  const metaFields = [
    ["Construction Project", projectData?.constructionProject],
    ["Door Number / Naming",  projectData?.doorNumberOrNaming],
    ["Installation Location", projectData?.installationLocation],
    ["Function Description",  projectData?.functionDescription],
    ["Miscellaneous",         projectData?.miscellaneous],
  ].filter(([,v]) => v);

  if (metaFields.length === 0) {
    italic(doc, 8); tc(doc, C.light);
    t(doc, "No project data provided.", margin + 6, y + 5);
    y += 10;
  } else {
    const colW = cW / 2;
    metaFields.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const fx = margin + col * colW;
      const fy = y + row * 10;
      if (row % 2 === 1 && col === 0) rect(doc, margin, fy, cW, 10, C.rowAlt);
      normal(doc, 6); tc(doc, C.light);
      t(doc, label.toUpperCase(), fx + 4, fy + 4);
      bold(doc, 8); tc(doc, C.dark);
      t(doc, value || "—", fx + 4, fy + 8.8);
      if (col === 1) hairline(doc, margin + colW, fy, margin + colW, fy + 10);
    });
    const rows = Math.ceil(metaFields.length / 2);
    d(doc, C.rule); lw(doc, 0.25);
    doc.rect(margin, y, cW, rows * 10, "S");
    y += rows * 10 + 7;
  }

  // ── PRODUCT INFORMATION ───────────────────────────────────────────────────
  y = sectionLabel(doc, "DOOR SYSTEM", margin, y, cW);

  if (doorType) {
    borderedRect(doc, margin, y, cW, 18, C.rowAlt, C.rule, 0.25);

    bold(doc, 10); tc(doc, C.navy);
    t(doc, doorType.label, margin + 4, y + 7);

    if (doorType.product) {
      normal(doc, 7.5); tc(doc, C.dark);
      t(doc, `Product: ${doorType.product}`, margin + 4, y + 13);
    }
    if (doorType.manufacturer) {
      normal(doc, 7); tc(doc, C.mid);
      t(doc, `Manufacturer: ${doorType.manufacturer}`, margin + 4, y + 17.5);
    }
    if (doorType.description) {
      t(doc, doorType.description, pageW - margin - 4, y + 7, { align: "right" });
    }
    y += 22;
  }

  // ── HARDWARE SCHEDULE ─────────────────────────────────────────────────────
  y = sectionLabel(doc, "HARDWARE SCHEDULE", margin, y, cW);

  const cols = {
    item:    { x: margin,       w: 8,   label: "ITEM" },
    product: { x: margin + 8,   w: 45,  label: "PRODUCT" },
    mfr:     { x: margin + 53,  w: 35,  label: "MANUFACTURER" },
    article: { x: margin + 88,  w: 35,  label: "ARTICLE NO." },
    finish:  { x: margin + 123, w: cW - 105, label: "FINISH / NOTES" },
  };

  rect(doc, margin, y, cW, 7, C.navy);
  bold(doc, 6.5); tc(doc, C.white);
  Object.values(cols).forEach(col => t(doc, col.label, col.x + 2, y + 5));
  [cols.product, cols.mfr, cols.article, cols.finish].forEach(col => {
    d(doc, [60, 90, 140]); lw(doc, 0.2);
    doc.line(col.x, y, col.x, y + 7);
  });
  y += 7;

  const tableStartY = y;
  const hardwareItems = selectedHardware || [];
  let rowIndex = 0;

  hardwareItems.forEach((item, idx) => {
    const rowH = 9;
    if (y + rowH > pageH - 18) {
      d(doc, C.rule); lw(doc, 0.25);
      doc.rect(margin, tableStartY, cW, y - tableStartY, "S");
      drawFooter(doc, pageH, margin, pageW);
      doc.addPage();
      rect(doc, 0, 0, pageW, pageH, C.white);
      y = 20;
      rect(doc, margin, y, cW, 7, C.navy);
      bold(doc, 6.5); tc(doc, C.white);
      Object.values(cols).forEach(col => t(doc, col.label, col.x + 2, y + 5));
      y += 7;
      rowIndex = 0;
    }

    const rowBg = rowIndex % 2 === 0 ? C.white : C.rowAlt;
    rect(doc, margin, y, cW, rowH, rowBg);
    hairline(doc, margin, y + rowH, margin + cW, y + rowH);
    [cols.product, cols.mfr, cols.article, cols.finish].forEach(col => {
      hairline(doc, col.x, y, col.x, y + rowH);
    });

    const tY = y + 6;
    bold(doc, 7); tc(doc, C.navy);
    t(doc, String(idx + 1), cols.item.x + cols.item.w/2, tY, { align: "center" });

    bold(doc, 7); tc(doc, C.dark);
    t(doc, item.label || "—", cols.product.x + 2, tY);

    normal(doc, 6.5); tc(doc, C.mid);
    t(doc, item.manufacturer || "—", cols.mfr.x + 2, tY);

    bold(doc, 6.5); tc(doc, C.blue);
    t(doc, item.articleNo || "—", cols.article.x + 2, tY);

    normal(doc, 6.5); tc(doc, C.dark);
    t(doc, item.finish || item.notes || "—", cols.finish.x + 2, tY);

    y += rowH;
    rowIndex++;
  });

  if (hardwareItems.length === 0) {
    rect(doc, margin, y, cW, 10, C.rowAlt);
    italic(doc, 8); tc(doc, C.light);
    t(doc, "No hardware items selected.", margin + 4, y + 7);
    y += 10;
  }

  d(doc, C.rule); lw(doc, 0.25);
  doc.rect(margin, tableStartY, cW, y - tableStartY, "S");
  y += 8;

  // ── STANDARDS COMPLIANCE ──────────────────────────────────────────────────
  if (y > pageH - 60) {
    drawFooter(doc, pageH, margin, pageW);
    doc.addPage();
    rect(doc, 0, 0, pageW, pageH, C.white);
    y = 20;
  }

  y = sectionLabel(doc, "STANDARDS COMPLIANCE", margin, y, cW);

  const standards = doorType?.standards || [];
  if (standards.length > 0) {
    const stdStartY = y;
    standards.forEach((std, i) => {
      const rowH = 8;
      const rowBg = i % 2 === 0 ? C.white : C.rowAlt;
      rect(doc, margin, y, cW, rowH, rowBg);
      hairline(doc, margin, y + rowH, margin + cW, y + rowH);
      hairline(doc, margin + 28, y, margin + 28, y + rowH);

      bold(doc, 7.5); tc(doc, C.navy);
      t(doc, std.code, margin + 4, y + 5.5);

      normal(doc, 7); tc(doc, C.dark);
      t(doc, std.description, margin + 32, y + 5.5);

      y += rowH;
    });
    d(doc, C.rule); lw(doc, 0.25);
    doc.rect(margin, stdStartY, cW, y - stdStartY, "S");
  } else {
    italic(doc, 8); tc(doc, C.light);
    t(doc, "No standards data available.", margin + 4, y + 5);
    y += 10;
  }

  y += 8;

  // ── INSTALLATION NOTES ────────────────────────────────────────────────────
  if (doorType?.specifications || doorType?.note) {
    if (y > pageH - 50) {
      drawFooter(doc, pageH, margin, pageW);
      doc.addPage();
      rect(doc, 0, 0, pageW, pageH, C.white);
      y = 20;
    }

    y = sectionLabel(doc, "INSTALLATION NOTES", margin, y, cW);
    borderedRect(doc, margin, y, cW, 22, C.rowAlt, C.rule, 0.25);

    normal(doc, 7); tc(doc, C.dark);
    const notes = [];
    if (doorType.specifications?.installation) notes.push(`Installation: ${doorType.specifications.installation}`);
    if (doorType.specifications?.structure) notes.push(`Structure: ${doorType.specifications.structure}`);
    if (doorType.specifications?.headerDimensions) notes.push(`Header dimensions: ${doorType.specifications.headerDimensions}`);
    if (doorType.specifications?.maxDoorWidth) notes.push(`Maximum door width: ${doorType.specifications.maxDoorWidth}`);
    if (doorType.note) notes.push(doorType.note);

    notes.slice(0, 4).forEach((note, i) => {
      t(doc, `• ${note}`, margin + 4, y + 6 + (i * 5));
    });
    y += 26;
  }

  // ── MAINTENANCE ───────────────────────────────────────────────────────────
  if (y > pageH - 40) {
    drawFooter(doc, pageH, margin, pageW);
    doc.addPage();
    rect(doc, 0, 0, pageW, pageH, C.white);
    y = 20;
  }

  y = sectionLabel(doc, "MAINTENANCE SCHEDULE", margin, y, cW);
  borderedRect(doc, margin, y, cW, 16, C.rowAlt, C.rule, 0.25);
  normal(doc, 7); tc(doc, C.dark);

  const maintenanceItems = [
    doorType?.maintenanceRequirement,
    ...hardwareItems.map(h => h.maintenanceNote).filter(Boolean)
  ].filter(Boolean);

  if (maintenanceItems.length > 0) {
    maintenanceItems.slice(0, 3).forEach((item, i) => {
      t(doc, `• ${item}`, margin + 4, y + 6 + (i * 5));
    });
  } else {
    t(doc, "• Regular inspection and maintenance required per manufacturer guidelines.", margin + 4, y + 6);
    t(doc, "• Consult MF Services for product-specific maintenance schedules.", margin + 4, y + 11);
  }
  y += 20;

  // ── COMPLIANCE STAMP ──────────────────────────────────────────────────────
  if (y > pageH - 30) {
    drawFooter(doc, pageH, margin, pageW);
    doc.addPage();
    rect(doc, 0, 0, pageW, pageH, C.white);
    y = 20;
  }

  d(doc, [140, 160, 40]); lw(doc, 0.6);
  doc.rect(margin, y, cW, 22, "S");
  rect(doc, margin, y, 2, 22, C.green);

  doc.setDrawColor(...C.green); doc.setFillColor(...C.green); lw(doc, 0.5);
  doc.circle(margin + 11, y + 11, 5, "FD");
  bold(doc, 9); tc(doc, C.white);
  t(doc, "✓", margin + 8.8, y + 13.5);

  bold(doc, 9); tc(doc, [100, 120, 30]);
  t(doc, "SPECIFICATION COMPLETE", margin + 20, y + 9);

  normal(doc, 7); tc(doc, C.mid);
  t(doc, "This specification has been prepared based on MF Services product data.", margin + 20, y + 15);
  t(doc, dateStr, pageW - margin - 3, y + 15, { align: "right" });

  hairline(doc, margin + 20, y + 20, margin + 80, y + 20);
  normal(doc, 5.5); tc(doc, C.light);
  t(doc, "Authorised signature", margin + 20, y + 19.5);

  // ── FOOTERS ───────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, pageH, margin, pageW, p, totalPages);
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const filename = [
    "spec",
    doorType?.id || "door",
    projectData?.doorNumberOrNaming?.replace(/\s+/g,"-") || "unnamed",
    now.toISOString().slice(0,10),
  ].filter(Boolean).join("_") + ".pdf";

  doc.save(filename);
  return filename;
}

// Helper used inside PDF
function borderedRect(doc, x, y, w, h, fillRgb, strokeRgb, strokeW = 0.3) {
  doc.setFillColor(...fillRgb);
  doc.setDrawColor(...strokeRgb);
  doc.setLineWidth(strokeW);
  doc.rect(x, y, w, h, "FD");
}
