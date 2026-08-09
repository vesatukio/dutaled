/* =====================================================
   DUTA TERANG LED
   app.js
===================================================== */

// ===============================
// KONFIGURASI
// ===============================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzU1s51DgfP4wC2Gdp2OYd8Ba0dVp-UIM-m_3MErk4lbs7sJBTggQb-M_JNvFeEryiy/exec";

// GANTI dengan nomor WhatsApp toko
// Contoh: 628123456789
const WHATSAPP_NUMBER = "6283157925577";


// ===============================
// DATA
// ===============================

let semuaProduk = [];
let kategoriAktif = "Semua";


// ===============================
// ELEMENT
// ===============================

const productList = document.getElementById("productList");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");
const jumlahProduk = document.getElementById("jumlahProduk");
const categoryList = document.getElementById("categoryList");


// ===============================
// RUPIAH
// ===============================

function rupiah(angka) {
  return Number(angka || 0).toLocaleString("id-ID");
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ===============================
// LOAD DATA GOOGLE SHEET
// ===============================

async function loadProducts() {

  try {

    loading.classList.remove("hidden");

    productList.innerHTML = "";

    empty.classList.add("hidden");

    jumlahProduk.textContent =
      "Memuat produk...";


    const response = await fetch(
      API_URL + "?t=" + Date.now()
    );


    if (!response.ok) {
      throw new Error(
        "HTTP Error " + response.status
      );
    }


    const data = await response.json();


    console.log("Data API:", data);


    if (data.error) {
      throw new Error(
        data.message || "API Error"
      );
    }


    semuaProduk = Array.isArray(data)
      ? data
      : [];


    buatKategori();

    tampilkanProduk();


  } catch (error) {

    console.error(
      "Gagal memuat produk:",
      error
    );


    loading.innerHTML = `
      <div class="error-box">
        <div class="error-icon">⚠️</div>

        <strong>
          Katalog belum dapat dimuat
        </strong>

        <p>
          Periksa koneksi Google Sheet
          dan Apps Script.
        </p>

        <small>
          ${escapeHTML(error.message)}
        </small>

        <button
          onclick="loadProducts()"
          class="retry-button"
        >
          🔄 Coba Lagi
        </button>
      </div>
    `;

  }

}


// ===============================
// KATEGORI
// ===============================

function buatKategori() {

  categoryList.innerHTML = "";


  const daftar = [
    ...new Set(
      semuaProduk
        .map(p =>
          String(p.kategori || "").trim()
        )
        .filter(Boolean)
    )
  ];


  daftar.forEach(kategori => {

    const button =
      document.createElement("button");


    button.className = "category";

    button.textContent = kategori;


    button.onclick = function () {

      kategoriAktif = kategori;

      document
        .querySelectorAll(".category")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      const semuaButton =
        document.querySelector(
          '.category[data-category="Semua"]'
        );

      if (semuaButton) {
        semuaButton.classList.remove("active");
      }


      button.classList.add("active");

      tampilkanProduk();

    };


    categoryList.appendChild(button);

  });

}


// ===============================
// FILTER PRODUK
// ===============================

function produkTerfilter() {

  const kata =
    searchInput.value
      .toLowerCase()
      .trim();


  return semuaProduk.filter(product => {

    const nama =
      String(product.nama || "")
        .toLowerCase();


    const kategori =
      String(product.kategori || "")
        .toLowerCase();


    const cocokSearch =
      !kata ||
      nama.includes(kata) ||
      kategori.includes(kata);


    const cocokKategori =
      kategoriAktif === "Semua" ||
      kategori ===
        kategoriAktif.toLowerCase();


    return (
      cocokSearch &&
      cocokKategori
    );

  });

}


// ===============================
// TAMPILKAN PRODUK
// ===============================

function tampilkanProduk() {

  const hasil =
    produkTerfilter();


  loading.classList.add("hidden");

  productList.innerHTML = "";


  jumlahProduk.textContent =
    hasil.length +
    " produk";


  if (!hasil.length) {

    empty.classList.remove("hidden");

    return;

  }


  empty.classList.add("hidden");


  hasil.forEach(product => {

    productList.appendChild(
      buatKartu(product)
    );

  });

}


// ===============================
// KARTU PRODUK
// ===============================

function buatKartu(product) {

  const card =
    document.createElement("article");


  card.className =
    "product-card";


  const nama =
    String(
      product.nama || "Produk"
    );


  const harga =
    Number(
      product.harga || 0
    );


  const diskon =
    Number(
      product.diskon || 0
    );


  let hargaJual;


  if (
    product.hargaJual !== undefined &&
    product.hargaJual !== ""
  ) {

    hargaJual =
      Number(product.hargaJual);

  } else {

    hargaJual =
      Math.round(
        harga -
        (harga * diskon / 100)
      );

  }


  const gambar =
    String(
      product.gambar || ""
    ).trim();


  const stok =
    Number(
      product.stok || 0
    );


  let diskonHTML = "";

  if (
    diskon > 0 &&
    hargaJual < harga
  ) {

    diskonHTML = `
      <span class="discount-badge">
        -${diskon}%
      </span>
    `;

  }


  let hargaLama = "";

  if (
    harga > hargaJual
  ) {

    hargaLama = `
      <div class="old-price">
        Rp${rupiah(harga)}
      </div>
    `;

  }


  let gambarHTML;


  if (gambar) {

    gambarHTML = `
      <img
        src="${escapeHTML(gambar)}"
        alt="${escapeHTML(nama)}"
        loading="lazy"
        onerror="gambarError(this)"
      >
    `;

  } else {

    gambarHTML = `
      <div class="no-image">
        💡
      </div>
    `;

  }


  const stokHTML =
    stok > 0
      ? `<span class="stock">Stok ${stok}</span>`
      : `<span class="stock empty-stock">Habis</span>`;


  card.innerHTML = `

    <div class="product-image">

      ${gambarHTML}

      ${diskonHTML}

    </div>


    <div class="product-body">

      <h3 class="product-name">
        ${escapeHTML(nama)}
      </h3>


      ${hargaLama}


      <div class="sale-price">
        Rp${rupiah(hargaJual)}
      </div>


      <div class="product-bottom">

        ${stokHTML}

        <span class="category-name">
          ${escapeHTML(
            product.kategori || ""
          )}
        </span>

      </div>


      <button
        class="order-button"
        onclick="pesanProduk(
          '${escapeHTML(nama)
            .replace(/'/g, "\\'")}'
        )"
      >
        💬 Pesan
      </button>

    </div>

  `;


  return card;

}


// ===============================
// GAMBAR ERROR
// ===============================

function gambarError(img) {

  img.style.display = "none";

  img.parentElement.innerHTML = `
    <div class="no-image">
      💡
    </div>
  `;

}


// ===============================
// PESAN PRODUK
// ===============================

function pesanProduk(nama) {

  if (
    WHATSAPP_NUMBER.includes("xxxx")
  ) {

    alert(
      "Nomor WhatsApp belum diisi di app.js"
    );

    return;

  }


  const pesan =
`Halo Duta Terang LED,

Saya ingin pesan:

Produk: ${nama}

Mohon informasi stok dan harga terbaru.

Terima kasih.`;


  bukaWhatsApp(pesan);

}


// ===============================
// WHATSAPP
// ===============================

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


// ===============================
// SHARE WHATSAPP
// ===============================

function shareWhatsApp() {

  const url =
    window.location.href;


  const text =
    "Katalog Duta Terang LED:\n" +
    url;


  window.open(
    "https://wa.me/?text=" +
    encodeURIComponent(text),
    "_blank"
  );

}


// ===============================
// SHARE FACEBOOK
// ===============================

function shareFacebook() {

  const url =
    window.location.href;


  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(url),
    "_blank"
  );

}


// ===============================
// COPY LINK
// ===============================

async function copyLink() {

  const url =
    window.location.href;


  try {

    await navigator.clipboard.writeText(
      url
    );

    alert(
      "Link berhasil disalin!"
    );

  } catch {

    const input =
      document.createElement("input");

    input.value = url;

    document.body.appendChild(input);

    input.select();

    document.execCommand("copy");

    input.remove();

    alert(
      "Link berhasil disalin!"
    );

  }

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
  "input",
  tampilkanProduk
);


// ===============================
// BUTTON SEMUA
// ===============================

const semuaButton =
  document.querySelector(
    '.category[data-category="Semua"]'
  );


if (semuaButton) {

  semuaButton.onclick =
    function () {

      kategoriAktif =
        "Semua";


      document
        .querySelectorAll(".category")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      semuaButton.classList.add(
        "active"
      );


      tampilkanProduk();

    };

}


// ===============================
// START
// ===============================

loadProducts();
