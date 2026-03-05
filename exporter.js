
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
<link rel="stylesheet" href="sheet.css">
</head>

<body>

<h1>${actor.name}</h1>

<img src="${actor.img}" class="portrait">

<h2>Abilities</h2>

<ul>
<li>STR ${sys.abilities.str.value}</li>
<li>DEX ${sys.abilities.dex.value}</li>
<li>CON ${sys.abilities.con.value}</li>
<li>INT ${sys.abilities.int.value}</li>
<li>WIS ${sys.abilities.wis.value}</li>
<li>CHA ${sys.abilities.cha.value}</li>
</ul>

<h2>Combat</h2>

HP ${sys.attributes.hp.value}/${sys.attributes.hp.max}<br>
AC ${sys.attributes.ac.value}<br>
Speed ${sys.attributes.movement.walk}

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
