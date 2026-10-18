// DATA KATALOG DUTALED
// HANYA data publik: jangan masukkan harga modal atau informasi rahasia di file ini.
// Seluruh harga dan diskon di bawah adalah CONTOH dan harus diganti dengan data resmi toko.
const alianoTiers = [{min:1,max:50,discount:32},{min:51,max:1000,discount:35}];
const alianoVariants = [
  ["5W",4500,6000,5,50],["7W",6000,8000,5,50],["9W",8000,12000,10,40],
  ["12W",10000,14000,10,40],["15W",13000,18000,15,30],["18W",15000,22000,15,30],
  ["25W",20000,28000,20,20],["30W",25000,35000,20,20],["40W",32000,45000,25,15],
  ["50W",40000,55000,25,10]
].map(([watt,_exampleCost,price,retailDiscount,stock])=>({
  id:"aliano-"+watt.toLowerCase(),name:"Lampu LED Aliano "+watt,code:"ALIANO-"+watt,
  category:"Lampu LED",price,retailDiscount,stock,badge:"Aliano",emoji:"💡",image:"",
  description:"Varian daya Lampu LED Aliano. Harga contoh; konfirmasi harga dan stok sebelum memesan.",
  quantityTiers:alianoTiers,promo:{name:"",discount:0,start:"",end:""}
}));
window.DUTALED_PRODUCTS = [
 ...alianoVariants,
 {id:"led-bulb-9w",name:"Lampu LED 9W Putih",code:"DL-LMP-009",category:"Lampu LED",price:18000,stock:25,badge:"Populer",emoji:"💡",image:"",description:"Lampu LED untuk kebutuhan penerangan sehari-hari."},
 {id:"led-bulb-12w",name:"Lampu LED 12W Putih",code:"DL-LMP-012",category:"Lampu LED",price:24000,stock:20,badge:"Pilihan",emoji:"💡",image:"",description:"Lampu LED hemat energi untuk rumah dan toko."},
 {id:"led-bulb-18w",name:"Lampu LED 18W",code:"DL-LMP-018",category:"Lampu LED",price:35000,stock:15,badge:"",emoji:"🔆",image:"",description:"Lampu LED untuk ruangan yang membutuhkan cahaya lebih terang."},
 {id:"module-5730",name:"Modul LED SMD 5730",code:"DL-MOD-5730",category:"Modul LED",price:7500,stock:60,badge:"Favorit teknisi",emoji:"🟨",image:"",description:"Modul LED untuk perbaikan dan rakit lampu."},
 {id:"module-2835",name:"Modul LED SMD 2835",code:"DL-MOD-2835",category:"Modul LED",price:6000,stock:50,badge:"",emoji:"🟨",image:"",description:"Modul LED praktis untuk kebutuhan servis."},
 {id:"driver-12w",name:"Driver LED 12W",code:"DL-DRV-012",category:"Driver & Power",price:12500,stock:30,badge:"",emoji:"🔌",image:"",description:"Driver untuk lampu LED dengan spesifikasi yang sesuai."},
 {id:"driver-18w",name:"Driver LED 18W",code:"DL-DRV-018",category:"Driver & Power",price:17000,stock:25,badge:"",emoji:"🔌",image:"",description:"Komponen driver LED untuk perbaikan lampu."},
 {id:"aluminium-30cm",name:"Aluminium LED 30 cm",code:"DL-ALU-030",category:"Aluminium LED",price:22000,stock:18,badge:"",emoji:"📏",image:"",description:"Profil aluminium untuk kebutuhan pemasangan LED."},
 {id:"casing-9w",name:"Casing Lampu 9W",code:"DL-CSG-009",category:"Casing Lampu",price:9000,stock:40,badge:"",emoji:"⚪",image:"",description:"Casing pengganti untuk perakitan atau perbaikan lampu."},
 {id:"fitting-e27",name:"Fitting Lampu E27",code:"DL-FIT-E27",category:"Aksesori",price:5000,stock:45,badge:"",emoji:"🔩",image:"",description:"Fitting lampu ulir E27 untuk pemasangan lampu."},
 {id:"kabel-lampu",name:"Kabel Lampu 1 Meter",code:"DL-KBL-001",category:"Aksesori",price:4000,stock:50,badge:"",emoji:"〰️",image:"",description:"Kabel pengganti untuk kebutuhan instalasi lampu."},
 {id:"set-solder",name:"Set Perbaikan LED",code:"DL-SET-LED",category:"Peralatan",price:28000,stock:10,badge:"",emoji:"🧰",image:"",description:"Contoh paket alat bantu servis LED."}
];