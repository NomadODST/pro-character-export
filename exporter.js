Hooks.on("renderActorSheet", (app, html) => {

if (!app.actor) return;

const btn = $(`   <a class="pro-export">   <i class="fas fa-file-export"></i> Export   </a>`);

btn.click(() => openExportMenu(app.actor));

html.closest(".app").find(".window-title").after(btn);

});

function openExportMenu(actor){

new Dialog({

title:"Export Tools",

content:`Choose Export Type`,

buttons:{

sheet:{
label:"5E Character Sheet (PDF)",
callback:()=>exportCharacterSheet(actor)
},

spells:{
label:"Spell Cards",
callback:()=>exportSpellCards(actor)
},

inventory:{
label:"Inventory Cards",
callback:()=>exportInventory(actor)
},

statblock:{
label:"Monster Statblock",
callback:()=>exportStatblock(actor)
},

party:{
label:"Export Party",
callback:()=>exportParty()
}

}

}).render(true)

}

function openPrintable(html){

const w = window.open("", "_blank");

w.document.write(html);

w.document.close();

setTimeout(()=>{
w.print();
},500);

}

function abilityMod(score){
return Math.floor((score-10)/2)
}

function exportCharacterSheet(actor){

const sys = actor.system;

let html = `

<html>

<head>

<meta charset="UTF-8">

<style>

body{

font-family:Georgia,serif;
background:white;
margin:0;
padding:20px;

}

.sheet{

width:900px;
margin:auto;
border:3px solid black;
padding:20px;

}

.header{

display:flex;
gap:20px;
align-items:center;

}

.portrait{

width:150px;
border:2px solid black;

}

.name{

font-size:32px;
font-weight:bold;

}

.topstats{

margin-top:10px;

}

.abilities{

display:grid;
grid-template-columns:repeat(6,1fr);
gap:10px;
margin-top:20px;

}

.ability{

border:2px solid black;
padding:10px;
text-align:center;
font-size:18px;

}

.section{

border:2px solid black;
padding:15px;
margin-top:20px;

}

.section h2{

margin-top:0;
border-bottom:1px solid black;

}

.columns{

columns:2;

}

.card{

border:2px solid black;
padding:10px;
margin:5px;

}

</style>

</head>

<body>

<div class="sheet">

<div class="header">

<img src="${actor.img}" class="portrait">

<div>

<div class="name">${actor.name}</div>

<div class="topstats">

AC ${sys.attributes.ac.value}
HP ${sys.attributes.hp.value}/${sys.attributes.hp.max}
Speed ${sys.attributes.movement.walk}

</div>

</div>

</div>

<div class="abilities">

${Object.entries(sys.abilities).map(([k,v])=>{

let mod = abilityMod(v.value);

return `

<div class="ability">

${k.toUpperCase()} <br>

${v.value}
(${mod>=0?"+":""}${mod})

</div>

`

}).join("")}

</div>

<div class="section">

<h2>Skills</h2>

<div class="columns">

${Object.entries(sys.skills)
.map(([k,v])=>`${k.toUpperCase()} +${v.total}`)
.join("<br>")}

</div>

</div>

<div class="section">

<h2>Attacks</h2>

${actor.items
.filter(i=>i.system?.damage?.parts?.length)
.map(i=>`<div>${i.name}</div>`)
.join("")}

</div>

<div class="section">

<h2>Spells</h2>

${actor.items
.filter(i=>i.type==="spell")
.map(i=>`<div>${i.name}</div>`)
.join("")}

</div>

<div class="section">

<h2>Equipment</h2>

${actor.items
.filter(i=>i.type==="equipment")
.map(i=>`<div>${i.name}</div>`)
.join("")}

</div>

</div>

</body>

</html>

`;

openPrintable(html)

}

function exportSpellCards(actor){

let spells = actor.items.filter(i=>i.type==="spell")

let html = `

<html>

<style>

.card{

border:2px solid black;
width:260px;
padding:10px;
margin:10px;
display:inline-block;

}

</style>

<body>

${spells.map(s=>`

<div class="card">

<h3>\${s.name}</h3>

Level ${s.system.level}

${s.system.description.value}

</div>

`).join("")}

</body>

</html>

`

openPrintable(html)

}

function exportInventory(actor){

let items = actor.items.filter(i=>i.type==="equipment")

let html = `

<html>

<style>

.card{

border:2px solid black;
width:260px;
padding:10px;
margin:10px;
display:inline-block;

}

</style>

<body>

${items.map(i=>`

<div class="card">

<h3>\${i.name}</h3>

${i.system.description?.value || ""}

</div>

`).join("")}

</body>

</html>

`

openPrintable(html)

}

function exportStatblock(actor){

const sys = actor.system

let html = `

<html>

<body style="font-family:serif">

<h1>\${actor.name}</h1>

AC ${sys.attributes.ac.value}<br>

HP ${sys.attributes.hp.value}<br>

STR ${sys.abilities.str.value}<br>
DEX ${sys.abilities.dex.value}<br>
CON ${sys.abilities.con.value}<br>
INT ${sys.abilities.int.value}<br>
WIS ${sys.abilities.wis.value}<br>
CHA ${sys.abilities.cha.value}

</body>

</html>

`

openPrintable(html)

}

function exportParty(){

let chars = game.actors.filter(a=>a.type==="character")

let html = `

<html>

<body>

${chars.map(c=>`<h2>${c.name}</h2>`).join("")}

</body>

</html>

`

openPrintable(html)

}
