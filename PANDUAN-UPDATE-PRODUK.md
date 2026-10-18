# Cara Update Produk DutaLED

Daftar produk website ada di file **`products.js`**. Tidak perlu mengedit `index.html` atau `app.js` untuk mengubah katalog.

## Mengubah produk yang sudah ada
1. Buka file [products.js](./products.js).
2. Klik ikon pensil **Edit this file**.
3. Cari produk berdasarkan nama atau kode, lalu ubah nilai yang diperlukan.
4. Klik **Commit changes** ke branch `main`.
5. Tunggu GitHub Actions selesai, lalu buka website dan refresh.

## Menambah produk baru
Salin template ini ke dalam daftar `window.DUTALED_PRODUCTS`, sebelum tanda penutup `];`. Pastikan ada koma setelah produk sebelumnya.

```js
{
  id: "lampu-led-15w",       // ID unik, huruf kecil dan tanda hubung
  name: "Lampu LED 15W",
  code: "DL-LMP-015",
  category: "Lampu LED",
  price: 20000,              // harga jual dalam rupiah, tanpa titik
  cost: 13000,               // modal dalam rupiah
  stock: 20,
  badge: "Baru",
  emoji: "💡",
  image: "",                 // URL foto produk; kosong = pakai emoji
  description: "Lampu LED 15W untuk rumah dan toko."
}
```

## Arti kolom
- `id`: kode unik internal; jangan gunakan ID yang sama untuk dua produk.
- `name`: nama yang tampil di katalog.
- `code`: kode produk/SKU.
- `category`: kategori produk, misalnya `Lampu LED`, `Modul LED`, atau `Aksesori`.
- `price`: harga jual per unit dalam rupiah, misalnya `25000` = Rp25.000.
- `cost`: modal per unit. **Nilai ini dipakai untuk menghitung estimasi laba dan tampil di kode website; jangan isi jika tidak ingin informasi modal diketahui publik.**
- `stock`: jumlah stok.
- `badge`: label kecil seperti `Baru` atau `Populer`; kosongkan dengan `""` jika tidak perlu.
- `emoji`: ikon pengganti jika foto tidak diisi.
- `image`: URL foto yang bisa diakses publik.
- `description`: deskripsi singkat.

## Menghapus produk
Hapus seluruh blok `{ ... }` milik produk tersebut dari daftar, termasuk koma yang sesuai. Jangan hapus tanda pembuka/penutup daftar.

## Catatan penting
- Harga dan stok saat ini mungkin masih data contoh. Periksa dan ganti dengan data toko yang benar.
- Perubahan baru tampil setelah di-commit dan deploy GitHub Pages selesai.
- Jangan menaruh password, token, atau data rahasia di file katalog publik.
