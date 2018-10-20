importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
    workbox.routing.registerRoute(
        /(^((?!App_Plugins|umbraco).)*(?:png|gif|jpg|jpeg|svg)(?:\?.*)?$)/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'media',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 Days
                })
            ]
        }),
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets'
        }),
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30
                })
            ]
        }),
    );
}