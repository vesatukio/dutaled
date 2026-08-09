/* =====================================================
   DUTA TERANG LED
   GOOGLE SHEET → GITHUB
===================================================== */


/* =====================================================
   1. MASUKKAN URL WEB APP APPS SCRIPT DI SINI
===================================================== */

const API_URL =
  "function doGet() {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName("PRODUK");

    if (!sheet) {

      return ContentService
        .createTextOutput(
          JSON.stringify({
            error: true,
            message: "Sheet PRODUK tidak ditemukan"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );

    }

    const data =
      sheet.getDataRange().getValues();

    const hasil = [];

    for (let i = 1; i < data.length; i++) {

      if (!data[i][1]) continue;

      const harga =
        Number(data[i][2]) || 0;

      const diskon =
        Number(data[i][3]) || 0;

      const hargaJual =
        Math.round(
          harga -
          (harga * diskon / 100)
        );

      hasil.push({

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
      .createTextOutput(
        JSON.stringify(hasil)
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  } catch (error) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          error: true,
          message: error.message
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  }

}";


/* =====================================================
   2. NOMOR WHATSAPP
   Contoh:
   08123456789
   menjadi:
   628123456789
===================================================== */

const WHATSAPP_NUMBER =
  "6283157925577";


/* =====================================================
   DATA
===================================================== */

let semuaProduk = [];

let kategoriAktif = "Semua";


/* =====================================================
   ELEMENT
===================================================== */

const productList =
  document.getElementById("productList");

const loading =
  document.getElementById("loading");

const empty =
  document.getElementById("empty");

const searchInput =
  document.getElementById("searchInput");

const jumlahProduk =
  document.getElementById("jumlahProduk");

const categoryList =
  document.getElementById("categoryList");


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function rupiah(angka) {

  return Number(angka || 0)
    .toLocaleString("id-ID");

}


/* =====================================================
   LOAD DATA GOOGLE SHEET
===================================================== */

async function loadProducts() {

  try {

    loading.classList.remove("hidden");

    productList.innerHTML = "";

    empty.classList.add("hidden");


    if (
      !API_URL ||
      API_URL ===
      "function doGet() {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName("PRODUK");

    if (!sheet) {

      return ContentService
        .createTextOutput(
          JSON.stringify({
            error: true,
            message: "Sheet PRODUK tidak ditemukan"
          })
        )
        .setMimeType(
          ContentService.MimeType.JSON
        );

    }

    const data =
      sheet.getDataRange().getValues();

    const hasil = [];

    for (let i = 1; i < data.length; i++) {

      if (!data[i][1]) continue;

      const harga =
        Number(data[i][2]) || 0;

      const diskon =
        Number(data[i][3]) || 0;

      const hargaJual =
        Math.round(
          harga -
          (harga * diskon / 100)
        );

      hasil.push({

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
      .createTextOutput(
        JSON.stringify(hasil)
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  } catch (error) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          error: true,
          message: error.message
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  }

}"
    ) {

      throw new Error(
        "URL Apps Script belum dimasukkan."
      );

    }


    const response =
      await fetch(API_URL);


    if (!response.ok) {

      throw new Error(
        "Gagal mengambil data."
      );

    }


    const data =
      await response.json();


    semuaProduk =
      Array.isArray(data)
        ? data
        : data.produk || [];


    buatKategori();

    tampilkanProduk();


  } catch (error) {

    console.error(error);

    loading.innerHTML = `
      <div style="font-size:35px">⚠️</div>

      <p>
        Katalog belum dapat dimuat.
      </p>

      <small>
        Periksa URL Apps Script.
      </small>
    `;

  }

}


/* =====================================================
   BUAT KATEGORI OTOMATIS
===================================================== */

function buatKategori() {

  categoryList.innerHTML = "";


  const kategori =
    [...new Set(

      semuaProduk

        .map(item =>
          String(item.kategori || "").trim()
        )

        .filter(Boolean)

    )];


  kategori.forEach(nama => {

    const button =
      document.createElement("button");


    button.className =
      "category";


    button.textContent =
      nama;


    button.dataset.category =
      nama;


    button.onclick = function() {

      kategoriAktif =
        nama;


      document
        .querySelectorAll(".category")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      document
        .querySelector(
          '.category[data-category="' +
          nama +
          '"]'
        )
        ?.classList.add("active");


      tampilkanProduk();

    };


    categoryList.appendChild(button);

  });

}


/* =====================================================
   FILTER + SEARCH
===================================================== */

function getProdukFiltrados() {

  const texto =
    searchInput.value
      .toLowerCase()
      .trim();


  return todosProdutosFiltrados =
    semuaProduk.filter(item => {

      const nama =
        String(item.nama || "")
          .toLowerCase();


      const kategori =
        String(item.kategori || "")
          .toLowerCase();


      const cocokSearch =
        !texto ||
        nama.includes(texto) ||
        kategori.includes(texto);


      const cocokKategori =
        kategoriAktif === "Semua" ||
        String(item.kategori || "")
          .toLowerCase() ===
        kategoriAktif.toLowerCase();


      return
        cocokSearch &&
        cocokKategori;

    });

}


/* =====================================================
   TAMPILKAN PRODUK
===================================================== */

function tampilkanProduk() {

  const hasil =
    getProdukFiltrados();


  productList.innerHTML = "";


  loading.classList.add("hidden");


  jumlahProduk.textContent =
    hasil.length +
    " produk";


  if (!hasil.length) {

    empty.classList.remove("hidden");

    return;

  }


  empty.classList.add("hidden");


  hasil.forEach(item => {

    productList.appendChild(
      buatKartuProduk(item)
    );

  });

}


/* =====================================================
   KARTU PRODUK
===================================================== */

function buatKartuProduk(item) {

  const card =
    document.createElement("div");


  card.className =
    "product";


  const harga =
    Number(item.harga) || 0;


  const diskon =
    Number(item.diskon) || 0;


  /*
    Jika Harga Jual ada di Sheet,
    gunakan Harga Jual.

    Kalau kosong,
    hitung otomatis.
  */

  let hargaJual;


  if (
    item.hargaJual !== undefined &&
    item.hargaJual !== ""
  ) {

    hargaJual =
      Number(item.hargaJual);

  } else {

    hargaJual =
      Math.round(
        harga -
        (harga * diskon / 100)
      );

  }


  let gambar =
    String(item.gambar || "").trim();


  if (!gambar) {

    gambar =
      "https://via.placeholder.com/500x500?text=No+Image";

  }


  /*
    DISKON
  */

  let diskonHTML = "";


  if (diskon > 0) {

    diskonHTML = `
      <div class="discount">
        -${diskon}%
      </div>
    `;

  }


  /*
    HARGA COREt
  */

  let hargaLamaHTML = "";


  if (
    diskon > 0 &&
    harga > hargaJual
  ) {

    hargaLamaHTML = `
      <div class="old-price">
        Rp${rupiah(harga)}
      </div>
    `;

  }


  card.innerHTML = `

    ${diskonHTML}

    <img
      class="product-image"
      src="${gambar}"
      alt="${escapeHTML(item.nama || "Produk")}"
      loading="lazy"
      onerror="
        this.onerror=null;
        this.src='https://via.placeholder.com/500x500?text=No+Image';
      "
    >

    <div class="product-info">

      <div class="product-name">
        ${escapeHTML(item.nama || "Produk")}
      </div>

      ${hargaLamaHTML}

      <div class="sale-price">
        Rp${rupiah(hargaJual)}
      </div>

      ${
        item.stok !== undefined &&
        item.stok !== ""
        ?
        `<div class="stock">
          Stok: ${item.stok}
        </div>`
        :
        ""
      }

    </div>

    <button
      class="order-btn"
      onclick="pesanProduk(
        '${escapeJS(item.nama || "Produk")}',
        '${hargaJual}'
      )">

      💬 Pesan

    </button>

  `;


  return card;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

  return String(text)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


/* =====================================================
   ESCAPE JAVASCRIPT
===================================================== */

function escapeJS(text) {

  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");

}


/* =====================================================
   PESAN PRODUK
===================================================== */

function pesanProduk(
  nama,
  harga
) {

  const pesan =
`Halo Duta Terang LED,

Saya ingin pesan:

Produk: ${nama}
Harga: Rp${rupiah(harga)}

Mohon informasi stok dan ongkir.

Terima kasih.`;


  bukaWhatsApp(pesan);

}


/* =====================================================
   WHATSAPP
===================================================== */

function bukaWhatsApp(pesan) {

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(pesan);


  window.open(
    url,
    "_blank"
  );

}


function chatWhatsApp() {

  bukaWhatsApp(
    "Halo Duta Terang LED, saya ingin bertanya tentang produk."
  );

}


/* =====================================================
   SHARE WHATSAPP
===================================================== */

function shareWhatsApp() {

  const url =
    window.location.href;


  const pesan =
    "Lihat katalog Duta Terang LED:\n" +
    url;


  window.open(

    "https://wa.me/?text=" +
    encodeURIComponent(pesan),

    "_blank"

  );

}


/* =====================================================
   SHARE FACEBOOK
===================================================== */

function shareFacebook() {

  const url =
    window.location.href;


  window.open(

    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(url),

    "_blank"

  );

}


/* =====================================================
   COPY LINK
===================================================== */

async function copyLink() {

  try {

    await navigator.clipboard.writeText(
      window.location.href
    );


    alert(
      "Link berhasil disalin!"
    );


  } catch {

    alert(
      "Silakan salin link dari browser."
    );

  }

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
  "input",
  function() {

    tampilkanProduk();

  }
);


/* =====================================================
   KATEGORI SEMUA
===================================================== */

document
  .querySelector(
    '.category[data-category="Semua"]'
  )
  ?.addEventListener(
    "click",
    function() {

      kategoriAktif =
        "Semua";


      document
        .querySelectorAll(".category")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      this.classList.add("active");


      tampilkanProduk();

    }
  );


/* =====================================================
   START
===================================================== */

loadProducts();
