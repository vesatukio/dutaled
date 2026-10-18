(() => {
"use strict";
const $ = s => document.querySelector(s);
const KEY = "dutaled-admin-demo-v1";
const seed = {
 productName:"Lampu LED Aliano", retailMode:"percent", retailDiscount:5,
 variants:[
  {name:"5W",cost:4500,price:6000,discount:5,stock:50},
  {name:"7W",cost:6000,price:8000,discount:5,stock:50},
  {name:"9W",cost:8000,price:12000,discount:10,stock:40},
  {name:"12W",cost:10000,price:14000,discount:10,stock:40},
  {name:"15W",cost:13000,price:18000,discount:15,stock:30},
  {name:"18W",cost:15000,price:22000,discount:15,stock:30},
  {name:"25W",cost:20000,price:28000,discount:20,stock:20},
  {name:"30W",cost:25000,price:35000,discount:20,stock:20},
  {name:"40W",cost:32000,price:45000,discount:25,stock:15},
  {name:"50W",cost:40000,price:55000,discount:25,stock:10}
 ],
 tiers:[{min:1,max:50,discount:32},{min:51,max:1000,discount:35}],
 promo:{name:"Promo Hari Ini",discount:0,start:"",end:""}
};
const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
const num = (v, fallback=0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
let data;
try { data = JSON.parse(localStorage.getItem(KEY)) || structuredClone(seed); } catch { data = JSON.parse(JSON.stringify(seed)); }
function input(value,field,type="text",min=""){return '<input type="'+type+'" data-field="'+field+'" value="'+String(value??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'" '+(min!==""?'min="'+min+'"':"")+'>'}
function renderVariants(){
 $("#variants").innerHTML=data.variants.map((v,i)=>'<tr><td>'+input(v.name,"name")+'</td><td>'+input(v.cost,"cost","number",0)+'</td><td>'+input(v.price,"price","number",0)+'</td><td>'+input(v.discount,"discount","number",0)+'</td><td>'+input(v.stock,"stock","number",0)+'</td><td><button class="delete" data-delete-variant="'+i+'" aria-label="Hapus varian">Hapus</button></td></tr>').join("");
}
function renderTiers(){
 $("#tiers").innerHTML=data.tiers.map((t,i)=>'<tr><td>'+input(t.min,"min","number",1)+'</td><td>'+input(t.max,"max","number",1)+'</td><td>'+input(t.discount,"discount","number",0)+'</td><td><button class="delete" data-delete-tier="'+i+'" aria-label="Hapus tingkat">Hapus</button></td></tr>').join("");
}
function readFields(){
 data.productName=$("#productName").value;
 data.retailMode=$("#retailMode").value;
 data.retailDiscount=num($("#retailDiscount").value);
 data.promo={name:$("#promoName").value,discount:num($("#promoDiscount").value),start:$("#promoStart").value,end:$("#promoEnd").value};
}
function fill(){
 $("#productName").value=data.productName;$("#retailMode").value=data.retailMode;$("#retailDiscount").value=data.retailDiscount;
 $("#promoName").value=data.promo.name;$("#promoDiscount").value=data.promo.discount;$("#promoStart").value=data.promo.start;$("#promoEnd").value=data.promo.end;
 renderVariants();renderTiers();preview();
}
function preview(){
 readFields();
 const v=data.variants[0]||{name:"Varian",cost:0,price:0,discount:0};
 const now=new Date(), start=data.promo.start?new Date(data.promo.start):null,end=data.promo.end?new Date(data.promo.end):null;
 const promoActive=data.promo.discount>0&&start&&end&&start<=now&&now<=end;
 let discount=data.retailMode==="none"?0:(data.retailMode==="percent"?num(v.discount):0);
 if(promoActive) discount=Math.max(discount,num(data.promo.discount));
 const final=Math.round(num(v.price)*(1-Math.min(100,Math.max(0,discount))/100));
 $("#previewName").textContent=data.productName+" "+v.name;
 $("#previewDetail").textContent=(promoActive?"Promo aktif · ":"Harga retail · ")+discount+"% diskon pada varian pertama";
 $("#previewOriginal").textContent=money(v.price);$("#previewFinal").textContent=money(final);
 $("#previewProfit").textContent="Modal "+money(v.cost)+" · Laba kotor "+money(final-num(v.cost))+" per unit";
}
function validate(){
 if(data.variants.some(v=>!v.name||num(v.cost)<0||num(v.price)<0||num(v.discount)<0||num(v.discount)>100||num(v.stock)<0)){alert("Periksa nama, modal, harga, diskon (0–100%), dan stok varian.");return false;}
 const sorted=[...data.tiers].sort((a,b)=>num(a.min)-num(b.min));
 for(let i=0;i<sorted.length;i++){if(num(sorted[i].min)<1||num(sorted[i].max)<num(sorted[i].min)||num(sorted[i].discount)<0||num(sorted[i].discount)>100){alert("Rentang jumlah atau diskon tidak valid.");return false;}if(i&&num(sorted[i].min)<=num(sorted[i-1].max)){alert("Rentang diskon kuantitas tidak boleh tumpang tindih.");return false;}}
 if(num(data.retailDiscount)<0||num(data.retailDiscount)>100||num(data.promo.discount)<0||num(data.promo.discount)>100){alert("Diskon harus antara 0–100%.");return false;}
 if(data.promo.start&&data.promo.end&&new Date(data.promo.end)<=new Date(data.promo.start)){alert("Waktu berakhir harus setelah waktu mulai.");return false;}
 return true;
}
document.addEventListener("input",e=>{
 const tr=e.target.closest("#variants tr");
 if(tr&&e.target.dataset.field){const i=[...$("#variants").rows].indexOf(tr)-1;data.variants[i][e.target.dataset.field]=e.target.dataset.field==="name"?e.target.value:num(e.target.value);preview();return;}
 const tierRow=e.target.closest("#tiers tr");
 if(tierRow&&e.target.dataset.field){const i=[...$("#tiers").rows].indexOf(tierRow)-1;data.tiers[i][e.target.dataset.field]=num(e.target.value);return;}
 preview();
});
document.addEventListener("click",e=>{
 const dv=e.target.closest("[data-delete-variant]");if(dv){data.variants.splice(num(dv.dataset.deleteVariant),1);renderVariants();preview();}
 const dt=e.target.closest("[data-delete-tier]");if(dt){data.tiers.splice(num(dt.dataset.deleteTier),1);renderTiers();}
});
$("#addVariant").addEventListener("click",()=>{data.variants.push({name:"Varian baru",cost:0,price:0,discount:0,stock:0});renderVariants();preview();});
$("#addTier").addEventListener("click",()=>{const last=data.tiers[data.tiers.length-1];data.tiers.push({min:last?num(last.max)+1:1,max:last?num(last.max)+50:50,discount:0});renderTiers();});
$("#save").addEventListener("click",()=>{readFields();if(!validate())return;try{localStorage.setItem(KEY,JSON.stringify(data));$("#status").textContent="Tersimpan di browser ini.";setTimeout(()=>$("#status").textContent="",3500);}catch{$("#status").textContent="Browser tidak mengizinkan penyimpanan lokal.";}});
$("#export").addEventListener("click",()=>{readFields();if(!validate())return;const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="dutaled-pricing-config.json";a.click();URL.revokeObjectURL(url);$("#status").textContent="Konfigurasi JSON diekspor.";});
$("#reset").addEventListener("click",()=>{if(!confirm("Kembalikan semua data demo?"))return;data=JSON.parse(JSON.stringify(seed));localStorage.removeItem(KEY);fill();$("#status").textContent="Contoh dipulihkan.";});
$("#retailMode").addEventListener("change",preview);$("#retailDiscount").addEventListener("input",preview);$("#productName").addEventListener("input",preview);$("#promoName").addEventListener("input",preview);$("#promoDiscount").addEventListener("input",preview);$("#promoStart").addEventListener("input",preview);$("#promoEnd").addEventListener("input",preview);
fill();
})();