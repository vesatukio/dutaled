import { supabase } from './api/supabase-client.js';

async function testKoneksi() {
    const { data, error } = await supabase
        .from('produk')
        .select('*');

    if (error) {
        console.error("Gagal ambil data:", error);
    } else {
        console.log("Data Produk dari Supabase:", data);
        // Di sini nanti kita akan looping data untuk ditampilkan di kartu produk
    }
}

testKoneksi();
