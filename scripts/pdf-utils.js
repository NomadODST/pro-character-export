window.fillWeapons = function fillWeapons(form,weapons){

for(let i=0;i<weapons.length && i<6;i++){

const w=weapons[i];

const idx=i+1;

try{

form.getTextField("Wpn Name"+idx).setText(w.name);

form.getTextField("Wpn"+idx+" AtkBonus").setText(String(w.attack));

form.getTextField("Wpn"+idx+" Damage").setText(w.damage);

}catch(e){}

}

}

window.fillFeatures = function fillFeatures(form,features){

try{

form.getTextField("Features and Traits").setText(features.join(", "));

}catch(e){}

}

window.fillInventory = function fillInventory(form,items){

try{

const text = items.map(i=>`${i.name} x${i.qty}`).join(", ");

form.getTextField("Equipment").setText(text);

}catch(e){}

}
