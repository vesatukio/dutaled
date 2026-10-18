/* DutaLED catalog: vanilla JS, no build step required. */
(() => {
  "use strict";
  // Nomor WhatsApp toko yang sudah dipakai pada situs DutaLED.
  const WHATSAPP_NUMBER = "6283157925577";
  const products = Array.isArray(window.DUTALED_PRODUCTS) ? window.DUTALED_PRODUCTS : [];
  const $ = (selector) => document.querySelector(selector);
  const rupiah = (value) => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value || 0);
  const state = {category:"Semua",query:"",sort:"featured",cart:readCart()};
  const productList = $("#productList"), categoryList = $("#categoryList");
  let toastTimer;
  function readCart(){try{return JSON.parse(localStorage.getItem("dutaled-cart")||"{}")}catch{return {}}}
  function saveCart(){try{localStorage.setItem("dutaled-cart",JSON.stringify(state.cart))}catch{}}
  function toast(message){const node=$("#toast");node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2400)}
  function safe(text){return String(text??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  function getProduct(id){return products.find(p=>p.id===id)}
  function categories(){return ["Semua",...new Set(products.map(p=>p.category).filter(Boolean))]}
  function renderCategories(){categoryList.innerHTML=categories().map(c=>'<button class="category-pill '+(c===state.category?'active':'')+'" data-category="'+safe(c)+'" aria-pressed="'+(c===state.category)+'">'+safe(c)+'</button>').join("")}
  function visibleProducts(){
    let result=products.filter(p=>(state.category==="Semua"||p.category===state.category)&&[p.name,p.code,p.category,p.description].join(" ").toLowerCase().includes(state.query.toLowerCase()));
    if(state.sort==="price-asc")result.sort((a,b)=>a.price-b.price);
    if(state.sort==="price-desc")result.sort((a,b)=>b.price-a.price);
    if(state.sort==="name")result.sort((a,b)=>a.name.localeCompare(b.name,"id"));
    return result;
  }
  function imageMarkup(p){return p.image?'<img src="'+safe(p.image)+'" alt="'+safe(p.name)+'" loading="lazy" onerror="this.remove()">':'<span class="product-emoji" aria-hidden="true">'+safe(p.emoji||"💡")+'</span>'}
  function renderProducts(){
    const items=visibleProducts();
    $("#productTotal").textContent=items.length+" produk";
    productList.innerHTML=items.map(p=>'<article class="product-card"><div class="product-visual">'+imageMarkup(p)+(p.badge?'<span class="product-badge">'+safe(p.badge)+'</span>':'')+'</div><div class="product-info"><span class="product-category">'+safe(p.category)+'</span><h3>'+safe(p.name)+'</h3><div class="product-code">Kode: '+safe(p.code)+'</div><div class="product-bottom"><div class="price">'+rupiah(p.price)+'<small>per unit · harga contoh</small></div><button class="add-button" data-add="'+safe(p.id)+'" aria-label="Tambah '+safe(p.name)+' ke keranjang" title="Tambah ke keranjang">+</button></div></div></article>').join("");
    $("#emptyState").classList.toggle("hidden",items.length>0);
  }
  function cartCount(){return Object.values(state.cart).reduce((sum,q)=>sum+q,0)}
  function cartLines(){return Object.entries(state.cart).map(([id,qty])=>({product:getProduct(id),qty})).filter(line=>line.product&&line.qty>0)}
  function renderCart(){
    const lines=cartLines(),count=cartCount(),total=lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);
    $("#cartCount").textContent=count;$("#drawerCount").textContent="("+count+")";$("#cartTotal").textContent=rupiah(total);
    $("#cartItems").innerHTML=lines.map(({product:p,qty})=>'<div class="cart-line"><div class="cart-thumb">'+(p.image?'<img src="'+safe(p.image)+'" alt="">':safe(p.emoji||"💡"))+'</div><div><h3>'+safe(p.name)+'</h3><div class="line-price">'+rupiah(p.price*qty)+'</div><div class="quantity-control"><button data-qty="'+safe(p.id)+'" data-delta="-1" aria-label="Kurangi jumlah">−</button><span>'+qty+'</span><button data-qty="'+safe(p.id)+'" data-delta="1" aria-label="Tambah jumlah">+</button></div></div><button class="remove-line" data-remove="'+safe(p.id)+'" aria-label="Hapus '+safe(p.name)+'">✕</button></div>').join("");
    $("#cartEmpty").classList.toggle("hidden",lines.length>0);$("#cartFooter").classList.toggle("hidden",lines.length===0);
  }
  function add(id,delta=1){const p=getProduct(id);if(!p)return;const next=(state.cart[id]||0)+delta;if(next<=0)delete state.cart[id];else state.cart[id]=Math.min(next,999);saveCart();renderCart();toast(delta>0?"Ditambahkan ke keranjang":"Jumlah diperbarui")}
  function openCart(){$("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.remove("hidden");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("#closeCart").focus()}
  function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.add("hidden");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
  function chatWhatsApp(message){window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(message||"Halo Duta Terang LED, saya ingin bertanya tentang produk."),"_blank","noopener,noreferrer")}
  function checkout(){
    const lines=cartLines();if(!lines.length){toast("Keranjang masih kosong.");return}
    const name=$("#customerName").value.trim();
    const message=["Halo Duta Terang LED, saya ingin memesan:","",...lines.map(({product:p,qty},i)=>(i+1)+". "+p.name+" ("+p.code+") × "+qty+" = "+rupiah(p.price*qty)),"","Estimasi total: "+rupiah(lines.reduce((s,l)=>s+l.product.price*l.qty,0)),name?"Nama: "+name:null,"","Mohon konfirmasi stok dan harga terbaru. (Harga pada katalog adalah contoh.)"].filter(Boolean).join("\n");
    chatWhatsApp(message);
  }
  categoryList.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;state.category=b.dataset.category;renderCategories();renderProducts()});
  productList.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)add(b.dataset.add)});
  $("#searchInput").addEventListener("input",e=>{state.query=e.target.value.trim();renderProducts()});
  $("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
  $("#resetFilters").addEventListener("click",()=>{state.category="Semua";state.query="";state.sort="featured";$("#searchInput").value="";$("#sortSelect").value="featured";renderCategories();renderProducts()});
  $("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#drawerBackdrop").addEventListener("click",closeCart);$("#continueShopping").addEventListener("click",()=>{closeCart();$("#produk").scrollIntoView({behavior:"smooth"})});
  $("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]");const r=e.target.closest("[data-remove]");if(q)add(q.dataset.qty,Number(q.dataset.delta));if(r){delete state.cart[r.dataset.remove];saveCart();renderCart();toast("Produk dihapus")}});
  $("#clearCart").addEventListener("click",()=>{state.cart={};saveCart();renderCart();toast("Keranjang dikosongkan")});
  $("#checkoutBtn").addEventListener("click",checkout);
  document.querySelectorAll("[data-chat]").forEach(b=>b.addEventListener("click",()=>chatWhatsApp()));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus()}});
  $("#year").textContent=new Date().getFullYear();
  renderCategories();renderProducts();renderCart();
})();