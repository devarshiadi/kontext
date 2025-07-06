// Wait for the DOM to be fully loaded before running our scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // --- PWA Installation Logic ---
    const installButton = document.getElementById('install-app-btn');
    let deferredPrompt; // This variable will hold the install event

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show the install button now that we know the app is installable
        installButton.style.display = 'flex';
    });

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Show the browser's install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We can only use the prompt once, so clear it.
            deferredPrompt = null;
            // Hide the button after the prompt is used
            installButton.style.display = 'none';
        }
    });
    
    window.addEventListener('appinstalled', () => {
        // Hide the install button if the app is successfully installed
        installButton.style.display = 'none';
        deferredPrompt = null;
        console.log('PWA was installed');
    });

    // --- Clear Site Data Logic ---
    const clearDataButton = document.getElementById('clear-data-btn');

    clearDataButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all cookies, storage, and cache for this website? This will not affect the embedded content.')) {
            try {
                // 1. Clear Cookies
                const cookies = document.cookie.split(";");
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i];
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                }

                // 2. Clear Local Storage and Session Storage
                localStorage.clear();
                sessionStorage.clear();

                // 3. Clear Cache Storage
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                }

                alert('Website data has been successfully cleared. The page will now reload.');
                // Reload the page to apply changes
                window.location.reload();

            } catch (error) {
                console.error('Error clearing site data:', error);
                alert('An error occurred while clearing site data.');
            }
        }
    });

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
});
