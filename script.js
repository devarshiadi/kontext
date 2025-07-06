// Wait for the DOM to be fully loaded before attaching event listeners to buttons
document.addEventListener('DOMContentLoaded', () => {
    
    // --- PWA Installation Logic ---
    const installButton = document.getElementById('install-app-btn');
    let deferredPrompt; // This variable will hold the install event

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('`beforeinstallprompt` event was fired.');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show our custom install button
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
        if (confirm('Are you sure you want to clear all cookies, storage, and cache for this website?')) {
            try {
                // Clear Cookies, Local Storage, and Session Storage
                document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`));
                localStorage.clear();
                sessionStorage.clear();

                // Unregister all service workers.
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                        await registration.unregister();
                    }
                }
                
                // Clear all Caches
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                }

                alert('All site data cleared. The page will now reload.');
                window.location.reload();

            } catch (error) {
                console.error('Error clearing site data:', error);
                alert('An error occurred while clearing site data.');
            }
        }
    });
});