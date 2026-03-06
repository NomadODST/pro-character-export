window.parseActorItems = function parseActorItems(actor) {

  const weapons = [];
  const spells = [];
  const feats = [];
  const equipment = [];
  const tools = [];
  const armor = [];

  for (const item of actor.items) {

    switch (item.type) {

      case "weapon":
        weapons.push(parseWeapon(actor, item));
        break;

      case "spell":
        spells.push(parseSpell(item));
        break;

      case "feat":
        feats.push(item.name);
        break;

      case "equipment":

        if (item.system.armor) {
          armor.push(item.name);
        }

        equipment.push({
          name: item.name,
          qty: item.system.quantity || 1,
          weight: item.system.weight || 0
        });

        break;

      case "consumable":

        equipment.push({
          name: item.name,
          qty: item.system.quantity || 1
        });

        break;

      case "tool":

        tools.push(item.name);

        break;

      case "loot":

        equipment.push({
          name: item.name,
          qty: item.system.quantity || 1
        });

        break;

    }

  }

  spells.sort((a, b) => a.level - b.level);

  return {
    weapons,
    spells,
    feats,
    equipment,
    tools,
    armor
  };

}


function parseWeapon(actor, item) {

  const ability = item.system.abilityMod || "str";

  const mod = actor.system.abilities[ability].mod;

  const prof = item.system.proficient
    ? actor.system.attributes.prof
    : 0;

  const magic = Number(item.system.attackBonus || 0);

  const attack = mod + prof + magic;

  const dmg = item.system?.damage?.parts?.[0];

  return {

    name: item.name,
    attack,
    damage: dmg ? dmg[0] : "",
    damageType: dmg ? dmg[1] : ""

  };

}


function parseSpell(item) {

  return {

    name: item.name,
    level: item.system.level,
    school: item.system.school,
    prepared: item.system.preparation?.prepared

  };

}
