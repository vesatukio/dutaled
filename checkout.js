import { supabase } from './api/supabase-client.js';

document.getElementById('form-checkout').addEventListener('submit', async (e) => {
    e.preventDefault();

    const keranjang = JSON.parse(localStorage.getItem('keranjang'));
    if (!keranjang || keranjang.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    const dataPembeli = {
        nama_pembeli: document.getElementById('nama').value,
        no_hp: document.getElementById('no_hp').value,
        alamat: document.getElementById('alamat').value,
        total_harga: keranjang.reduce((sum, item) => sum + (item.harga_jual * item.qty), 0)
    };

    const { data, error } = await supabase
        .from('pesanan')
        .insert([dataPembeli]);

    if (error) {
        console.error("Error:", error);
        alert("Gagal memproses pesanan.");
    } else {
        localStorage.removeItem('keranjang');
        alert("Pesanan berhasil! Segera hubungi admin via WhatsApp untuk konfirmasi.");
        // Opsi: Redirect ke WhatsApp otomatis
        window.location.href = `https://wa.me/628123456789?text=Halo Admin, saya ingin konfirmasi pesanan atas nama ${dataPembeli.nama_pembeli}`;
    }
});
