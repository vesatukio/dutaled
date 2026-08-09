const SHEET_ID = "1sDe2nlPiRckTpcv0fdH1TEMCoeZ0653kxJqMgUfqbmc";

function doGet() {
  try {

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("PRODUK");

    if (!sheet) {
      throw new Error("Sheet PRODUK tidak ditemukan");
    }

    const data = sheet.getDataRange().getValues();

    const produk = [];

    for (let i = 1; i < data.length; i++) {

      if (!data[i][1]) continue;

      const harga = Number(data[i][2]) || 0;
      const diskon = Number(data[i][3]) || 0;

      const hargaJual = Math.round(
        harga - (harga * diskon / 100)
      );

      produk.push({
        id: data[i][0],
        nama: data[i][1],
        harga: harga,
        diskon: diskon,
        hargaJual: hargaJual,
        gambar: data[i][4],
        kategori: data[i][5],
        stok: data[i][6]
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(produk))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    return ContentService
      .createTextOutput(JSON.stringify({
        error: true,
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
