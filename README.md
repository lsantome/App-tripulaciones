# Optimizador de alineación de remo

Herramienta web (HTML sin servidor; también **PWA instalable y con modo offline**) para **proponer y evaluar alineaciones de trainera, trainerilla y batel** según el reparto de pesos y, opcionalmente, de potencia.

https://lsantome.github.io/App-tripulaciones/

## Qué hace

- **Multiembarcación:** trainera (13 remeros + patrón), trainerilla (6 + patrón) y batel (4 + patrón; ambos con **bancadas individuales sobre el eje**), con dimensiones y peso predefinidos y editables. Opcionalmente, un **maestro de barcos** importado desde Excel.

- **Modo automático:** optimizador (recocido simulado) que devuelve hasta **3 alineaciones** distintas.
  Prioridad seleccionable: *solo peso* (por defecto), *vatios absolutos* o *W/kg*.
- **Modo manual:** arrastra fichas a los puestos y mira las métricas en vivo.
- **Equilibrios** de peso, potencia absoluta y W/kg entre **babor/estribor** y **proa/popa**, con gráfico circular y tabla de cuadrantes.
- **Trimado** (momento respecto al centro) y **asiento longitudinal estimado** a partir de eslora, manga y calado.
- **Mapa de calor** opcional (peso o potencia) sobre el esquema del barco.
- **Importar/exportar Excel**; modo claro/oscuro.

Reglas de dominio: el **patrón nunca aporta potencia** y su peso no cuenta en el desequilibrio de bandas; el **proel** va sobre el eje, su peso no cuenta en bandas, pero su potencia se suma a babor (o estribor, configurable).

## Uso rápido

1. Abre en el navegador (doble clic) la **versión autónoma** `optimizador-alineacion-remo.html` (un solo archivo, sin dependencias ni carpetas), o `index.html` con su carpeta `vendor/`, o usa la versión de Pages.
2. *Configuración* → carga el ejemplo o importa tu Excel de tripulación ([`examples/plantilla_alineacion_remo.xlsx`](examples/plantilla_alineacion_remo.xlsx)). Opcional: importa tu maestro de barcos ([`examples/plantilla_barcos.xlsx`](examples/plantilla_barcos.xlsx)).
3. *Tripulación* → elige el **barco** (predefinido o del maestro) y ajusta sus dimensiones si hace falta → *Automático* → **Optimizar alineación**, o *Manual* para montarla a mano.

Guía completa: **[docs/GUIA_DE_USO.md](docs/GUIA_DE_USO.md)**. Modelo físico y límites: **[docs/MODELO.md](docs/MODELO.md)**.

## Formato del Excel

Una fila por persona, primera hoja, columnas en este orden: `Nombre · Peso (kg) · Posiciones · Potencia (W, opcional)`.
Posiciones separadas por comas: `T` patrón, `P` proel, `1B…6B` babor, `1E…6E` estribor (bancadas numeradas de popa a proa). En trainerilla y batel las bancadas son individuales y se numeran `1…6` / `1…4`. **Vacío = sin restricción** (cualquier puesto de remero). Detalle en la guía.

## Excel de barcos (maestro)

Columnas: `Tipo · Nombre · Eslora (m) · Manga (m) · Puntal (m) · Calado (m) · Peso del casco (kg)`. Tipo (`trainera`, `trainerilla`, `batel`) y nombre son obligatorios; lo vacío toma el valor predefinido del tipo.

## Limitaciones (léelas antes de fiarte de los números)

- **Trainerilla y batel: parte del modelo es una hipótesis.** El calado, la separación entre bancadas (1,2 m) y la banda de remada alterna no son datos medidos (ver [docs/MODELO.md](docs/MODELO.md)). Afectan al trimado y al asiento estimados. Ajusta la eslora y, si tienes cotas reales, abre un issue para incorporarlas.
- Las reglas de categoría del patrón (peso mínimo) son las mismas para los tres tipos de barco.

- **Persistencia:** la plantilla, los ajustes y la tripulación manual se guardan automáticamente en el `localStorage` del navegador (o en `window.storage` si se abre dentro de Claude.ai). Los datos quedan **solo en ese navegador y equipo**: no se comparten entre dispositivos ni personas, y se pierden si se borran los datos del sitio o se usa una ventana privada. Algunos navegadores restringen `localStorage` con `file://`; en ese caso la app funciona sin guardar (úsala desde Pages o un servidor local). **El Excel sigue siendo la copia de seguridad y el medio para compartir.**
- **Funciona sin conexión**: SheetJS 0.18.5 (Excel) y la tipografía IBM Plex van incluidas. Hay tres formas de usarlo:
  - **Versión autónoma** (`optimizador-alineacion-remo.html`, ~1,2 MB): un único archivo sin dependencias externas; se genera con `npm run build` y se publica en cada release.
  - **PWA** (GitHub Pages): se instala desde el navegador y funciona sin conexión tras la primera visita (ver abajo).
  - **`index.html` + `vendor/`**: el código limpio y editable. `index.html` necesita la carpeta `vendor/` a su lado; si lo copias solo, el Excel no funcionará y la tipografía caerá a una de sistema.
  Licencias de terceros en `vendor/`.
- **SheetJS 0.18.5** (última versión publicada en npm) tiene avisos de seguridad conocidos al leer archivos no confiables; impórtalo solo con Excel de tu propia plantilla.
- **El asiento es una estimación orientativa**: usa la regla empírica GML ≈ eslora, no datos hidrostáticos del casco. No calcula escora (se corrige moviendo lateralmente a los remeros).
- El modelo de potencia es lineal por remero; no modela técnica, sincronía ni condiciones de mar.
- Los datos de ejemplo son ficticios.

## Desarrollo

```bash
npm test        # pruebas de humo de la lógica (Node ≥ 18, sin dependencias)
npm run build   # genera dist/optimizador-alineacion-remo.html (versión autónoma)
npm run build:pwa   # además genera el sitio publicable dist/site (PWA + autónoma)
```

Todo el código propio está en `index.html` (HTML + CSS + JS en una IIFE); `vendor/` contiene dependencias de terceros sin modificar. Ver [CONTRIBUTING.md](CONTRIBUTING.md).

## Publicar en GitHub Pages

*Settings → Pages → Source: GitHub Actions*. El workflow `.github/workflows/pages.yml` ejecuta las pruebas, construye el sitio con `npm run build:pwa` y lo despliega en cada push a `main`. Al crear una etiqueta `v*` (p. ej. `v1.2.0`) publica además una *release* con la versión autónoma adjunta.

### PWA: instalable y sin conexión

- **Archivos:** `manifest.webmanifest`, `sw.js` e `icons/`. Todas las rutas son relativas, así que funciona bajo la subruta `/<repo>/` de Pages (y en un dominio propio).
- **Sin conexión:** al primer acceso el service worker precachea la aplicación completa (HTML, SheetJS y fuentes; 18 URLs). Después abre y funciona sin red; las plantillas de Excel se generan en la propia app.
- **Actualizaciones:** la versión de la caché es un hash del contenido (lo calcula `scripts/build-pwa.js`). Cuando se publica un cambio, la app muestra «Hay una versión nueva» con el botón *Actualizar*; no recarga sola para no interrumpir un trabajo en curso. Una PWA instalada comprueba si hay versión nueva cada vez que vuelve a primer plano.
- **Instalar:** Chrome/Edge (icono de instalar en la barra de direcciones), Android (menú → *Instalar aplicación*), iOS/Safari (Compartir → *Añadir a pantalla de inicio*).
- **Desarrollo local:** sirve la carpeta con cualquier servidor estático (`npx http-server .`). El `sw.js` del repositorio está en modo desarrollo (no cachea nada); solo el build lo convierte en el de producción.
- **Datos:** `localStorage` es por origen. En Pages, `https://<usuario>.github.io` lo comparten todos tus proyectos de Pages; las claves de esta app llevan el prefijo `trainera:`. Los datos siguen siendo locales a cada dispositivo: el Excel es el medio para moverlos.
- La versión autónoma de un solo archivo **no** es PWA (se abre desde `file://`, donde no hay service workers); el build elimina esas partes.

## Licencia

[MIT](LICENSE). Cambia el titular del copyright en `LICENSE` antes de publicar.
