# Modelo y límites

## Puntuación
`score = scorePotencia − penalización`, con
`penalización = wBanda·desequilibrioBandas + wTrim·costeTrim + wPitch·cabeceo + wPareja·costePareja + 300·excesoPesoMedio`.
Los pesos `w*` son los deslizadores. En modo *solo peso* `scorePotencia` no interviene.

## Optimización
Recocido simulado: 10 reinicios × 3500 iteraciones, heurística de colocar primero a los más restringidos, devolviendo las 3 mejores soluciones distintas. No garantiza el óptimo global.

## Barcos
Tipos predefinidos (dimensiones y peso mínimo de la tabla de partida del proyecto):

| | Bancadas | Proel | Eslora | Manga | Puntal | Peso mín. | Calado* |
|---|---|---|---|---|---|---|---|
| Trainera | 6 dobles | sí | 12 m | 1,72 m | 0,95 m | 200 kg | 0,15 m |
| Trainerilla | 6 individuales | no | 9,5 m | 1,10 m | 0,61 m | 100 kg | 0,14 m |
| Batel | 4 individuales | no | 7 m | 0,975 m | 0,56 m | 70 kg | 0,15 m |

**Hipótesis, no datos medidos:**
- \* El **calado** no figuraba en la tabla; en trainerilla y batel se estimó para que el coeficiente de bloque con tripulación nominal sea ≈ 0,4, como en la trainera.
- El **proel** solo existe en la trainera (13 = 12 remeros en 6 bancadas + proel). En trainerilla (6 remeros) y batel (4) todos van en **bancadas individuales sobre el eje**, sin proel.
- **Banda de remada:** en esas bancadas alterna de popa a proa; la de la bancada 1 es configurable (por defecto babor). El peso no entra en el equilibrio lateral (sin brazo), igual que el proel de la trainera; la potencia y los W/kg sí cuentan en la banda de remada. No hay parejas, así que el coste de pareja es 0.
- La **posición de las bancadas** de trainerilla y batel usa una separación de 1,2 m entre bancadas individuales (1,56 m en la trainera) y un centro desplazado hacia proa para que una tripulación nominal (remeros de 80 kg, patrón de 60 kg) deje el CG en el centro del casco. Sin este desplazamiento el patrón, al no haber proel que lo compense, daría un error de trimado permanente.
- El **puntal** es informativo; no interviene en ningún cálculo.

## Geometría
Posición longitudinal x (0 proa, 1 popa). Patrón a 0,6 m de la popa; proel a 0,72 m de la proa; bancada *i* de *n*: `x = xCentro + ((n+1)/2 − i)·(sep / eslora)`, con sep = 1,56 m (trainera, bancadas dobles) o 1,2 m (bancadas individuales); casco 0,50. En la trainera de 12 m resulta: patrón 0,95 · bancadas 1…6 = 0,82; 0,69; 0,56; 0,43; 0,30; 0,17 · proel 0,06 (idéntico a las versiones de un solo barco). `xCentro` = 0,495 (trainera), 0,445 (trainerilla), 0,42 (batel). Como las posiciones dependen de la eslora, editarla las desplaza.
`xcg = (Σ peso·x + pesoCasco·0,5) / (Σ peso + pesoCasco)`; el trimado se mide como momento `peso·(x−0,5)`.

## Asiento
`tan θ = (xcg − xObjetivo)·L / GML` con **GML ≈ eslora** (regla empírica). Se muestra además un Cb implícito `peso/(1025·L·B·T)` como comprobación de coherencia con eslora/manga/calado.
Un método basado en la elipse de flotación se probó y se descartó: daba un casco ~10× demasiado rígido.

**Es una estimación de orden de magnitud**, no sustituye a datos hidrostáticos reales ni a una prueba de inclinación.

## Qué se muestra y qué es solo una heurística
La interfaz distingue dos niveles (interruptor **Básico / Avanzado**; solo cambia lo mostrado, no el cálculo):
- **Siempre visibles:** peso medio frente al máximo (regla de categoría), potencia total, desequilibrio de bandas en peso y vatios, desplazamiento del CG, cuadrantes y círculo de equilibrio.
- **Solo en avanzado:** desequilibrio por W/kg (derivado de los otros dos), asiento (el mismo desplazamiento dividido por GML ≈ eslora, con precisión aparente que no tiene), dispersión de masas (índice, no validado), homogeneidad de pareja (criterio técnico, no físico), los pesos de cada criterio en la optimización (todos 1,0, sin calibrar) y la referencia de CG.
- **Desplazamiento del CG:** es relativo a la referencia de CG (por defecto 0,50, que equivale a suponer centro de carena y CG del casco en el centro geométrico). Compara alineaciones entre sí; el valor absoluto necesitaría la referencia real.
- **Coeficiente de bloque:** ya no se muestra como cifra en las tarjetas. Solo comprueba, con la tripulación nominal, que eslora, manga, calado y peso son coherentes entre sí (rango razonable 0,20–0,60; solo detecta errores gruesos).
- **Desequilibrio de bandas en peso:** índice |ΣP_babor − ΣP_estribor| / ΣP. No incluye brazo de palanca real ni calcula escora. Una estimación de la escora estática en la trainera da del orden de 0,1–0,25° por cada 10 kg de diferencia neta (supuestos: desplazamiento ≈ 1.300 kg, manga de flotación 1,4–1,7 m, KG 0,4–0,7 m; sin verificar); el balanceo dinámico no está modelado.

## No incluido
Escora (se corrige moviendo lateralmente a los remeros), técnica, sincronía, mar y viento, y variación de potencia con la fatiga.
