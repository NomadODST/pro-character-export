
Hooks.on("renderActorSheet", (app, html) => {

if (app.actor.type !== "character") return;

const btn = $(`
<a class="pro-export">
<i class="fas fa-file-export"></i> Export
</a>
`);

btn.click(() => openExportMenu(app.actor));

html.closest(".app").find(".window-title").after(btn);

});


function openExportMenu(actor){

new Dialog({

title:"Character Export",

content:`
<p>Choose export format</p>
`,

buttons:{

sheet:{
label:"Character Sheet",
callback:()=>exportCharacterSheet(actor)
},

spells:{
label:"Spell Cards",
callback:()=>exportSpellCards(actor)
},

statblock:{
label:"Statblock",
callback:()=>exportStatblock(actor)
},

party:{
label:"Export Party",
callback:()=>exportParty()
}

}

}).render(true);

}


async function exportCharacterSheet(actor){

const sys = actor.system;

let html = `
<html>

<head>
<meta charset="UTF-8">

<style>

body{
font-family:serif;
max-width:900px;
margin:auto;
padding:40px;
background:white;
}

.header{
display:flex;
gap:30px;
align-items:center;
}

.portrait{
width:180px;
border:2px solid black;
}

.title{
font-size:32px;
font-weight:bold;
}

.stats{
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
font-weight:bold;
}

.section{
margin-top:25px;
border:2px solid black;
padding:15px;
}

.section h2{
margin-top:0;
border-bottom:1px solid black;
}

.list{
columns:2;
}

</style>

</head>

<body>

<div class="header">

<img src="${actor.img}" class="portrait">

<div>

<div class="title">${actor.name}</div>

<div class="stats">

AC ${sys.attributes.ac.value} |
HP ${sys.attributes.hp.value}/${sys.attributes.hp.max} |
Speed ${sys.attributes.movement.walk}

</div>

</div>

</div>

<div class="abilities">

<div class="ability">STR<br>${sys.abilities.str.value}</div>
<div class="ability">DEX<br>${sys.abilities.dex.value}</div>
<div class="ability">CON<br>${sys.abilities.con.value}</div>
<div class="ability">INT<br>${sys.abilities.int.value}</div>
<div class="ability">WIS<br>${sys.abilities.wis.value}</div>
<div class="ability">CHA<br>${sys.abilities.cha.value}</div>

</div>

<div class="section">

<h2>Skills</h2>

<div class="list">

${Object.entries(sys.skills)
.map(([k,v]) => `${k.toUpperCase()} +${v.total}`)
.join("<br>")}

</div>

</div>

<div class="section">

<h2>Attacks</h2>

${actor.items
.filter(i => i.system?.damage?.parts?.length)
.map(i => `<div>${i.name}</div>`)
.join("")}

</div>

<div class="section">

<h2>Spells</h2>

${actor.items
.filter(i => i.type === "spell")
.map(i => `<div>${i.name}</div>`)
.join("")}

</div>

<div class="section">

<h2>Equipment</h2>

${actor.items
.filter(i => i.type === "equipment")
.map(i => `<div>${i.name}</div>`)
.join("")}

</div>

</body>

</html>
`;

download(html, actor.name+"-sheet.html");

}


async function exportSpellCards(actor){

let spells = actor.items.filter(i => i.type==="spell");

let html = "<html><body>";

for(let s of spells){

html += `

<div class="spell-card">

<h3>${s.name}</h3>

<p>${s.system.description.value}</p>

<p>Level ${s.system.level}</p>

</div>

`;

}

html += "</body></html>";

download(html, actor.name+"-spells.html");

}


async function exportStatblock(actor){

let sys = actor.system;

let html = `

<h1>${actor.name}</h1>

AC ${sys.attributes.ac.value}

HP ${sys.attributes.hp.value}

STR ${sys.abilities.str.value}
DEX ${sys.abilities.dex.value}
CON ${sys.abilities.con.value}
INT ${sys.abilities.int.value}
WIS ${sys.abilities.wis.value}
CHA ${sys.abilities.cha.value}

`;

download(html, actor.name+"-statblock.html");

}


async function exportParty(){

let characters = game.actors.filter(a => a.type==="character");

let html="<html><body>";

for(let c of characters){

html+=`<h1>${c.name}</h1>`;

}

html+="</body></html>";

download(html,"party-export.html");

}


function download(content, name){

const blob = new Blob([content], {type:"text/html"});

const url = URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download=name;

a.click();

}
