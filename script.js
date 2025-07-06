// script.js
document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('install-app-btn');
  let deferredPrompt;

  // Capture the install event
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'flex';
  });

  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installButton.style.display = 'none';
    }
  });

  window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    deferredPrompt = null;
    console.log('PWA was installed');
  });

  // Clear site data button
  const clearDataButton = document.getElementById('clear-data-btn');
  clearDataButton.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear all site data?')) return;

    // Clear cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '')
                         .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Unregister SWs
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      regs.forEach(r => r.unregister());
    }

    // Clear caches
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }

    alert('All site data cleared. Reloading…');
    window.location.reload();
  });

  // —— NEW: App selector logic ——
  const appList = document.getElementById('app-list');
  const iframe = document.getElementById('fullscreen-iframe');

  appList.addEventListener('change', () => {
    iframe.src = appList.value;
  });
});
