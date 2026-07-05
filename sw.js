// Service Worker per persistenza notifiche
const CACHE = 'v1';

self.addEventListener('install', e => {
    e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
});

// Intercetta fetch e risponde dalla cache
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});

// Ricevi push notifications dal server (se configurato)
self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    const title = data.title || '⚠️ Avviso di Sicurezza';
    const options = {
        body: data.body || 'Nuovo accesso rilevato. Tocca per verificare.',
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { url: data.url || '/' }
    };
    e.waitUntil(self.registration.showNotification(title, options));
});

// Quando l'utente clicca la notifica → apri pagina
self.addEventListener('notificationclick', e => {
    e.notification.close();
    const url = e.notification.data.url || '/';
    e.waitUntil(
        clients.openWindow(url)
    );
});
