(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const modal = $("#homeCameraModal");
  const video = $("#homeCameraVideo");
  const status = $("#homeCameraStatus");
  let stream = null, active = false, frame = 0, detector = null, lastCode = "", lastAt = 0;

  function stopCamera() {
    active = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    if (video) video.srcObject = null;
    $("#homeCameraStop").classList.add("hidden");
    $("#homeCameraEnable").classList.remove("hidden");
  }
  function closeModal() {
    stopCamera();
    modal.classList.add("hidden");
  }
  async function startCamera() {
    if (!("BarcodeDetector" in window)) {
      status.textContent = "Browser ini belum mendukung scan barcode kamera. Coba Chrome terbaru di Android.";
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Kamera tidak tersedia. Buka website melalui HTTPS dan izinkan akses kamera.";
      return;
    }
    try {
      detector = new BarcodeDetector({ formats: ["code_128","code_39","ean_13","ean_8","upc_a","upc_e","itf","qr_code","codabar","data_matrix"] });
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } });
      video.srcObject = stream;
      await video.play();
      active = true;
      $("#homeCameraStop").classList.remove("hidden");
      $("#homeCameraEnable").classList.add("hidden");
      status.textContent = "Kamera aktif. Arahkan barcode ke dalam bingkai.";
      scanFrame();
    } catch (err) {
      stopCamera();
      status.textContent = err && err.name === "NotAllowedError"
        ? "Izin kamera ditolak. Izinkan kamera melalui pengaturan situs/browser."
        : "Kamera gagal dibuka. Pastikan kamera tidak sedang digunakan aplikasi lain.";
    }
  }
  async function scanFrame() {
    if (!active) return;
    if (video.readyState >= 2) {
      try {
        const results = await detector.detect(video);
        if (results.length) {
          const code = String(results[0].rawValue || "").trim();
          const now = Date.now();
          if (code && (code !== lastCode || now - lastAt > 1800)) {
            lastCode = code;
            lastAt = now;
            status.textContent = "Barcode terbaca: " + code + ". Membuka kasir…";
            stopCamera();
            const url = new URL("kasir.html", window.location.href);
            url.searchParams.set("scan", code);
            window.location.href = url.href;
            return;
          }
        }
      } catch (e) { /* frame kamera berikutnya akan dicoba */ }
    }
    if (active) frame = requestAnimationFrame(scanFrame);
  }
  $("#homeCameraStart").addEventListener("click", () => {
    modal.classList.remove("hidden");
    status.textContent = "Tekan mulai untuk mengizinkan kamera.";
  });
  $("#homeCameraEnable").addEventListener("click", startCamera);
  $("#homeCameraStop").addEventListener("click", stopCamera);
  $("#homeCameraClose").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && active) stopCamera(); });
  window.addEventListener("pagehide", stopCamera);
})();
