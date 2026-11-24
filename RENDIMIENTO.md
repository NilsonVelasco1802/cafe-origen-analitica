# Rendimiento del motor de analítica — Café Origen

Documento técnico para el marketplace. Describe el costo en **tiempo** y **memoria** de cada función del motor, respaldado con mediciones.

- **n** = número de ventas. **p** = productos distintos (5 en el catálogo). **c** = ciudades distintas (4). **u** = clientes distintos (≈ n/3 en los datos de prueba).
- Complejidades en el caso general; las constantes se detallan en la justificación.

## Metodología de medición

- Node.js v22, `performance` con `process.hrtime.bigint()`.
- Datos: `generarVentas(10000)` (aleatorios, ~3.333 clientes distintos, 5 productos, 4 ciudades).
- Se descartan 5 ejecuciones de calentamiento y se reporta la **mediana de 41 ejecuciones** (9 para la versión ingenua de clientes recurrentes).
- Para verificar la complejidad, cada función se midió también con n = 1.000, 20.000 y 40.000 (ver sección "Evidencia de escalamiento").
- Scripts reproducibles: `benchmark.js` (n = 1.000 a 40.000) y `benchmark-proyeccion.js` (n = 100.000 a 1.000.000), ambos con `node --expose-gc`.
- Los tiempos dependen de la máquina; lo que importa es el **orden de magnitud** y cómo crece al duplicar n.

## Tabla de rendimiento (n = 10.000)

| Función | Qué hace | Tiempo | Espacio | Justificación | Medido (n = 10.000) |
|---|---|---|---|---|---|
| `valorVen` | Valor de una venta (cantidad × precio) | O(1) | O(1) | Una multiplicación. | Se invoca 1 vez por venta dentro de otras funciones |
| `totalVendido` | Suma de ventas válidas (precio > 0 y cantidad > 0) | O(n) | O(1) | Un solo recorrido con acumulador. | 10.000 iteraciones · 0,027 ms |
| `totalVendidoM` | Igual, con `filter` + `reduce` | O(n) | O(n) | Dos pasadas; `filter` crea un arreglo intermedio de hasta n elementos. | 20.000 pasos (n + válidas) · 0,224 ms |
| `unidadesVendidas` | Unidades de un producto | O(n) | O(1) | Recorre todas las ventas; solo compara y suma. Usa `ventas` global, no un parámetro. | 10.000 comparaciones · 0,042 ms |
| `unidadesVendidasM` | Igual, con `filter` + `reduce` | O(n) | O(k), k = coincidencias (≤ n) | `filter` guarda solo las ventas del producto (~n/p). | ~12.000 pasos · 0,181 ms |
| `ventaMayor` | Venta de mayor valor | O(n) | O(1) | Un recorrido; recalcula `valorVen(mayor)` en cada vuelta (2 multiplicaciones por iteración, constante). | 10.000 iteraciones · 0,046 ms |
| `ticketPromedio` | Valor promedio de las ventas con valor > 0 | O(n) | O(1) | Un recorrido con dos acumuladores (`total`, `contador`). | 10.000 iteraciones · 0,038 ms |
| `ventasPorCiudad` | Total vendido en una ciudad (ignora mayúsculas y espacios) | O(n) | O(1) | Un recorrido; en cada vuelta hace `trim().toLowerCase()` a ambas ciudades (2 cadenas temporales **por iteración**, ~20.000 en total). | 10.000 iteraciones, ~20.000 normalizaciones · 0,629 ms |
| `ventasPorCiudadM` | Igual, con `filter` + `reduce` | O(n) | O(k), k = ventas de la ciudad (≤ n) | Misma normalización por iteración + arreglo intermedio. | ~12.500 pasos · 0,778 ms |
| `totalPorCiudad` | Total vendido por **todas** las ciudades en una pasada | O(n) | O(c) | Un `reduce` con objeto acumulador; el objeto tiene como máximo c claves. | 10.000 iteraciones · 1,181 ms |
| `unidadesPorProducto` | Unidades vendidas agrupadas por producto | O(n) | O(p) | Un `reduce` con objeto acumulador de p claves. | 10.000 iteraciones · 0,496 ms |
| `topProductosPorValor` | Los k productos con mayor valor vendido | O(n + p log p) | O(p) | Un `reduce` O(n) para agrupar, luego ordena solo los p productos (no las n ventas) y corta con `slice`. Con p fijo, equivale a O(n). | 10.000 iteraciones + ordenar 5 elementos · 0,499 ms |
| `ventasDelDia` | Ventas de una fecha | O(n) | O(k), k = ventas del día (≤ n) | `filter` sobre todas las ventas; devuelve las que coinciden (~n/30). | 10.000 comparaciones · 0,170 ms |
| `clientesRecurrentes` ⚠️ (ver nota) | Clientes con 2 o más compras | O(n) | O(u) | Cuenta compras por cliente en un `Map` y filtra los que tienen ≥ 2. | 10.000 iteraciones · 0,782 ms |
| `clientesRecurrentesIngenuo` ⚠️ (ver nota) | Mismo resultado, comparando cada venta con todas las demás | O(n²) | O(u) | Bucle dentro de bucle: por cada venta recorre todas las ventas. | ~100.000.000 comparaciones · **290,9 ms** |

> ⚠️ **Nota sobre clientes recurrentes.** El archivo del motor entregado no contiene esa función. Las dos filas de arriba son implementaciones de referencia (incluidas en `benchmark.js`) para documentar el contraste. Si el código real tiene otra forma, hay que medirlo con el mismo script. Ambas versiones devolvieron el mismo resultado (2.682 clientes recurrentes con la semilla de esta medición).

**Sobre la memoria.** La columna "Espacio" es el análisis de complejidad, que es la fuente principal. Las mediciones de `heapUsed` son orientativas porque el recolector de basura libera en momentos no controlados: en las variantes con `filter` el arreglo intermedio se vio en el orden de cientos de KB (232–537 KB), y en los acumuladores simples, de 0 a 7 KB. El valor de 469 KB de `ventasPorCiudad` es basura temporal de las cadenas de `trim().toLowerCase()` pendiente de recolección, no memoria retenida: su espacio vivo es O(1).

## Evidencia de escalamiento

Mediana en ms al crecer n. Si la función es lineal, al **duplicar** n el tiempo debería **duplicarse**; si es cuadrática, **cuadruplicarse**. (A 1.000 los tiempos incluyen calentamiento del compilador JIT, por eso no siempre son menores que a 10.000.)

| Función | n = 1.000 | n = 10.000 | n = 20.000 | n = 40.000 | Comportamiento 20.000 → 40.000 |
|---|---|---|---|---|---|
| `totalVendido` | 0,052 | 0,027 | 0,039 | 0,197 | lineal |
| `ventaMayor` | 0,081 | 0,046 | 0,055 | 0,216 | lineal |
| `ticketPromedio` | 0,075 | 0,038 | 0,044 | 0,203 | lineal |
| `unidadesVendidas` | 0,043 | 0,042 | 0,070 | 0,212 | lineal |
| `ventasPorCiudad` | 0,177 | 0,629 | 0,869 | 1,753 | ×2,0 (lineal) |
| `ventasPorCiudadM` | 0,078 | 0,778 | 1,086 | 3,234 | ×3,0 (lineal, con presión de memoria) |
| `totalPorCiudad` | 0,076 | 1,181 | 1,485 | 2,908 | ×2,0 (lineal) |
| `unidadesPorProducto` | 0,045 | 0,496 | 0,715 | 1,427 | ×2,0 (lineal) |
| `topProductosPorValor` | 0,050 | 0,499 | 0,773 | 1,625 | ×2,1 (lineal) |
| `ventasDelDia` | 0,018 | 0,170 | 0,398 | 0,515 | lineal |
| `clientesRecurrentes` (Map) | 0,258 | 0,782 | 1,451 | 3,313 | ×2,3 (lineal) |
| `clientesRecurrentesIngenuo` | 3,03 | 290,9 | 1.110,5 | 5.658,5 | **×5,1 (cuadrático)** |

Lectura: a 40.000 ventas, todo el motor lineal sigue por debajo de ~3,3 ms; la versión cuadrática ya tarda 5,7 **segundos**.

## Priorización: qué optimizar

El criterio es la evidencia: una función merece trabajo si su tiempo crece más rápido que n, si tiene un defecto que se puede cobrar en producción, o si su costo se multiplica por cómo se la usa.

| Prioridad | Qué | Evidencia | Acción |
|---|---|---|---|
| **1 — Crítica (corrección)** | `ticketPromedio` | La comprobación `contador === 0` está **dentro** del bucle: si la primera venta tiene valor 0 devuelve `null` aunque haya ventas válidas después (`[{cantidad:0,precio:1},{cantidad:2,precio:5}]` → `null`). Con arreglo vacío no entra al bucle y devuelve `NaN` en vez de `null`. | Mover la comprobación después del bucle. Costo: 0 en rendimiento. Es un error de resultado, más grave que cualquier lentitud. |
| **2 — Alta** | `clientesRecurrentes` (cualquier versión O(n²)) | 290,9 ms a 10.000 y 5,7 s a 40.000, 250 veces más lenta que la versión con `Map` (0,78 ms). Es la única con crecimiento superlineal. | Usar conteo con `Map` (O(n)). Añadir una prueba que falle si el tiempo supera, por ejemplo, 50 ms con 10.000 ventas. |
| **3 — Media** | Consultas por ciudad repetidas (`ventasPorCiudad` / `ventasPorCiudadM`) | Cada llamada recorre todo y normaliza ~20.000 cadenas. Para las c = 4 ciudades son 4 recorridos (~2,5 ms) contra uno solo de `totalPorCiudad` (1,2 ms), y la brecha crece con c. | Si se piden varias ciudades, usar `totalPorCiudad` una vez. En `ventasPorCiudad` normalizar `ciudad` **una vez antes del bucle**. |
| **4 — Media-baja** | `unidadesVendidas` / `unidadesVendidasM` | Dependen de la variable global `ventas`, no de un parámetro: no se pueden probar ni conectar al marketplace con otros datos. El costo en tiempo es bajo (0,04 ms). | Recibir `ventas` como primer parámetro, igual que las demás. Es un cambio de diseño, no de velocidad. |
| **5 — Baja** | Versiones con `filter` + `reduce` (`…M`) | 2–8 veces más lentas que el bucle simple en estas mediciones (p. ej. `totalVendidoM` 0,224 ms vs 0,027 ms) y con arreglo intermedio O(n). Siguen siendo lineales y rápidas. | No urgente. Preferir el bucle donde n pueda ser muy grande; mantener `…M` donde se valore la legibilidad. |
| **Sin acción** | `totalVendido`, `ventaMayor`, `unidadesPorProducto`, `topProductosPorValor`, `ventasDelDia`, `totalPorCiudad` | Lineales, ≤ 1,2 ms con 10.000 ventas. | No optimizar: no hay evidencia que lo justifique. |

## Proyección

Estimación del tiempo de cada reporte con **1.000.000 de ventas**, calculada a partir de las mediciones de la sección anterior y luego comparada con una medición real a ese tamaño.

**Método.**
- Funciones lineales: tiempo(1.000.000) = tiempo(40.000) × 25. Como cota inferior se usa tiempo(10.000) × 100. La proyección se reporta como el valor de ×25 y el rango va de la cota inferior a ese valor.
- Función cuadrática (`clientesRecurrentesIngenuo`): tiempo = a·n², con `a` calculado de las mediciones (2,9·10⁻⁶ ms con n = 10.000 y 3,5·10⁻⁶ ms con n = 40.000). Multiplicar n por 100 multiplica el tiempo por **10.000**.
- Comprobación: las funciones lineales se midieron de verdad con 1.000.000 de ventas (mediana de 11 ejecuciones, `benchmark-proyeccion.js`). La función cuadrática **no** se midió: serían ~10¹² comparaciones y casi una hora por ejecución.

| Función | Medido 10.000 | Medido 40.000 | Proyección 1.000.000 | Rango proyectado | Medido 1.000.000 | Medido / proyectado |
|---|---|---|---|---|---|---|
| `totalVendido` | 0,027 ms | 0,197 ms | 4,9 ms | 2,7 – 4,9 ms | 8,0 ms | ×1,6 |
| `ventaMayor` | 0,046 ms | 0,216 ms | 5,4 ms | 4,6 – 5,4 ms | 8,5 ms | ×1,6 |
| `ticketPromedio` | 0,038 ms | 0,203 ms | 5,1 ms | 3,8 – 5,1 ms | 7,8 ms | ×1,5 |
| `unidadesVendidas` | 0,042 ms | 0,212 ms | 5,3 ms | 4,2 – 5,3 ms | 9,7 ms | ×1,8 |
| `ventasDelDia` | 0,170 ms | 0,515 ms | 12,9 ms | 12,9 – 17,0 ms | 15,8 ms | ×1,2 |
| `unidadesVendidasM` | 0,181 ms | 0,890 ms | 22,2 ms | 18,1 – 22,2 ms | 22,9 ms | ×1,0 |
| `totalVendidoM` | 0,224 ms | 1,386 ms | 34,7 ms | 22,4 – 34,7 ms | 54,5 ms | ×1,6 |
| `unidadesPorProducto` | 0,496 ms | 1,427 ms | 35,7 ms | 35,7 – 49,6 ms | 36,0 ms | ×1,0 |
| `topProductosPorValor` | 0,499 ms | 1,625 ms | 40,6 ms | 40,6 – 49,9 ms | 42,2 ms | ×1,0 |
| `ventasPorCiudad` | 0,629 ms | 1,753 ms | 43,8 ms | 43,8 – 62,9 ms | 46,8 ms | ×1,1 |
| `totalPorCiudad` | 1,181 ms | 2,908 ms | 72,7 ms | 72,7 – 118,1 ms | 84,1 ms | ×1,2 |
| `ventasPorCiudadM` | 0,778 ms | 3,234 ms | 80,9 ms | 77,8 – 80,9 ms | 62,5 ms | ×0,8 |
| `clientesRecurrentes` (Map) | 0,782 ms | 3,313 ms | 82,8 ms | 78,2 – 82,8 ms | **327,7 ms** | **×4,0** |
| `clientesRecurrentesIngenuo` (O(n²)) | 290,9 ms | 5.658,5 ms | **≈ 59 min** | 48 – 59 min | no medido | — |

**Cómo leer la tabla.**
- Las funciones de un solo recorrido simple quedan entre 5 y 85 ms con un millón de ventas. Para un reporte por lotes, esto es despreciable.
- Casi todas se midieron entre ×1,0 y ×1,8 por encima de lo proyectado. Una causa probable es que con 1.000.000 de objetos los datos ya no caben en la caché del procesador. Esa explicación es una hipótesis: no se verificó con un perfilador.
- `clientesRecurrentes` con `Map` se desvió ×4,0. Sus datos crecen con n (hay ~333.000 clientes distintos, y el `Map` retuvo ~43 MB), mientras que con 10.000–40.000 ventas el `Map` era pequeño. Es la proyección menos confiable de la tabla.
- Las mediciones intermedias con 100.000–400.000 ventas fueron irregulares (p. ej. `totalVendido` salió más rápido con 400.000 que con 200.000), por el calentamiento del compilador y el recolector de basura. Por eso la proyección se hizo desde 10.000 y 40.000, y el valor medido con 1.000.000 es el que debe usarse como referencia.
- Memoria medida con 1.000.000 de ventas: `totalVendidoM` ~36 MB de arreglo intermedio; `clientesRecurrentes` ~43 MB; el resto de 0 a ~7 MB (en su mayoría basura temporal pendiente de recolección).

## Riesgos

Funciones ordenadas de **mayor a menor riesgo cuando los datos crecen**. La #1 es la que primero deja de ser utilizable.

**Criterio.** Se evaluaron cuatro factores, en este orden de peso:
1. **Orden de crecimiento del tiempo.** O(n²) pesa más que cualquier O(n): al multiplicar los datos por 100, el tiempo se multiplica por 10.000 y no por 100.
2. **Crecimiento de la memoria con n.** Estructuras o arreglos intermedios proporcionales a n (o a los clientes distintos) pesan más que acumuladores de tamaño fijo.
3. **Tiempo medido con 1.000.000 de ventas**, y qué tan mal acertó la proyección (una desviación grande indica comportamiento difícil de predecir).
4. **Multiplicador de uso.** Funciones que hay que llamar una vez por ciudad, producto o día repiten su costo.

| # | Función | Nivel | Motivo (con evidencia) |
|---|---|---|---|
| 1 | `clientesRecurrentes` en versión O(n²) | Crítico | ≈ 48–59 minutos con 1.000.000 de ventas (vs. 0,29 s con 10.000). Única con crecimiento cuadrático. |
| 2 | `clientesRecurrentes` en versión `Map` | Alto | Lineal, pero 328 ms con un millón (el más lento de los lineales), memoria O(u) ~43 MB que crece con los clientes, y desvío ×4,0 respecto a la proyección. |
| 3 | `totalVendidoM` | Medio-alto | Arreglo intermedio de hasta n elementos (~36 MB con 1.000.000); ×1,6 sobre la proyección; ~7 veces más lenta que `totalVendido` (54,5 vs. 8,0 ms). |
| 4 | `ventasPorCiudadM` | Medio-alto | Arreglo intermedio O(k) más normalización de cadenas en cada iteración (62,5 ms), y se llama una vez por ciudad. |
| 5 | `ventasPorCiudad` | Medio | Lineal y sin memoria extra, pero normaliza ~2 cadenas por venta (46,8 ms) y se repite por cada ciudad consultada. |
| 6 | `totalPorCiudad` | Medio | La más lenta de las agrupaciones (84,1 ms), con ~2 normalizaciones de cadenas por venta; pero se llama una sola vez para todas las ciudades y su memoria es O(c). |
| 7 | `topProductosPorValor` | Medio-bajo | 42,2 ms; lineal; memoria O(p). El ordenamiento solo cubre los p productos, no las ventas. |
| 8 | `unidadesVendidasM` | Medio-bajo | 22,9 ms; arreglo intermedio de ~n/p elementos; lee `ventas` global, lo que impide reutilizarla con otros datos. |
| 9 | `unidadesPorProducto` | Bajo | 36,0 ms; lineal; memoria O(p). |
| 10 | `ventasDelDia` | Bajo | 15,8 ms; el resultado crece con n (~n/30), pero es lo que se pide devolver. |
| 11 | `unidadesVendidas` | Bajo | 9,7 ms; O(1) de memoria; mismo problema de `ventas` global. |
| 12 | `ventaMayor` | Bajo | 8,5 ms; O(1) de memoria. |
| 13 | `totalVendido` | Bajo | 8,0 ms; O(1) de memoria. |
| 14 | `ticketPromedio` | Bajo (escala) | 7,8 ms; O(1) de memoria. Tiene un error de resultado, ya tratado en "Priorización"; no empeora al crecer los datos. |
| 15 | `valorVen` | Mínimo | O(1) por llamada; es una multiplicación. |

**Advertencia.** Las filas 1 y 2 dependen de que el código real de clientes recurrentes coincida con las implementaciones de referencia (el archivo entregado no la incluye). Si el motor ya usa conteo con `Map`, la fila 1 desaparece y la #1 pasa a ser la fila 2.

## Plan de optimización

**Función de mayor riesgo: `clientesRecurrentes` en su versión O(n²).** Este plan describe la idea; no se implementa todavía.

**¿Qué trabajo se repite?**
- Para cada venta, la función vuelve a recorrer **todas** las ventas para contar cuántas compras tiene ese cliente. Con 1.000.000 de ventas son ~10¹² comparaciones.
- Ese conteo se rehace por cada fila de un mismo cliente: con ~3 ventas por cliente en los datos de prueba, cada cliente se cuenta ~3 veces, siempre con el mismo resultado.
- Además, `r.includes(cliente)` recorre la lista de resultados en cada venta, otro recorrido repetido que crece con la cantidad de clientes recurrentes.

**¿Qué información se puede guardar para no buscarla de nuevo?**
- Un **conteo de compras por cliente** (`cliente → número de compras`) construido en **una sola pasada**. Cada venta suma 1 a su cliente en tiempo constante; no hace falta volver a mirar las demás.
- Un conjunto de **clientes ya marcados como recurrentes**, que se llena en el momento en que el conteo de un cliente llega a 2. Con esto, la pregunta "¿ya está en el resultado?" se responde sin recorrer una lista.
- Si el marketplace consulta este reporte con frecuencia, conservar el conteo entre consultas y actualizarlo solo con las ventas nuevas, en lugar de reprocesar todo el historial.

**Decisiones por tomar antes de implementar.**
- Definir qué cuenta como compra válida. Las otras funciones ignoran ventas con `cantidad ≤ 0` o `precio ≤ 0`; clientes recurrentes debería seguir la misma regla para que los reportes sean coherentes.
- Decidir si "recurrente" significa 2 o más compras en total o en periodos distintos (p. ej. días diferentes); cambia qué se guarda por cliente.

**Qué se espera ganar (con base en las mediciones).** El trabajo baja de ~10¹² operaciones a ~10⁶ (una por venta). La versión con `Map` tardó 0,78 ms con 10.000 ventas frente a 290,9 ms de la ingenua (~370 veces menos), y se midió en 327,7 ms con 1.000.000 de ventas frente a una estimación de ~50 minutos. El costo que se acepta a cambio es memoria O(u): ~43 MB con ~333.000 clientes distintos.

**Cómo se comprobará la mejora.**
1. La versión nueva debe devolver exactamente los mismos clientes que la anterior con 10.000 y con las 12 ventas de ejemplo.
2. Volver a correr `benchmark.js` y `benchmark-proyeccion.js` y actualizar las tablas de este documento.
3. Añadir una prueba automática que falle si la función supera un umbral (p. ej. 50 ms con 10.000 ventas), para que no se reintroduzca un bucle anidado.

## Conclusión

Con 10.000 ventas, todas las funciones del archivo entregado responden en **menos de 1,3 ms** y escalan linealmente; no hay un cuello de botella de rendimiento en el código actual. Los riesgos reales son (1) el error de resultado de `ticketPromedio`, (2) cualquier implementación O(n²) de clientes recurrentes y (3) el uso repetido de consultas por ciudad en lugar de la agrupación única.

Con 1.000.000 de ventas (ver "Proyección"), las funciones del archivo siguen entre 8 y 84 ms; la excepción es cualquier versión cuadrática de clientes recurrentes, que tardaría cerca de una hora (ver "Riesgos" y "Plan de optimización").
## Comparación de tiempo total: v0.1 vs. v1.0

Medición del tiempo total de ejecución del reporte completo (excluyendo la generación de datos) sobre la misma máquina con 10.000 y 100.000 ventas.

| Volumen de ventas | Reporte v0.1 (ms) | Reporte v1.0 (ms) | Factor de mejora (v0.1 / v1.0) |
|---:|---:|---:|---:|
| 10.000 | *[Pendiente medir v0.1]* | 42,12 ms | — |
| 100.000 | *[Pendiente medir v0.1]* | 255,08 ms | — |

### Observaciones de la medición v1.0
- **Escalamiento:** Al pasar de 10.000 a 100.000 ventas (×10), el tiempo total de v1.0 pasó de **42,12 ms** a **255,08 ms** (≈ ×6,06), manteniendo un comportamiento lineal/cuasi-lineal frente al crecimiento cuadrático $O(n^2)$ de las versiones anteriores con ciclos anidados e `includes()`[cite: 1].
- **Mayor peso en 100.000 ventas:** `Producto estrella por ciudad` (64,49 ms), `Clientes recurrentes` (61,05 ms) y `Mejor semana` (47,56 ms) son las secciones más lentas del reporte.
- **Nota sobre v0.1:** `bitacora.md` no registra el tiempo total del reporte v0.1 (solo mediciones parciales de `clientesRecurrentes` original: 483,66 ms en 10.000 ventas y omitida en 100.000)[cite: 1].


## Tabla de complejidades del motor y funciones analíticas

### Convenciones de notación
- **n:** cantidad de ventas (o productos del catálogo en `comboRegalo` / `parMasCercano`)[cite: 1].
- **v:** total de ventas registradas[cite: 1].
- **d:** cantidad de clientes distintos ($d \le v$)[cite: 1].
- **r:** cantidad de clientes recurrentes ($r \le d$)[cite: 1].
- **c:** cantidad de ciudades distintas[cite: 1].
- **p:** cantidad de productos distintos[cite: 1].
- **k:** pares ciudad-producto distintos ($k \le v$) o tamaño de ventana en `mejorSemana` ($k = 7$ días)[cite: 1].
- **d_dias:** cantidad de días analizados en `mejorSemana`[cite: 1].

| Función / Algoritmo | Complejidad temporal | Complejidad espacial (extra) | Clase / Notas |
|---|---|---|---|
| `primeraVenta(ventas)` | $O(1)$[cite: 1] | $O(1)$[cite: 1] | Constante; acceso directo al primer elemento[cite: 1]. |
| `totalVendido(ventas)` | $O(n)$[cite: 1] | $O(1)$[cite: 1] | Lineal; recorre el arreglo una vez con acumulador escalar[cite: 1]. |
| `ventaMayor(ventas)` | $O(n)$[cite: 1] | $O(1)$[cite: 1] | Lineal; un recorrido y comparación por elemento[cite: 1]. |
| `totalPorCiudad(ventas)` | $O(n)$[cite: 1] | $O(c)$ *(o $O(n)$ si agrupa listas)*[cite: 1] | Lineal en tiempo; espacio acotado por ciudades distintas $c$[cite: 1]. |
| `totalCiudadUnaPasada(ventas, ciudad)` | $O(n)$[cite: 1] | $O(1)$[cite: 1] | Una sola pasada sin crear arreglos intermedios[cite: 1]. |
| `totalCiudadCadena(ventas, ciudad)` | $O(n)$[cite: 1] | $O(n)$[cite: 1] | Cuatro etapas encadenadas (`map` / `filter` / `map` / `reduce`) y 3 arreglos nuevos[cite: 1]. |
| `clientesRecurrentes` (original / bruta + `includes`) | $O(n^2)$[cite: 1] | $O(r)$[cite: 1] | Cuadrática por bucles anidados y búsqueda lineal con `includes()`[cite: 1]. |
| `clientesRecurrentesSet(ventas)` | $O(n)$[cite: 1] | $O(d + r)$[cite: 1] | Lineal en tiempo usando `Set` (`vistos` y `recurrentes`)[cite: 1]. |
| `clientesRecurrentesMap(ventas)` | $O(n)$[cite: 1] | $O(d + r)$[cite: 1] | Lineal en tiempo usando `Map` con contador por cliente[cite: 1]. |
| `primerClienteUnico(ventas)` (con `Map`) | $O(v)$[cite: 1] | $O(d)$[cite: 1] | Lineal (dos pasadas de conteo/búsqueda sobre $v$ ventas)[cite: 1]. |
| `primerClienteUnicoBruta(ventas)` | $O(v^2)$[cite: 1] | $O(1)$[cite: 1] | Cuadrática; cuenta repeticiones recorriendo por cada venta[cite: 1]. |
| `productoEstrellaPorCiudad(ventas)` (con `Map`) | $O(v)$[cite: 1] | $O(k)$[cite: 1] | Lineal en ventas; acumula por ciudad/producto y elige máximo por ciudad[cite: 1]. |
| `productoEstrellaPorCiudad` (sin `Map`) | $\approx O(v \cdot c \cdot p)$[cite: 1] | $O(1)$ *(según filtrado)*[cite: 1] | Alternativa de referencia filtrando por ciudad y contando productos[cite: 1]. |
| `comboRegaloMap(catalogo, valor)` | $O(n)$[cite: 1] | $O(n)$[cite: 1] | Lineal; busca complemento exacto en una pasada usando `Map`[cite: 1]. |
| `comboRegalo` (fuerza bruta) | $O(n^2)$[cite: 1] | $O(1)$[cite: 1] | Cuadrática; evalúa pares de productos del catálogo[cite: 1]. |
| `parMasCercano(catalogo, presupuesto)` (dos punteros) | $O(p \log p)$[cite: 1] | $O(p)$[cite: 1] | Linealítmica; copia + ordenamiento $O(p \log p)$ y dos punteros $O(p)$[cite: 1]. |
| `parMasCercanoBruta(catalogo, presupuesto)` | $O(p^2)$[cite: 1] | $O(1)$[cite: 1] | Cuadrática; evalúa todas las parejas para mayor suma $\le$ presupuesto[cite: 1]. |
| `mejorSemana(dias, k)` (ventana deslizante) | $O(d)$[cite: 1] | $O(1)$[cite: 1] | Lineal en días; suma inicial de $k$ y ajuste de 2 operaciones por avance[cite: 1]. |
| `mejorSemanaBruta(dias, k)` | $O((d - k + 1) \cdot k) \approx O(d \cdot k)$[cite: 1] | $O(1)$[cite: 1] | Hasta cuadrática si $k$ crece con $d$; recalcula cada ventana desde cero[cite: 1]. |