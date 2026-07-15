import { supabase } from './api/supabase-client.js';

// Fungsi prosesCheckout yang tadi
async function prosesCheckout(dataPembeli) {
    // ... (kode Anda yang tadi) ...
}

// Menangkap event submit form
document.getElementById('form-checkout').addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman reload

    // Ambil data dari form
    const dataPembeli = {
        nama_pembeli: document.getElementById('nama').value,
        no_hp: document.getElementById('no_hp').value,
        alamat: document.getElementById('alamat').value
    };

    // Jalankan fungsi
    await prosesCheckout(dataPembeli);
});
