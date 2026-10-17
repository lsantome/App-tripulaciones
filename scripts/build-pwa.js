#!/usr/bin/env node
// Genera el sitio publicable en GitHub Pages (PWA) en dist/site:
//   index.html, manifest.webmanifest, sw.js (con versión y lista de precaché), icons/, vendor/ (solo lo necesario),
//   examples/ y el HTML autónomo descargable (si existe en dist/).
// Uso: npm run build:pwa   (ejecuta antes build-standalone)
// La versión de la caché es un hash del contenido de los archivos precacheados + sw.js: si nada cambia, no hay
// "versión nueva" para los usuarios; si cambia cualquier archivo, el service worker se actualiza solo.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const raiz = path.join(__dirname, '..');
const salida = path.join(raiz, 'dist', 'site');

const ESTATICOS = [
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon.svg', 'icons/apple-touch-icon.png',
  'vendor/xlsx.full.min.js',
  'vendor/fonts/ibm-plex.css',
];
const fuentes = fs.readdirSync(path.join(raiz, 'vendor', 'fonts')).filter(f => f.endsWith('.woff2')).sort().map(f => 'vendor/fonts/' + f);
const precache = ESTATICOS.concat(fuentes);

for (const f of precache) {
  if (!fs.existsSync(path.join(raiz, f))) throw new Error('Falta un archivo a precachear: ' + f);
}

fs.rmSync(salida, { recursive: true, force: true });
const copiar = (rel) => {
  const dst = path.join(salida, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(raiz, rel), dst);
};
precache.forEach(copiar);

// Descargables que no se precachean
fs.readdirSync(path.join(raiz, 'examples')).filter(f => f.endsWith('.xlsx')).forEach(f => copiar('examples/' + f));
['LICENSE', 'vendor/LICENSE-sheetjs.txt', 'vendor/fonts/LICENSE-IBM-Plex-OFL.txt'].forEach(f => { if (fs.existsSync(path.join(raiz, f))) copiar(f); });
const autonomo = path.join(raiz, 'dist', 'optimizador-alineacion-remo.html');
if (fs.existsSync(autonomo)) fs.copyFileSync(autonomo, path.join(salida, 'optimizador-alineacion-remo.html'));
else console.warn('Aviso: no existe dist/optimizador-alineacion-remo.html (ejecuta npm run build:pwa para generarlo)');

// Service worker con versión y lista de precaché
let sw = fs.readFileSync(path.join(raiz, 'sw.js'), 'utf8');
const h = crypto.createHash('sha256');
h.update(sw);
for (const f of precache) { h.update(f); h.update(fs.readFileSync(path.join(raiz, f))); }
const version = h.digest('hex').slice(0, 10);
const lista = ['./'].concat(precache.map(f => './' + f)); // './' = raíz del sitio (la navegación a la carpeta)
const reVersion = /^const VERSION = .*\/\/ @build$/m, rePre = /^const PRECACHE = .*\/\/ @build$/m;
if (!reVersion.test(sw) || !rePre.test(sw)) throw new Error('sw.js: no se encuentran las líneas marcadas con @build');
sw = sw.replace(reVersion, "const VERSION = '" + version + "';")
       .replace(rePre, 'const PRECACHE = ' + JSON.stringify(lista) + ';');
fs.writeFileSync(path.join(salida, 'sw.js'), sw);

console.log('OK: dist/site (' + (precache.length + 1) + ' URLs precacheadas, versión ' + version + ')');
