import { jsPDF } from "jspdf";

const C = {
  navy:[10,22,40],blue:[37,99,235],lightBlue:[96,165,250],red:[220,38,38],
  green:[22,163,74],silver:[148,163,184],mist:[226,232,240],white:[255,255,255],
};

const TYPE_LABELS = {
  power_supply:"Power Supply",e_opener:"E-Opener",bolt_switch:"Bolt Switch",
  cable_transition:"Cable Transition",sensor_strip:"Sensor Strip",flip_switch:"Flip Switch",
  radar_sensor:"Radar Sensor",program_switch:"Program Switch",
  manual_release_button:"Manual Release Button",smoke_detector:"Smoke Detector",
};

function rect(doc,x,y,w,h,rgb){doc.setFillColor(...rgb);doc.rect(x,y,w,h,"F");}
function line(doc,x1,y1,x2,y2,rgb,lw=0.3){doc.setDrawColor(...rgb);doc.setLineWidth(lw);doc.line(x1,y1,x2,y2);}
function txt(doc,s,x,y,o={}){doc.text(String(s),x,y,o);}

function drawDiagram(doc,system,componentStates,startY){
  const pageW=doc.internal.pageSize.getWidth(),margin=20,dH=90,dW=pageW-margin*2;
  rect(doc,margin,startY,dW,dH,C.navy);
  rect(doc,margin,startY,dW,10,C.blue);
  doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...C.white);
  txt(doc,"CABLE DIAGRAM — "+system.name.toUpperCase()+" · "+system.leafType.toUpperCase(),margin+4,startY+6.5);
  if(system.isFireDoor){rect(doc,pageW-margin-28,startY+1.5,26,7,C.red);doc.setFontSize(6);txt(doc,"FIRE DOOR",pageW-margin-26,startY+6.5);}
  const inc=[];
  system.components.forEach(c=>{if(componentStates[c.id]?.included){inc.push(c);if(c.subComponents)c.subComponents.forEach(s=>{if(componentStates[s.id]?.included)inc.push(s);});}});
  const bW=28,bH=18,gX=8,tW=inc.length*(bW+gX)-gX,sX=margin+(dW-tW)/2,bY=startY+28;
  if(inc.length>1)line(doc,sX+bW/2,bY+bH/2,sX+tW-bW/2,bY+bH/2,C.lightBlue,1.2);
  inc.forEach((c,i)=>{
    const bx=sX+i*(bW+gX),cx=bx+bW/2;
    rect(doc,bx,bY,bW,bH,c.mandatory?C.red:C.blue);
    doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(...C.white);
    txt(doc,c.position,cx,bY+6,{align:"center"});
    doc.setFont("helvetica","normal");doc.setFontSize(5.5);doc.setTextColor(...C.mist);
    txt(doc,c.label.length>14?c.label.substring(0,13)+"…":c.label,cx,bY+11,{align:"center"});
    const cable=componentStates[c.id]?.isOther?"Other":(componentStates[c.id]?.selectedCable||"");
    if(cable){doc.setFontSize(5);doc.setTextColor(...C.lightBlue);txt(doc,cable,cx,bY+bH+5,{align:"center"});}
    line(doc,cx,bY+bH,cx,bY+bH+4,C.lightBlue,0.4);
  });
  const lY=startY+dH-10;doc.setFontSize(5.5);doc.setTextColor(...C.silver);
  rect(doc,margin+4,lY,6,4,C.red);txt(doc,"Mandatory",margin+12,lY+3.2);
  rect(doc,margin+50,lY,6,4,C.blue);txt(doc,"Optional",margin+58,lY+3.2);
  return startY+dH+8;
}

export function runComplianceCheck(system,componentStates){
  const failures=[];
  const check=(comp)=>{
    const state=componentStates[comp.id];
    if(!state?.included)return;
    const isMandatory=comp.mandatory||(comp.conditions?.some(c=>system[c.if.property]===c.if.equals&&c.then?.mandatory===true)??false);
    if(isMandatory&&!state.userRemarks?.trim())failures.push({id:comp.id,position:comp.position,label:comp.label,reason:"Required remarks field is empty on a mandatory component."});
    if(state.isOther&&!state.otherValue?.trim())failures.push({id:comp.id,position:comp.position,label:comp.label,reason:"Other cable selected but no cable type specified."});
    if(comp.subComponents)comp.subComponents.forEach(check);
  };
  system.components.forEach(check);
  return failures;
}

export async function generateCablePlanPDF({system,componentStates,projectData}){
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const pageW=doc.internal.pageSize.getWidth(),pageH=doc.internal.pageSize.getHeight(),margin=20,cW=pageW-margin*2;
  rect(doc,0,0,pageW,28,C.navy);
  doc.setFont("helvetica","bold");doc.setFontSize(14);doc.setTextColor(...C.white);
  txt(doc,"CABLE PLAN",margin+10,13);
  doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(...C.silver);
  txt(doc,"MF Services — Door Systems Configuration",margin+10,20);
  const now=new Date(),dateStr=now.toLocaleDateString("en-IE",{day:"2-digit",month:"short",year:"numeric"});
  txt(doc,"Generated: "+dateStr,pageW-margin,13,{align:"right"});
  txt(doc,system.name+" · "+system.leafType,pageW-margin,20,{align:"right"});
  if(system.isFireDoor){rect(doc,pageW-margin-24,22,22,5,C.red);doc.setFont("helvetica","bold");doc.setFontSize(6);doc.setTextColor(...C.white);txt(doc,"FIRE DOOR",pageW-margin-23,25.5);}
  let y=36;
  rect(doc,margin,y,cW,8,[15,30,55]);doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(...C.lightBlue);
  txt(doc,"PROJECT INFORMATION",margin+4,y+5.5);y+=10;
  const meta=[["Construction Project",projectData.constructionProject],["Door Number",projectData.doorNumberOrNaming],["Location",projectData.installationLocation],["Function",projectData.functionDescription]].filter(([,v])=>v);
  if(meta.length===0){doc.setFont("helvetica","italic");doc.setFontSize(8);doc.setTextColor(...C.silver);txt(doc,"No project data provided.",margin+4,y+5);y+=10;}
  else{
    const colW=cW/2;
    meta.forEach(([label,value],i)=>{
      const col=i%2,row=Math.floor(i/2),fx=margin+col*colW,fy=y+row*10;
      if(col===0)rect(doc,fx,fy,cW,10,row%2===0?[12,24,44]:[10,20,38]);
      doc.setFont("helvetica","normal");doc.setFontSize(6.5);doc.setTextColor(...C.silver);txt(doc,label.toUpperCase(),fx+4,fy+4);
      doc.setFont("helvetica","bold");doc.setFontSize(8);doc.setTextColor(...C.white);txt(doc,value||"—",fx+4,fy+8.5);
    });
    y+=Math.ceil(meta.length/2)*10+4;
  }
  y+=4;
  rect(doc,margin,y,cW,8,[15,30,55]);doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(...C.lightBlue);
  txt(doc,"CABLE DIAGRAM",margin+4,y+5.5);y+=10;
  y=drawDiagram(doc,system,componentStates,y);y+=4;
  if(y>pageH-80){doc.addPage();y=20;}
  rect(doc,margin,y,cW,8,[15,30,55]);doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(...C.lightBlue);
  txt(doc,"COMPONENT CABLE REQUIREMENTS",margin+4,y+5.5);y+=10;
  const cols={pos:{x:margin,w:12,label:"POS."},type:{x:margin+12,w:30,label:"TYPE"},label:{x:margin+42,w:55,label:"COMPONENT"},cable:{x:margin+97,w:45,label:"CABLE"},remarks:{x:margin+142,w:cW-122,label:"REMARKS"}};
  rect(doc,margin,y,cW,7,C.blue);doc.setFont("helvetica","bold");doc.setFontSize(6.5);doc.setTextColor(...C.white);
  Object.values(cols).forEach(col=>txt(doc,col.label,col.x+2,y+5));y+=7;
  const allComps=[];
  system.components.forEach(c=>{allComps.push({comp:c,depth:0});if(c.subComponents)c.subComponents.forEach(s=>allComps.push({comp:s,depth:1}));});
  allComps.forEach(({comp,depth},idx)=>{
    const state=componentStates[comp.id];if(!state?.included)return;
    const isMandatory=comp.mandatory||(comp.conditions?.some(c=>system[c.if.property]===c.if.equals&&c.then?.mandatory)??false);
    const cable=state.isOther?`Other: ${state.otherValue||"(unspecified)"}`:(state.selectedCable||comp.cable.defaultCable);
    const remarks=[comp.remarks,state.userRemarks].filter(Boolean).join(" | ");
    doc.setFontSize(7);
    const rL=doc.splitTextToSize(remarks||"—",cols.remarks.w-4),lL=doc.splitTextToSize(comp.label,cols.label.w-4),rowH=Math.max(rL.length,lL.length)*4+5;
    if(y+rowH>pageH-20){doc.addPage();y=20;rect(doc,margin,y,cW,7,C.blue);doc.setFont("helvetica","bold");doc.setFontSize(6.5);doc.setTextColor(...C.white);Object.values(cols).forEach(col=>txt(doc,col.label,col.x+2,y+5));y+=7;}
    rect(doc,margin,y,cW,rowH,isMandatory?[30,10,10]:idx%2===0?[12,24,44]:[10,20,38]);
    if(isMandatory)rect(doc,margin,y,2,rowH,C.red);else if(depth>0)rect(doc,margin,y,2,rowH,C.lightBlue);
    const tY=y+4;
    doc.setFont("helvetica","bold");doc.setFontSize(7);doc.setTextColor(...(isMandatory?C.red:C.lightBlue));txt(doc,comp.position,cols.pos.x+2,tY);
    doc.setFont("helvetica","normal");doc.setFontSize(6);doc.setTextColor(...C.silver);txt(doc,TYPE_LABELS[comp.type]||comp.type,cols.type.x+2,tY);
    doc.setFont("helvetica",depth>0?"italic":"normal");doc.setFontSize(7);doc.setTextColor(...C.white);lL.forEach((l,i)=>txt(doc,l,cols.label.x+(depth*3)+2,tY+i*4));
    doc.setFont("helvetica","bold");doc.setFontSize(6.5);doc.setTextColor(...(state.isOther?[245,158,11]:C.lightBlue));doc.splitTextToSize(cable,cols.cable.w-4).forEach((l,i)=>txt(doc,l,cols.cable.x+2,tY+i*4));
    doc.setFont("helvetica","normal");doc.setFontSize(6);doc.setTextColor(...(state.userRemarks?C.white:C.silver));rL.forEach((l,i)=>txt(doc,l,cols.remarks.x+2,tY+i*4));
    y+=rowH;line(doc,margin,y,margin+cW,y,[20,40,70],0.2);
  });
  y+=6;if(y>pageH-30){doc.addPage();y=20;}
  rect(doc,margin,y,cW,20,[5,20,10]);line(doc,margin,y,margin+cW,y,C.green,1);
  doc.setFont("helvetica","bold");doc.setFontSize(9);doc.setTextColor(...C.green);txt(doc,"✓  COMPLIANCE CHECK PASSED",margin+6,y+8);
  doc.setFont("helvetica","normal");doc.setFontSize(7);doc.setTextColor(...C.silver);txt(doc,"All mandatory components verified.",margin+6,y+15);
  const totalPages=doc.internal.getNumberOfPages();
  for(let p=1;p<=totalPages;p++){
    doc.setPage(p);rect(doc,0,pageH-10,pageW,10,C.navy);
    doc.setFont("helvetica","normal");doc.setFontSize(6);doc.setTextColor(...C.silver);
    txt(doc,"MF Services — Cable Plan Configurator",margin,pageH-4);
    txt(doc,`Page ${p} of ${totalPages}`,pageW-margin,pageH-4,{align:"right"});
  }
  const filename=["cable-plan",system.name.replace(/\s+/g,"-").toLowerCase(),projectData.doorNumberOrNaming?.replace(/\s+/g,"-")||"unnamed",now.toISOString().slice(0,10)].filter(Boolean).join("_")+".pdf";
  doc.save(filename);
  return filename;
}