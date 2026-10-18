# Setup Admin Produk DutaLED

Panel admin tersedia di `/admin.html`. Kode halaman sudah masuk ke repositori, tetapi **fitur database belum aktif sampai SQL dijalankan dan akun admin diberi izin**.

## 1. Buat tabel dan kebijakan keamanan

1. Buka [Supabase Dashboard](https://supabase.com/dashboard/project/uioibsxnukjkandkzpmn/sql/new).
2. Pastikan proyek yang dipilih bernama **DutaLED**.
3. Buka file [supabase-setup.sql](./supabase-setup.sql), salin seluruh isinya, tempel ke SQL Editor, lalu klik **Run**.
4. Periksa bahwa tabel `products` dan `admins` berhasil dibuat.

SQL mengaktifkan Row Level Security (RLS): publik hanya dapat membaca produk aktif; hanya UUID yang terdaftar pada tabel `admins` dapat menambah, mengubah, dan menghapus produk. Kunci yang ada di `supabase-config.js` adalah publishable key untuk browser, bukan service-role key.

## 2. Buat akun admin

1. Di Supabase, buka **Authentication → Users → Add user**.
2. Buat akun dengan email milik admin dan password yang kuat. Jangan mengaktifkan pendaftaran umum dari halaman website.
3. Salin **User UID** akun tersebut.
4. Buka SQL Editor dan jalankan perintah ini dengan mengganti UUID contoh:

```sql
insert into public.admins (user_id)
values ('GANTI-DENGAN-USER-UUID');
```

Jangan bagikan password admin kepada siapa pun. Untuk menambah admin lain, buat akun tersendiri dan tambahkan UID-nya ke tabel `admins`.

## 3. Impor katalog awal

1. Setelah GitHub Pages selesai menerbitkan perubahan, buka [dutaled.my.id/admin.html](https://dutaled.my.id/admin.html).
2. Login memakai akun yang dibuat pada langkah 2.
3. Jika tabel masih kosong, klik **Impor katalog awal**.
4. Harga dan stok awal di `products.js` sebelumnya ditandai sebagai contoh; periksa dan perbarui semua angka sebelum mengandalkannya.

## 4. Edit produk

Ubah nilai di baris tabel, lalu tekan **Simpan**. Tombol **Tambah produk** membuat baris baru dan tombol **Hapus** menghapus produk setelah konfirmasi. Untuk menyembunyikan produk tanpa menghapusnya, matikan kolom **Aktif** lalu simpan.

## Keamanan penting

- Jangan pernah memasukkan `service_role` atau secret key ke file JavaScript publik.
- Harga modal/laba internal tidak dimuat di katalog publik.
- Jangan simpan informasi rahasia di kolom deskripsi.
- Bila website belum berubah, tunggu proses GitHub Pages selesai lalu muat ulang tanpa cache.
