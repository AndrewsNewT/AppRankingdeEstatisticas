const CACHE_NAME = "racha-dos-clandestinos-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];


self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(ARQUIVOS);

            })

    );

    self.skipWaiting();
});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(nomes => {

                return Promise.all(

                    nomes
                        .filter(nome => nome !== CACHE_NAME)
                        .map(nome => caches.delete(nome))

                );

            })

    );

    self.clients.claim();
});


self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(resposta => {

                const copia = resposta.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(
                            event.request,
                            copia
                        );

                    });

                return resposta;

            })
            .catch(() => {

                return caches.match(event.request);

            })

    );

});
