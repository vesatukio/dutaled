// Pastikan baris ini ada di paling atas main.js
import { supabase } from './supabase-client.js';

// Fungsi untuk tes ambil data produk
async function initApp() {
    try {
        const { data, error } = await supabase.from('produk').select('*');
        if (error) throw error;
        console.log("Produk berhasil dimuat:", data);
    } catch (err) {
        console.error("Gagal koneksi ke Supabase:", err.message);
    }
}

initApp();
