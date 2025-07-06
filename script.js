document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('install-app-btn');
  let deferredPrompt;

  // PWA install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'flex';
  });
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      installButton.style.display = 'none';
    }
  });
  window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    deferredPrompt = null;
    console.log('PWA installed');
  });

  // Clear site data
  document.getElementById('clear-data-btn').addEventListener('click', async () => {
    if (!confirm('Clear all site data?')) return;
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '')
                         .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    localStorage.clear();
    sessionStorage.clear();
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      regs.forEach(r => r.unregister());
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    alert('Data cleared. Reloading…');
    window.location.reload();
  });

  // Dropdown app selector
  const appList = document.getElementById('app-list');
  const iframe = document.getElementById('fullscreen-iframe');
  appList.addEventListener('change', () => {
    iframe.src = appList.value;
  });

  // Toggle button → GFPGAN demo
  document.getElementById('toggle-app-btn').addEventListener('click', () => {
    iframe.src = 'https://xintao-gfpgan.hf.space/';
  });
});
