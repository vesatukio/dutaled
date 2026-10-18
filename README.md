# DutaLED — Katalog Toko

Katalog toko statis dan responsif menggunakan HTML, CSS, dan JavaScript murni. Tidak perlu npm/build step; cocok untuk GitHub Pages atau hosting statis.

## Fitur
- Katalog produk dengan kategori, pencarian nama/kode, dan pengurutan harga.
- Keranjang belanja, ubah kuantitas, hapus produk, dan penyimpanan keranjang di browser.
- Keranjang belanja dapat menyalin ringkasan pesanan tanpa layanan pesan eksternal.
- Layout responsif untuk HP, tablet, dan desktop.
- Data produk dipisahkan dari tampilan agar mudah diedit.
- Varian Lampu LED Aliano 5W, 7W, 9W, 12W, 15W, 18W, 25W, 30W, 40W, dan 50W dalam satu kartu pilihan watt.
- Harga diskon otomatis dihitung ulang menurut jumlah pembelian dan promo bertanggal. Atur `promoToko` sekali di `products.js` untuk promo seluruh katalog, atau edit diskon retail/kuantitas per produk.
- Estimasi laba rupiah dan persentase ditampilkan pada kartu produk dan keranjang setelah diskon.

## Konfigurasi
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
- Semua produk langsung tampil pada halaman utama; tidak ada halaman admin atau tombol WhatsApp.
- Tombol pada keranjang menyalin ringkasan pesanan agar bisa disimpan atau ditempel secara manual.
- Produk, harga, modal, laba, dan stok bawaan merupakan data demo. Ganti semuanya dengan angka sebenarnya sebelum dipakai.
- Karena fitur laba ditampilkan pada katalog publik, properti `cost` di `products.js` dapat dilihat pengunjung melalui sumber halaman. Jangan gunakan biaya/modal rahasia; jika margin harus privat, perhitungan laba perlu dipindah ke area admin/backend yang terlindungi.
- Keranjang tersimpan lokal di browser. Tidak ada pembayaran online, backend, atau sinkronisasi stok. Harga diskon terjadwal akan berubah otomatis di browser saat periode promo dimulai/berakhir, dan halaman memperbarui tampilan tiap menit. Untuk mengubah diskon, edit `retailDiscount`, `quantityTiers`, atau `promo` di `products.js` lalu commit ke GitHub. Harga akhir dihitung di browser dan tetap harus dikonfirmasi oleh toko.
- Pastikan data produk sudah benar sebelum mengarahkan domain `dutaled.my.id` ke hosting ini.


