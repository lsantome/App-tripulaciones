# Changelog

## 1.2.0
- **PWA:** `manifest.webmanifest`, iconos (192, 512, maskable, apple-touch) y `sw.js` con precaché versionado por hash del contenido. Instalable y con modo offline completo bajo la subruta de GitHub Pages. Aviso de nueva versión con botón *Actualizar* (no recarga sola).
- `npm run build:pwa` genera `dist/site` (PWA + versión autónoma + ejemplos); el workflow de Pages lo despliega. La versión autónoma sigue sin dependencias y sin partes PWA.
- Nuevas pruebas (`tests/pwa.js`): manifest, iconos, rutas relativas, precaché, determinismo de la versión y limpieza del autónomo. Verificado en Chromium: instalabilidad, recarga sin conexión sin peticiones al servidor y flujo de actualización.

## 1.1.0
- **Versión autónoma:** `npm run build` genera `dist/optimizador-alineacion-remo.html`, un único archivo (~1,2 MB) con SheetJS e IBM Plex incrustados y sin referencias externas (el build lo comprueba). Verificada en Chromium abierta desde un archivo suelto: sin peticiones externas ni errores de consola.
- Leyenda «Proel» oculta en barcos sin proel; la nota del Excel de tripulación explica los códigos numéricos de trainerilla y batel.
- **Multiembarcación:** trainera, trainerilla y batel con valores predefinidos editables (eslora, manga, puntal, calado, peso del casco). Los puestos, el optimizador, el esquema, las métricas y la exportación se adaptan al tipo (proel solo en trainera).
- **Maestro de barcos:** plantilla Excel descargable (`plantilla_barcos.xlsx`), importación con validación y avisos, selector de barco y persistencia.
- El panel de dimensiones pasa de Configuración a un panel «Barco» en Tripulación; el peso del casco sale de los parámetros avanzados.
- «Todas» en las posiciones de un remero pasa a significar «sin restricción» (vacío), válido para cualquier barco.
- Zona popa/proa por posición respecto al centro del casco (igual que antes en la trainera).
- **Trainerilla (6) y batel (4): bancadas individuales sobre el eje**, con banda de remada alterna (configurable la de la bancada 1). El peso no desequilibra lateralmente; la potencia cuenta por banda de remada. Posiciones en Excel como números (`1,2,5`).
- Hipótesis documentadas: calado, separación entre bancadas y banda de remada de trainerilla y batel (ver `docs/MODELO.md`). La trainera da resultados idénticos a la versión anterior.

## 1.0.0
- Proyecto renombrado a «Optimizador de alineación de remo» (repositorio `optimizador-alineacion-remo`); la plantilla Excel pasa a llamarse `plantilla_alineacion_remo.xlsx`.
- Primera versión pública: optimizador automático (3 propuestas), modo manual, equilibrios de peso/vatios/W-kg, tabla de cuadrantes, trimado y asiento estimado, mapa de calor, modo claro/oscuro, importación/exportación Excel.
- Importación Excel: posiciones vacías = remero sin restricción (coherente con la app; la exportación ya escribía vacío).
- Persistencia con `localStorage` como respaldo cuando no existe `window.storage` (claves con prefijo `trainera:`); fallos de almacenamiento no rompen la app.
- SheetJS 0.18.5 e IBM Plex incluidos en `vendor/` (sin CDN, funciona sin conexión).
- Corregida la plantilla Excel descargable: la fila de ejemplo sin posiciones se habría rechazado al reimportarla.
