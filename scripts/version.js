// Identidad de una compilación, compartida por build-standalone.js y build-pwa.js:
//   hash  → sha256 (10 hex) de la versión de package.json + sw.js fuente + todos los archivos precacheados. Es la versión de la caché del service
//           worker y la que se muestra en el pie de la app: si dos dispositivos muestran el mismo hash, tienen el mismo código.
//   fecha → instante de compilación (ISO UTC). NO entra en el hash (si no, cada despliegue sin cambios de código
//           provocaría un aviso de "versión nueva"). SOURCE_DATE_EPOCH (segundos) fija la fecha para compilaciones reproducibles.
//   pkg   → versión de package.json (la de CHANGELOG).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const raiz = path.join(__dirname, '..');

const ESTATICOS = [
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon.svg', 'icons/apple-touch-icon.png',
  'vendor/xlsx.full.min.js',
  'vendor/fonts/ibm-plex.css',
];

function precache() {
  const fuentes = fs.readdirSync(path.join(raiz, 'vendor', 'fonts')).filter(f => f.endsWith('.woff2')).sort().map(f => 'vendor/fonts/' + f);
  const lista = ESTATICOS.concat(fuentes);
  for (const f of lista) if (!fs.existsSync(path.join(raiz, f))) throw new Error('Falta un archivo a precachear: ' + f);
  return lista;
}

function hash(lista, pkgVersion) {
  const h = crypto.createHash('sha256');
  h.update('pkg:' + pkgVersion + '\n'); // subir la versión del paquete también es una versión nueva
  h.update(fs.readFileSync(path.join(raiz, 'sw.js'), 'utf8'));
  for (const f of lista) { h.update(f); h.update(fs.readFileSync(path.join(raiz, f))); }
  return h.digest('hex').slice(0, 10);
}

function fecha() {
  const e = process.env.SOURCE_DATE_EPOCH;
  const ms = e && /^\d+$/.test(e) ? Number(e) * 1000 : Date.now();
  return new Date(Math.floor(ms / 60000) * 60000).toISOString(); // precisión de minuto
}

const MARCA = /^<script id="buildInfo" type="application\/json">.*<\/script>[ \t]*<!-- @build -->$/m;

// Sustituye la línea marcada con @build de index.html por la identidad de esta compilación
function estampar(html, info) {
  if (!MARCA.test(html)) throw new Error('index.html: no se encuentra la línea buildInfo marcada con @build');
  return html.replace(MARCA, () => '<script id="buildInfo" type="application/json">' + JSON.stringify(info) + '</script>');
}

let memo; // una sola identidad por proceso: autónomo y PWA comparten exactamente la misma fecha
function identidad() {
  if (!memo) {
    const lista = precache();
    const pkg = JSON.parse(fs.readFileSync(path.join(raiz, 'package.json'), 'utf8'));
    memo = { lista, info: { version: hash(lista, pkg.version), fecha: fecha(), pkg: pkg.version } };
  }
  return memo;
}

module.exports = { identidad, estampar, MARCA };
