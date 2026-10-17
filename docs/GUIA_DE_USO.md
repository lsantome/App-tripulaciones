# Guía de uso

## 1. Conceptos y convenciones

- **Puestos según el barco:**
  - **Trainera:** patrón (`T`), 6 bancadas dobles (`1B…6B` babor, `1E…6E` estribor) y proel (`P`).
  - **Trainerilla y batel:** patrón (`T`) y bancadas **individuales sobre el eje longitudinal** (`1…6` y `1…4`, de popa a proa). Cada remero rema por una banda que alterna de popa a proa.

| Barco | Remeros | Bancadas | Proel | Eslora | Manga | Puntal | Peso mín. casco |
|---|---|---|---|---|---|---|---|
| Trainera | 13 + patrón | 6 dobles | sí | 12 m | 1,72 m | 0,95 m | 200 kg |
| Trainerilla | 6 + patrón | 6 individuales | no | 9,5 m | 1,10 m | 0,61 m | 100 kg |
| Batel | 4 + patrón | 4 individuales | no | 7 m | 0,975 m | 0,56 m | 70 kg |

Los valores predefinidos son editables en el panel **Barco** de la pestaña Tripulación.
- **Numeración de popa a proa:** patrón → 1 → 2 → … → 6 → proel. En el esquema, **proa arriba y popa abajo**.
- **Popa / proa:** cada puesto cuenta como popa si está a popa del centro del casco y como proa si está a proa. En la trainera: popa = bancadas 1–3 + patrón, proa = bancadas 4–6 + proel. En trainerilla (bancadas 1–3 popa, 4–6 proa) y batel (1–2 popa, 3–4 proa) el reparto sale de la posición de cada bancada.
- **Patrón:** solo aporta peso. Nunca se usa su potencia, aunque la tenga escrita.
- **Proel:** se sienta sobre el eje; su peso suma a proa pero **no** al desequilibrio babor/estribor. Su potencia suma a la banda configurada (babor por defecto).

## 2. Pestaña «Configuración»

### Maestro de barcos
Opcional. Descarga la **plantilla de barcos**, rellénala con tus embarcaciones e impórtala con **Importar maestro de barcos**. Importar sustituye el maestro actual.

| Columna | Contenido | Obligatoria |
|---|---|---|
| A Tipo | `trainera`, `trainerilla` o `batel` (sin importar mayúsculas ni tildes) | sí |
| B Nombre | texto | sí |
| C Eslora (m) | número > 0 | no |
| D Manga (m) | número > 0 | no |
| E Puntal (m) | número > 0 (informativo) | no |
| F Calado (m) | número > 0 | no |
| G Peso del casco (kg) | número > 0 | no |

Lo vacío toma el valor predefinido del tipo. Se acepta coma o punto decimal. Una fila con tipo desconocido, sin nombre o con un número no válido se rechaza con aviso. Se avisa (sin rechazar) si el peso está por debajo del mínimo del tipo o si eslora/manga se alejan mucho de lo habitual (posible error de unidades).

Sin maestro, la app funciona con los barcos predefinidos.

### Plantilla de remeros
- **+ Remero**, **Cargar ejemplo** (datos ficticios), **Vaciar**.
- Cada persona: nombre, kg, W (opcional), W/kg (calculado) y **posiciones** en las que puede ir.
  - Sin posiciones marcadas = sin restricción (cualquier puesto de remero del barco, incluido el proel si existe).
  - Una persona marcada solo como patrón (`T`) no remará nunca.
- **Importar plantilla (Excel)** reemplaza la plantilla actual. **Descargar plantilla Excel** da un modelo.

### Formato del Excel
| Columna | Contenido | Obligatoria |
|---|---|---|
| A Nombre | texto | sí |
| B Peso (kg) | número > 0 | sí |
| C Posiciones | códigos separados por comas: `T, P, 1B, 1E … 6B, 6E`; vacío = sin restricción | no |
| D Potencia (W) | número > 0 | no |
| E W/kg | informativo, no se importa | no |

Una celda vacía equivale a «sin restricción» (igual que en la app). Si hay texto pero ningún código válido (p. ej. `ZZ`), la fila se rechaza con aviso. La primera fila es la cabecera. Ejemplo: [`examples/plantilla_alineacion_remo.xlsx`](../examples/plantilla_alineacion_remo.xlsx).

## 3. Pestaña «Tripulación»

### Panel «Barco» (encima de todo)
- **Embarcación:** tipos predefinidos o barcos de tu maestro. Al cambiar se cargan sus valores, se rehacen los puestos y se borran las propuestas automáticas.
- **Eslora, manga, puntal, calado y peso del casco:** editables en cualquier momento. La eslora también reposiciona las bancadas.
- **Restablecer valores:** vuelve a los del tipo o barco elegido.
- Se avisa si el peso queda por debajo del mínimo del tipo.
- Cambiar de barco no borra la plantilla de remeros; las posiciones que no existan en el nuevo barco se ignoran (en la tripulación manual se quitan esos puestos). La opción «Todas» de posiciones significa «sin restricción» y vale para cualquier barco.

### Bancadas individuales (trainerilla y batel)
- El peso de los remeros **no genera desequilibrio lateral** (van sobre el eje): la métrica de bandas de peso muestra «no aplica» y la tabla de cuadrantes reparte el peso solo por proa/popa.
- La **banda de remada** sí cuenta para la potencia y los W/kg. Alterna de popa a proa; en *Criterios* eliges por qué banda rema la bancada 1 (por defecto babor).
- No hay parejas: el criterio «Homogeneidad de pareja» no se muestra.
- En el esquema el remero se dibuja en el eje; el color indica su banda de remada y el puesto vacío muestra, p. ej., `1B` (bancada 1, remada por babor).
- En el Excel de tripulación, las posiciones de estos barcos son números: `1,2,5`.

### Mapa de calor
Casilla encima de las sub-pestañas. Colorea cada puesto de azul (ligero) a rojo (pesado) pasando por blanco, por **peso** o **potencia**. Desactivado por defecto.

### Modo Automático
1. **Categoría:** fija el peso mínimo del patrón (senior masculino 55 kg, femenino 50 kg, libre 0).
2. **Banda del proel:** babor o estribor.
3. **Prioridad:** *Solo peso* (no necesita potencias), *Vatios absolutos* o *W/kg* (avisan si falta algún dato).
4. **Peso medio máximo** (toda la tripulación con patrón, 82 kg por defecto): superarlo penaliza fuerte.
5. **Deslizadores** (0–2): desequilibrio de bandas, error de trimado, momento de cabeceo, homogeneidad de pareja.
6. **Remeros disponibles:** desmarca lesionados o ausentes.
7. **Parámetros avanzados:** trimado objetivo (0,50 = centro). El peso del casco se ajusta en el panel **Barco**.
8. **Optimizar alineación** → hasta 3 propuestas (Alineación A/B/C), cada una con su esquema y métricas.

### Modo Manual
Arrastra una ficha del **Banco** a un puesto (o pulsa ficha y luego puesto). *Vaciar tripulación* y *Exportar a Excel* están en el banco. Las métricas se actualizan al instante.

## 4. Cómo leer las métricas

- **Desequilibrio de bandas** (peso, vatios, W/kg): diferencia babor − estribor, sin contar patrón ni proel en peso. Cerca de 0 es mejor.
- **Cuadrantes** (proa/popa × babor/estribor): tabla única con sumas por banda, por proa/popa y total. Patrón y proel cuentan en proa/popa pero no en bandas.
- **Gráfico circular:** proa arriba, popa abajo. Tres marcadores: peso, vatios, W/kg. La escala vertical es 2,5× el umbral de trimado.
- **Trimado = momento, no kilos.** Importa `peso × distancia al centro`. Por eso puede haber más kilos en popa y que el centro de gravedad no vaya hacia popa: un proel ligero en el extremo de proa puede compensar con su brazo largo. La nota «Momento de Proa/Popa» lo muestra.
- **Asiento estimado:** ángulo y desviación en cm. Umbral de aviso = 2 % de la eslora (24 cm en 12 m). Es **orientativo** (ver [MODELO.md](MODELO.md)).

## 5. Exportar a Excel
Genera tres hojas: **Tripulación** (puesto, rol, banda, nombre, peso, potencia, potencia efectiva, W/kg), **Desglose** (tabla de cuadrantes con totales; proel y patrón aparte) y **Resumen** (los tres desequilibrios).

## 6. Persistencia y datos
La app guarda plantilla, ajustes (incluido el tema) y tripulación manual en el `localStorage` de tu navegador, así que al recargar recuperas el estado. Es local a ese navegador y equipo: no se comparte con otras personas ni dispositivos, y se pierde al borrar los datos del sitio o en ventana privada. Algunos navegadores bloquean `localStorage` con archivos abiertos desde disco (`file://`); entonces no se guarda nada. **Exporta a Excel para compartir y como copia de seguridad.** Las alineaciones del modo Automático no se guardan: se recalculan. Los datos no salen de tu navegador: no hay servidor y las librerías van incluidas (en `vendor/` o, en la versión autónoma, dentro del propio HTML), por lo que no hay peticiones externas.

### Instalar como aplicación (PWA)
Si abres la herramienta desde GitHub Pages, puedes instalarla: Chrome/Edge muestran un icono de instalar en la barra de direcciones; en Android, menú → *Instalar aplicación*; en iPhone/iPad (Safari), Compartir → *Añadir a pantalla de inicio*. Tras la primera visita funciona **sin conexión**. Cuando haya una versión nueva aparecerá el aviso «Hay una versión nueva de la herramienta» con el botón *Actualizar* (tus datos guardados se conservan). Los datos de la app instalada y los de la pestaña del navegador comparten almacenamiento en el mismo navegador, pero no entre dispositivos.

## 7. Problemas frecuentes
- *«No se pudo cargar la librería de Excel»*: estás usando `index.html` sin la carpeta `vendor/` a su lado. Usa la versión autónoma `optimizador-alineacion-remo.html` o copia también `vendor/`.
- *Importé y faltan personas*: revisa el aviso bajo el botón; filas sin nombre, peso válido o posiciones se omiten.
- *El optimizador necesita remeros suficientes para el barco elegido* (13 en trainera, 6 en trainerilla, 4 en batel, más un patrón con posición `T`).
- *El optimizador no da 3 propuestas o avisa de datos*: revisa que haya suficientes remeros disponibles, que las posiciones permitidas no sean incompatibles y que, en modo vatios o W/kg, todos tengan potencia.
- *La app instalada no muestra cambios recientes*: pulsa *Actualizar* en el aviso, o ciérrala y ábrela de nuevo; la versión nueva se descarga al volver a primer plano.
- *Los datos guardados no aparecen en otro dispositivo o navegador*: es lo esperado; el almacenamiento es local. Usa el Excel para moverlos.
