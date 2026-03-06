window.fillSpells = function fillSpells(form, spells) {

  const maxSpells = 45;

  for (let i = 0; i < spells.length && i < maxSpells; i++) {

    const spell = spells[i];

    const idx = i + 1;

    try {

      form.getTextField("SpellName" + idx).setText(spell.name);

      form.getTextField("SpellLevel" + idx).setText(String(spell.level));

      if (spell.prepared) {

        form.getCheckBox("Prepared" + idx).check();

      }

    } catch (e) {}

  }

}
