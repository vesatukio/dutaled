# DutaLED — Katalog Toko

Katalog toko statis dan responsif menggunakan HTML, CSS, dan JavaScript murni. Tidak perlu npm/build step; cocok untuk GitHub Pages atau hosting statis.

## Fitur
- Katalog produk dengan kategori, pencarian nama/kode, dan pengurutan harga.
- Keranjang belanja, ubah kuantitas, hapus produk, dan penyimpanan keranjang di browser.
- Checkout menyusun ringkasan pesanan untuk WhatsApp.
- Layout responsif untuk HP, tablet, dan desktop.
- Data produk dipisahkan dari tampilan agar mudah diedit.

## Konfigurasi
1. Nomor WhatsApp yang dipakai saat ini disalin dari konfigurasi situs sebelumnya. Untuk menggantinya, edit `WHATSAPP_NUMBER` di `app.js` dengan format internasional tanpa tanda + atau spasi.
2. Edit `products.js` untuk mengganti nama, kode, kategori, harga, stok, badge, emoji, deskripsi, dan URL gambar. Harga bawaan adalah DATA CONTOH, bukan harga resmi.
3. Isi properti `image` tiap produk dengan URL gambar publik untuk menampilkan foto produk asli. Jika kosong, katalog memakai emoji.
4. Uji pencarian, kategori, keranjang, dan checkout sebelum mempublikasikan.

## Menjalankan lokal
Buka `index.html` di browser atau gunakan ekstensi Live Server.

## Deploy ke GitHub Pages
1. Buka repository **Settings → Pages**.
2. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
3. Tunggu workflow selesai dan gunakan URL yang ditampilkan di halaman Pages.

## Catatan
- Produk dan harga bawaan merupakan data demo.
- Keranjang tersimpan lokal di browser. Tidak ada pembayaran online, backend, atau sinkronisasi stok.
- Pastikan data produk sudah benar sebelum mengarahkan domain `dutaled.my.id` ke hosting ini.
