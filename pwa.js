(() => {
  "use strict";
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(error => {
        console.warn("DutaLED: service worker belum terdaftar.", error);
      });
    });
  }

  let installPrompt = null;
  const button = document.getElementById("installPwaButton");
  if (!button) return;\n  button.classList.remove("hidden");

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    button.classList.remove("hidden");
  });

  button.addEventListener("click", async () => {
    if (!installPrompt) {
      alert('Untuk memasang DutaLED di Android, buka menu ⋮ Chrome lalu pilih "Tambahkan ke layar utama" atau "Install app". Di iPhone/iPad, tekan Bagikan lalu "Add to Home Screen".');
      return;
    }
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    button.classList.add("hidden");
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    button.classList.add("hidden");
  });
})();