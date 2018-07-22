var CACHE_NAME = 'my-site-cache-v1'
var urlsToCache = [
    '/css/umbraco-starterkit-style.css',
    '/scripts/umbraco-starterkit-app.js',
    'https://fonts.googleapis.com/css?family=Playfair+Display:400,700italic,700,400italic|Noto+Sans:400,700'
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

var mediaRegx = new RegExp('\/media\/([0-9]{4,})/(.*)')
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    console.log('cached:', event.request.url)
                    return response;
                }
                var url = event.request.url;                
                if (!mediaRegx.test(url))
                    return fetch(event.request);

                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })                
            })
    );
});