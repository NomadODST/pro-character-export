Hooks.on("renderActorSheet5eCharacter", (app, html) => addExportButton(app, html));
Hooks.on("renderActorSheet", (app, html) => addExportButton(app, html));

function addExportButton(app, html){

if(!app.actor || app.actor.type !== "character") return;

if(html.find(".pro-export").length) return;

const button = $(`<a class="pro-export"> <i class="fas fa-file-pdf"></i> Export 5E PDF </a>`);

button.click(() => exportOfficialPDF(app.actor));

html.closest(".app").find(".window-title").after(button);

}

function abilityMod(score){
return Math.floor((score-10)/2);
}

function safeSet(form, field, value){
try{
form.getTextField(field).setText(String(value ?? ""));
}catch(e){}
}

function safeCheck(form, field){
try{
form.getCheckBox(field).check();
}catch(e){}
}

async function exportOfficialPDF(actor){

const sys = actor.system;

const existingPdfBytes = await fetch(
"modules/pro-character-export/templates/5e-character-sheet.pdf"
).then(res => res.arrayBuffer());

const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

const form = pdfDoc.getForm();

/* BASIC */

safeSet(form,"CharacterName",actor.name);
safeSet(form,"PlayerName",game.user.name);

safeSet(form,"Race",sys.details?.race || "");
safeSet(form,"Alignment",sys.details?.alignment || "");
safeSet(form,"ClassLevel",sys.details?.level || "");

/* ABILITIES */

const abilities = {
STR: sys.abilities.str.value,
DEX: sys.abilities.dex.value,
CON: sys.abilities.con.value,
INT: sys.abilities.int.value,
WIS: sys.abilities.wis.value,
CHA: sys.abilities.cha.value
};

Object.entries(abilities).forEach(([k,v])=>{
safeSet(form,k,v);
safeSet(form,k+"mod",abilityMod(v));
});

/* SAVES */

safeSet(form,"ST Strength",sys.abilities.str.save);
safeSet(form,"ST Dexterity",sys.abilities.dex.save);
safeSet(form,"ST Constitution",sys.abilities.con.save);
safeSet(form,"ST Intelligence",sys.abilities.int.save);
safeSet(form,"ST Wisdom",sys.abilities.wis.save);
safeSet(form,"ST Charisma",sys.abilities.cha.save);

/* PROF */

safeSet(form,"ProfBonus",sys.attributes.prof);

/* COMBAT */

safeSet(form,"ArmorClass",sys.attributes.ac.value);
safeSet(form,"Initiative",sys.attributes.init.mod);
safeSet(form,"Speed",sys.attributes.movement.walk);

safeSet(form,"HPMax",sys.attributes.hp.max);
safeSet(form,"HPCurrent",sys.attributes.hp.value);

/* PASSIVE */

safeSet(form,"Passive",sys.skills.prc.passive);

/* SKILLS */

Object.entries(sys.skills).forEach(([k,v])=>{
safeSet(form,k.toUpperCase(),v.total);
});

/* ATTACKS */

const attacks = actor.items.filter(i=>i.system?.damage?.parts?.length);

for(let i=0;i<attacks.length && i<3;i++){

const atk = attacks[i];

safeSet(form,"Wpn Name"+(i+1),atk.name);

const dmg = atk.system.damage.parts?.[0]?.[0] || "";
const dmgType = atk.system.damage.parts?.[0]?.[1] || "";

safeSet(form,"Wpn"+(i+1)+" Damage",`${dmg} ${dmgType}`);

safeSet(form,"Wpn"+(i+1)+" AtkBonus",atk.system.attackBonus || "");

}

/* SPELLCASTING */

safeSet(form,"SpellcastingAbility",sys.attributes.spellcasting);

/* SPELL SLOTS */

if(sys.spells){

Object.entries(sys.spells).forEach(([lvl,data])=>{

if(lvl==="pact") return;

const level = lvl.replace("spell","");

safeSet(form,"SpellSlots"+level,data.max);
safeSet(form,"SpellSlots"+level+"Remaining",data.value);

});

}

/* SPELL LIST */

const spells = actor.items.filter(i=>i.type==="spell");

spells.slice(0,30).forEach((spell,i)=>{

const idx = i+1;

safeSet(form,"Spell "+idx,spell.name);
safeSet(form,"SpellLevel "+idx,spell.system.level);

if(spell.system.preparation?.prepared){
safeCheck(form,"Prepared "+idx);
}

});

/* FEATURES */

const features = actor.items
.filter(i=>i.type==="feat")
.map(i=>i.name)
.join(", ");

safeSet(form,"Features and Traits",features);

/* EQUIPMENT */

const equipment = actor.items
.filter(i=>["equipment","weapon","tool","consumable","loot"].includes(i.type))
.map(i=>`${i.name} x${i.system.quantity || 1}`)
.join(", ");

safeSet(form,"Equipment",equipment);

/* SAVE PDF */

const pdfBytes = await pdfDoc.save();

const blob = new Blob([pdfBytes], {type:"application/pdf"});

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = actor.name + "-character-sheet.pdf";

link.click();

}
