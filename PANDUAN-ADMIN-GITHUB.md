# Admin DutaLED — langsung ke GitHub

Panel admin: https://dutaled.my.id/admin.html

## Cara memakai
1. Buat Fine-grained Personal Access Token di https://github.com/settings/personal-access-tokens/new.
2. Resource owner: akun pemilik repo. Repository access: pilih hanya `dutaled`.
3. Beri izin Repository permissions → **Contents: Read and write**. Tidak perlu akses ke repo lain, Actions, Issues, atau Administration.
4. Buka halaman admin, tempel token, lalu klik Hubungkan.
5. Edit kolom produk dan tekan Simpan. Perubahan langsung dibuat sebagai commit pada `products.js` di branch `main`; GitHub Pages kemudian memperbarui katalog.

## Keamanan
GitHub Pages tidak memiliki backend rahasia. Token dimasukkan manual dan hanya disimpan di memori tab, tidak disimpan ke localStorage atau file repo. Namun, karena halaman admin adalah JavaScript publik, model ini **bukan seaman backend/OAuth**: jika kode admin disusupi, token yang sedang aktif berpotensi dicuri. Gunakan token fine-grained yang hanya punya akses Contents ke satu repo, jangan bagikan token, dan cabut token setelah selesai bila ingin lebih aman. Jangan pernah menaruh token di kode.
