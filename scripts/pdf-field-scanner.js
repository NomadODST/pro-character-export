window.scanPDFFIelds = async function scanPDFFIelds() {

  const pdfBytes = await fetch(
    "modules/pro-character-export/templates/5e-character-sheet.pdf"
  ).then(r => r.arrayBuffer());

  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

  const form = pdfDoc.getForm();

  const fields = form.getFields();

  const names = fields.map(f => f.getName());

  console.log("===== PDF FIELD SCAN =====");
  console.log("Total Fields:", names.length);

  names.forEach(n => console.log(n));

  console.log("===== END PDF FIELD SCAN =====");

}
