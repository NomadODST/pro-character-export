Hooks.on("renderActorSheet", addExportButton);
Hooks.on("renderActorSheet5eCharacter", addExportButton);


/* ===============================
   BUTTON CREATION (ROBUST)
================================ */

function addExportButton(app, html) {

  try {

    if (!app.actor) return;

    if (app.actor.type !== "character") return;

    if (html.find(".pro-export").length) return;

    const btn = $(
      `<a class="pro-export"><i class="fas fa-file-pdf"></i> Export PDF</a>`
    );

    btn.on("click", () => exportCharacterPDF(app.actor));

    const appElement = html.closest(".app");

    if (!appElement.length) return;

    const headerActions = appElement.find(".window-header .header-actions");

    if (headerActions.length) {

      headerActions.append(btn);

      return;

    }

    const header = appElement.find(".window-header");

    if (header.length) {

      header.append(btn);

      return;

    }

    console.warn("Pro Character Export: could not find header location.");

  } catch (err) {

    console.error("Pro Character Export button error:", err);

  }

}


/* ===============================
   EXPORT FUNCTION
================================ */

async function exportCharacterPDF(actor) {

  try {

    if (game.user.isGM) {

      console.log(
        "Pro Character Export: run scanPDFFIelds() in console to list PDF fields."
      );

    }

    const mapping = await fetch(
      "modules/pro-character-export/mappings/official-5e.json"
    ).then(r => r.json());

    const pdfBytes = await fetch(
      "modules/pro-character-export/templates/5e-character-sheet.pdf"
    ).then(r => r.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    const form = pdfDoc.getForm();

    const pdfFields = form.getFields().map(f => f.getName());

    const parsed = parseActorItems(actor);

    /* ===============================
       FIELD MAPPING
    ================================ */

    for (const field of mapping.fields) {

      try {

        if (!pdfFields.includes(field.pdf)) continue;

        const value = resolveFoundryPath(actor, field.source, parsed);

        if (field.type === "checkbox") {

          if (value) form.getCheckBox(field.pdf).check();

        } else {

          form.getTextField(field.pdf).setText(String(value ?? ""));

        }

      } catch (e) {

        console.warn("Mapping error:", field.pdf, e);

      }

    }

    /* ===============================
       WEAPONS
    ================================ */

    fillWeapons(form, parsed.weapons);

    /* ===============================
       FEATURES
    ================================ */

    fillFeatures(form, parsed.feats);

    /* ===============================
       INVENTORY
    ================================ */

    fillInventory(form, parsed.equipment);

    /* ===============================
       SPELLS
    ================================ */

    fillSpells(form, parsed.spells);

    /* ===============================
       SAVE PDF
    ================================ */

    const finalPdf = await pdfDoc.save();

    const blob = new Blob([finalPdf], { type: "application/pdf" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = actor.name + "-character-sheet.pdf";

    link.click();

  } catch (err) {

    console.error("Pro Character Export failed:", err);

  }

}


/* ===============================
   PATH RESOLVER
================================ */

function resolveFoundryPath(actor, path, parsed) {

  try {

    if (!path) return "";

    if (path === "game.user.name") return game.user.name;

    if (path === "items[type=weapon]") return parsed.weapons;

    if (path === "items[type=spell]") return parsed.spells;

    if (path === "items[type=feat]") return parsed.feats;

    const parts = path.split(".");

    let obj = actor;

    for (const p of parts) {

      if (obj == null) return "";

      obj = obj[p];

    }

    return obj;

  } catch {

    return "";

  }

}
