import { supabase } from './api/supabase-client.js';
import { tambahKeKeranjang } from './cart.js'; // Impor fungsi keranjang

async function renderProduk() {
    const { data: produk } = await supabase.from('produk').select('*');
    const container = document.getElementById('product-container');

    container.innerHTML = produk.map(item => `
        <div class="product-card">
            <img src="${item.foto_urls[0]}" alt="${item.nama}">
            <h3>${item.nama}</h3>
            <p>Rp ${item.harga_jual.toLocaleString()}</p>
            <button onclick='window.tambahProduk(${JSON.stringify(item)})'>Beli</button>
        </div>
    `).join('');
}

// Global function agar bisa dipanggil dari HTML
window.tambahProduk = tambahKeKeranjang;

renderProduk();
