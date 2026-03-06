Hooks.on("renderActorSheet5eCharacter",(app,html)=>{

if(!app.actor || app.actor.type!=="character") return;

if(html.find(".pro-export").length) return;

const btn = $(`<a class="pro-export"><i class="fas fa-file-pdf"></i> Export PDF</a>`);

btn.click(()=>exportCharacterPDF(app.actor));

html.closest(".app").find(".window-title").after(btn);

});

async function exportCharacterPDF(actor){

const mapping = await fetch(
"modules/pro-character-export/mappings/official-5e.json"
).then(r=>r.json());

const pdfBytes = await fetch(
"modules/pro-character-export/templates/5e-character-sheet.pdf"
).then(r=>r.arrayBuffer());

const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

const form = pdfDoc.getForm();

const parsed = parseActorItems(actor);

for(const field of mapping.fields){

try{

const value = resolveFoundryPath(actor,field.source,parsed);

if(field.type==="checkbox"){

if(value) form.getCheckBox(field.pdf).check();

}else{

form.getTextField(field.pdf).setText(String(value ?? ""));

}

}catch(e){}

}

/* SPELL MULTI PAGE */

const spellPages = splitIntoPages(parsed.spells,45);

for(let i=1;i<spellPages.length;i++){

const pages = await pdfDoc.copyPages(pdfDoc,[2]);

pdfDoc.addPage(pages[0]);

}

/* WEAPON PAGE */

fillWeapons(form,parsed.weapons);

/* FEATURES */

fillFeatures(form,parsed.feats);

const finalPdf = await pdfDoc.save();

const blob = new Blob([finalPdf],{type:"application/pdf"});

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = actor.name+"-character-sheet.pdf";

link.click();

}

function resolveFoundryPath(actor,path,parsed){

if(!path) return "";

if(path==="items[type=weapon]") return parsed.weapons;
if(path==="items[type=spell]") return parsed.spells;
if(path==="items[type=feat]") return parsed.feats;

const parts = path.split(".");

let obj = actor;

for(const p of parts){

if(obj==null) return "";

obj = obj[p];

}

return obj;

}