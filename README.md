# Duta Terang LED — Katalog & Kasir

Website statis responsif untuk katalog produk dan operasional toko. Berjalan tanpa proses build.

## Fitur utama
- Katalog dengan pencarian, kategori, varian watt, diskon, dan keranjang.
- Kasir: scan SKU/barcode melalui input atau kamera, transaksi, riwayat, dan laporan.
- Pengelolaan harga jual dan modal per produk.
- Kalkulator harga supplier dengan diskon supplier terpisah, modal bersih, target kenaikan, harga jual, untung nominal, dan margin.
- Ekspor/pulihkan cadangan data melalui halaman kasir.
- PWA yang bisa dipasang di HP dan mendukung cache offline dasar.

## File penting
- `index.html`, `style.css`, `app.js`: katalog publik.
- `products.js`: data produk katalog. **Harga dan stok bawaan adalah contoh; periksa sebelum dipakai.**
- `kasir.html`, `kasir.js`: kasir, laporan, modal produk, dan kalkulator harga.
- `home-scan.js`: scan barcode dari halaman katalog.
- `manifest.webmanifest`, `pwa.js`, `sw.js`: fitur PWA.
- `admin.html`, `admin.js`, `admin.css`: alat admin yang tersedia di proyek.

## Cara menggunakan kalkulator harga
1. Buka halaman **Kasir & laporan**, lalu pilih tab **Produk & modal**.
2. Isi harga supplier dan diskon supplier. Kalkulator menghitung modal bersih setelah diskon.
3. Masukkan target kenaikan dari modal bersih dan periksa harga jual, untung, serta margin.
4. Pilih produk jika ingin menyimpan modal bersih dan harga jual ke produk tersebut.
5. Buat cadangan data secara berkala.

## Penting
- Data kasir, modal, dan transaksi disimpan di browser/perangkat yang digunakan; belum otomatis tersinkron ke perangkat lain atau Google Sheet.
- Data modal di kasir bersifat lokal pada browser. Jangan menghapus data browser sebelum mengekspor cadangan.
- Harga, diskon, dan stok di `products.js` harus diperiksa dan diganti dengan data toko sebenarnya.
- Harga katalog publik bukan jaminan harga akhir; konfirmasikan stok dan harga saat transaksi.
- Domain GitHub Pages dikonfigurasi melalui file `CNAME` dan menu **Settings → Pages**.
