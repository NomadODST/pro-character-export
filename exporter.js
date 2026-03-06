Hooks.on("renderActorSheet5eCharacter", (app, html) => addExportButton(app, html));

function addExportButton(app, html){

if(!app.actor || app.actor.type !== "character") return;

if(html.find(".pro-export").length) return;

const btn = $(`<a class="pro-export"><i class="fas fa-file-pdf"></i> Export PDF</a>`);

btn.click(()=>exportCharacterPDF(app.actor));

html.closest(".app").find(".window-title").after(btn);

}

async function exportCharacterPDF(actor){

const mapping = await fetch(
"modules/pro-character-export/mappings/official-5e.json"
).then(r=>r.json());

const pdfBytes = await fetch(
"modules/pro-character-export/templates/5e-character-sheet.pdf"
).then(r=>r.arrayBuffer());

const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

const form = pdfDoc.getForm();

for(const field of mapping.fields){

try{

const value = resolveFoundryPath(actor,field.source);

if(field.type==="checkbox"){

if(value) form.getCheckBox(field.pdf).check();

}else{

form.getTextField(field.pdf).setText(String(value ?? ""));

}

}catch(e){}

}

const finalPdf = await pdfDoc.save();

const blob = new Blob([finalPdf],{type:"application/pdf"});

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = actor.name + "-character-sheet.pdf";

link.click();

}

function resolveFoundryPath(actor,path){

if(!path) return "";

const parts = path.split(".");

let obj = actor;

for(const p of parts){

if(obj==null) return "";

obj = obj[p];

}

return obj;

}