(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const modal = $("#homeCameraModal");
  const video = $("#homeCameraVideo");
  const status = $("#homeCameraStatus");
  let stream = null, active = false, frame = 0, detector = null, fallbackScanner = null;

  function goToCashier(code) {
    if (!code) return;
    status.textContent = "Barcode terbaca: " + code + ". Membuka kasir…";
    stopCamera();
    const url = new URL("kasir.html", window.location.href);
    url.searchParams.set("scan", code);
    window.location.href = url.href;
  }
  async function stopCamera() {
    active = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    if (video) video.srcObject = null;
    if (fallbackScanner) {
      const scanner = fallbackScanner;
      fallbackScanner = null;
      try { if (scanner.isScanning) await scanner.stop(); } catch (e) {}
      try { await scanner.clear(); } catch (e) {}
    }
    $("#homeCameraStop").classList.add("hidden");
    $("#homeCameraEnable").classList.remove("hidden");
  }
  function closeModal() {
    stopCamera();
    modal.classList.add("hidden");
  }
  function loadFallbackLibrary() {
    if (window.Html5Qrcode) return Promise.resolve();
    if (window.homeQrLibraryPromise) return window.homeQrLibraryPromise;
    window.homeQrLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/html5-qrcode";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Library pemindai tidak bisa dimuat."));
      document.head.appendChild(script);
    });
    return window.homeQrLibraryPromise;
  }
  async function startFallbackCamera() {
    status.textContent = "Menyiapkan pemindai kamera…";
    try {
      await loadFallbackLibrary();
      video.classList.add("hidden");
      $("#homeCameraReader").classList.remove("hidden");
      const scanner = new Html5Qrcode("homeCameraReader");
      fallbackScanner = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 150 }, formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF, Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODABAR, Html5QrcodeSupportedFormats.DATA_MATRIX
        ] },
        decodedText => goToCashier(String(decodedText || "").trim()),
        () => {}
      );
      active = true;
      $("#homeCameraStop").classList.remove("hidden");
      $("#homeCameraEnable").classList.add("hidden");
      status.textContent = "Kamera aktif. Arahkan barcode ke dalam bingkai.";
    } catch (err) {
      status.textContent = "Kamera gagal dibuka. Pastikan memakai HTTPS, izinkan kamera, dan coba Chrome terbaru.";
      await stopCamera();
    }
  }
  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "Kamera tidak tersedia. Buka https://volix.my.id dan izinkan akses kamera.";
      return;
    }
    if (!("BarcodeDetector" in window)) {
      await startFallbackCamera();
      return;
    }
    try {
      detector = new BarcodeDetector({ formats: ["code_128","code_39","ean_13","ean_8","upc_a","upc_e","itf","qr_code","codabar","data_matrix"] });
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } });
      video.classList.remove("hidden");
      $("#homeCameraReader").classList.add("hidden");
      video.srcObject = stream;
      await video.play();
      active = true;
      $("#homeCameraStop").classList.remove("hidden");
      $("#homeCameraEnable").classList.add("hidden");
      status.textContent = "Kamera aktif. Arahkan barcode ke dalam bingkai.";
      scanFrame();
    } catch (err) {
      await stopCamera();
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
          if (code) { goToCashier(code); return; }
        }
      } catch (e) {}
    }
    if (active) frame = requestAnimationFrame(scanFrame);
  }
  $("#homeCameraStart").addEventListener("click", () => {
    modal.classList.remove("hidden");
    status.textContent = "Meminta izin kamera…";
    startCamera();
  });
  $("#homeCameraEnable").addEventListener("click", startCamera);
  $("#homeCameraStop").addEventListener("click", stopCamera);
  $("#homeCameraClose").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && active) stopCamera(); });
  window.addEventListener("pagehide", stopCamera);
})();