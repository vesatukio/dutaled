(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const loginPanel=$("#loginPanel"), adminPanel=$("#adminPanel"), notice=$("#setupNotice"), loginError=$("#loginError");
  let client=null, products=[], currentUser=null;
  const columns="id,name,code,category,price,stock,badge,emoji,image,description,retail_discount,quantity_tiers,promo,sort_order,active";
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  function status(msg){$("#status").textContent=msg}
  function setupMessage(msg){notice.textContent=msg;notice.classList.remove("hidden")}
  function showAdmin(on){loginPanel.classList.toggle("hidden",on);adminPanel.classList.toggle("hidden",!on);$("#logoutBtn").classList.toggle("hidden",!on)}
  async function init(){
    if(!window.supabase?.createClient||!window.DUTALED_SUPABASE_URL||!window.DUTALED_SUPABASE_KEY){setupMessage("Konfigurasi Supabase belum terbaca. Periksa koneksi internet dan supabase-config.js.");return}
    client=window.supabase.createClient(window.DUTALED_SUPABASE_URL,window.DUTALED_SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data:{session}}=await client.auth.getSession();
    if(session) await verifyAdmin(session.user);
  }
  async function verifyAdmin(user){
    currentUser=user;
    const {data,error}=await client.from("admins").select("user_id").eq("user_id",user.id).maybeSingle();
    if(error||!data){showAdmin(false);loginError.textContent="Akun berhasil login tetapi belum diberi izin admin. Tambahkan UUID akun ini ke tabel admins melalui Supabase SQL Editor.";return false}
    showAdmin(true);loginError.textContent="";await loadProducts();return true;
  }
  async function loadProducts(){
    status("Memuat data…");
    const {data,error}=await client.from("products").select(columns).order("sort_order").order("name");
    if(error){status("Gagal memuat data");setupMessage("Database belum siap atau akses ditolak: "+error.message+" — jalankan supabase-setup.sql sesuai panduan.");return}
    products=data||[];render();status(products.length+" produk");
  }
  function inputCell(field,value,type="text",cls=""){
    if(type==="checkbox")return '<td class="active-cell"><input type="checkbox" data-field="'+field+'" '+(value?"checked":"")+' aria-label="Produk aktif"></td>';
    if(type==="textarea")return '<td><textarea class="'+cls+'" data-field="'+field+'">'+esc(value)+'</textarea></td>';
    return '<td><input class="'+cls+'" data-field="'+field+'" type="'+type+'" value="'+esc(value)+'" '+(type==="number"?'min="0" step="1"':'')+'></td>';
  }
  function render(){
    const q=$("#search").value.trim().toLowerCase();
    const shown=products.filter(p=>[p.name,p.code,p.category].join(" ").toLowerCase().includes(q));
    $("#productRows").innerHTML=shown.map(p=>'<tr data-id="'+esc(p.id)+'">'+
      inputCell("name",p.name,"text","name-field")+inputCell("code",p.code)+inputCell("category",p.category)+
      inputCell("price",p.price,"number")+inputCell("stock",p.stock,"number")+
      inputCell("image",p.image,"text","url-field")+inputCell("description",p.description,"text","desc-field")+
      inputCell("active",p.active,"checkbox")+
      '<td><div class="actions"><button class="btn save" data-action="save">Simpan</button><button class="btn delete" data-action="delete">Hapus</button></div></td></tr>').join("")||'<tr><td colspan="9" class="empty">Produk tidak ditemukan.</td></tr>';
  }
  function rowPayload(row){
    const v=f=>row.querySelector('[data-field="'+f+'"]');
    return {name:v("name").value.trim(),code:v("code").value.trim(),category:v("category").value.trim()||"Lainnya",
      price:num(v("price").value),stock:Math.max(0,Math.floor(num(v("stock").value))),image:v("image").value.trim(),
      description:v("description").value.trim(),active:v("active").checked,updated_at:new Date().toISOString()};
  }
  $("#loginForm").addEventListener("submit",async e=>{
    e.preventDefault();loginError.textContent="";
    if(!client){loginError.textContent="Supabase belum siap. Muat ulang halaman.";return}
    const btn=e.submitter;btn.disabled=true;
    const {data,error}=await client.auth.signInWithPassword({email:$("#email").value.trim(),password:$("#password").value});
    btn.disabled=false;
    if(error){loginError.textContent="Login gagal. Periksa email dan password.";return}
    await verifyAdmin(data.user);
  });
  $("#logoutBtn").addEventListener("click",async()=>{await client.auth.signOut();currentUser=null;showAdmin(false);loginError.textContent="Anda sudah keluar."});
  $("#search").addEventListener("input",render);
  $("#addBtn").addEventListener("click",async()=>{
    const id="produk-"+crypto.randomUUID().slice(0,8);
    const {error}=await client.from("products").insert({id,name:"Produk baru",code:id.toUpperCase(),category:"Lainnya",price:0,stock:0,sort_order:products.length,active:true});
    if(error){status("Gagal menambah: "+error.message);return}await loadProducts();
  });
  $("#productRows").addEventListener("click",async e=>{
    const btn=e.target.closest("button[data-action]");if(!btn)return;
    const row=btn.closest("tr"),id=row.dataset.id,action=btn.dataset.action;
    if(action==="delete"){
      if(!confirm("Hapus produk "+(row.querySelector('[data-field="name"]').value||id)+"?"))return;
      btn.disabled=true;const {error}=await client.from("products").delete().eq("id",id);
      if(error){status("Gagal menghapus: "+error.message);btn.disabled=false;return}
      products=products.filter(p=>p.id!==id);render();status("Produk dihapus");return;
    }
    const payload=rowPayload(row);
    if(!payload.name||!payload.code){status("Nama dan kode wajib diisi.");return}
    if(!Number.isFinite(payload.price)||payload.price<0){status("Harga tidak valid.");return}
    btn.disabled=true;status("Menyimpan…");
    const {error}=await client.from("products").update(payload).eq("id",id);
    btn.disabled=false;
    if(error){status("Gagal menyimpan: "+error.message);return}
    status("Tersimpan: "+payload.name);await loadProducts();
  });
  clientReady();
  function clientReady(){init().catch(()=>setupMessage("Tidak dapat terhubung ke Supabase. Periksa koneksi internet."))}
})();