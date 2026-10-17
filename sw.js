/* Service worker del Optimizador de alineación de remo.
 *
 * En desarrollo (servidor local sin build) VERSION='dev' y PRECACHE=[]: el worker no cachea nada y todo va a red,
 * así que no hay cachés viejas que estorben. scripts/build-pwa.js sustituye las dos líneas marcadas con "@build"
 * por una versión derivada del contenido (hash) y la lista de archivos a precachear.
 *
 * Estrategia: precaché de todo el "app shell" en la instalación (la app funciona sin conexión desde la primera
 * visita) y respuesta cache-first. Las actualizaciones llegan con un nuevo sw.js (otro hash → otra caché); la página
 * avisa y el usuario decide cuándo aplicarla (SKIP_WAITING), para no recargar en mitad de un trabajo.
 */
const VERSION = 'dev'; // @build
const PRECACHE = [];   // @build

const PREFIJO = 'oar-';
const CACHE = PREFIJO + VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache:'reload' evita que la caché HTTP de GitHub Pages (max-age=600) nos entregue archivos de la versión anterior
    await Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter((n) => n.startsWith(PREFIJO) && n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!PRECACHE.length) return; // modo desarrollo: sin caché

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Las navegaciones (también con ?query o #hash) se resuelven con el index.html precacheado
    const coincidencia = await cache.match(req, { ignoreSearch: true })
      || (req.mode === 'navigate' ? await cache.match('./index.html') : undefined);
    if (coincidencia) return coincidencia;
    return fetch(req);
  })());
});
