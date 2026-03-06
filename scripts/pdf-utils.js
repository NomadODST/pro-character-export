function fillWeapons(form,weapons){

for(let i=0;i<weapons.length && i<6;i++){

const w=weapons[i];

const idx=i+1;

try{

form.getTextField("Wpn Name"+idx).setText(w.name);

form.getTextField("Wpn"+idx+" AtkBonus").setText(w.attack);

form.getTextField("Wpn"+idx+" Damage").setText(w.damage);

}catch(e){}

}

}

function fillFeatures(form,features){

const text=features.join(", ");

try{

form.getTextField("Features and Traits").setText(text);

}catch(e){}

}