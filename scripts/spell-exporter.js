window.fillSpells = function fillSpells(form, spells) {

  const spellFields = 45;

  for (let i = 0; i < spells.length && i < spellFields; i++) {

    const spell = spells[i];

    const idx = i + 1;

    try {

      form.getTextField("SpellName" + idx).setText(spell.name);

      form.getTextField("SpellLevel" + idx).setText(String(spell.level));

      if (spell.prepared) {

        try {
          form.getCheckBox("Prepared" + idx).check();
        } catch (e) {}

      }

    } catch (e) {}

  }

}
