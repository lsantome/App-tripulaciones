# Contribuir a Optimizador de alineación de remo

- Todo el código propio vive en `index.html` (el build solo empaqueta). Los bloques entre `<!-- PWA:START -->` y `<!-- PWA:END -->` se eliminan en la versión autónoma: no metas ahí nada que la app necesite para funcionar. Mantén el JS en la IIFE y el estilo existente.
- Antes de abrir un PR: `npm test` (incluye las pruebas PWA), `npm run build:pwa` (comprueba que la versión autónoma no tiene referencias externas) y prueba manual de los dos modos y de importar/exportar Excel.
- Cambios de física (pesos, GML, penalizaciones): explica el porqué en el PR y actualiza `docs/MODELO.md`.
- Reglas de dominio que no deben romperse: el patrón nunca usa potencia; el proel (solo trainera) no cuenta en bandas; la trainera debe dar los mismos resultados que antes de la multiembarcación.
- Las constantes de cada tipo de barco están en `TIPOS_BARCO` (`index.html`). Los datos de trainerilla y batel marcados como hipótesis se pueden sustituir por cotas reales.
- Issues: usa las plantillas; adjunta captura y, si procede, el Excel (sin datos personales reales).
