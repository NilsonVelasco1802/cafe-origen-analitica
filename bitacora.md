# cafeorigen analitica

## Mini Reto uno

## Diccionario de datos

- Propiedad: id
- Tipo: int
- significado: valor unico asosiado a cada venta.

- Propiedad: fecha
- Tipo: date
- significado: fecha de la venta.

- Propiedad: cliente: 
- Tipo: String
- significado: empresa o persona natural que realiza al compra.

- Propiedad: producto
- Tipo: String
- significado: origen mas cantidad de la venta.

- Propiedad: ciudad
- Tipo: String
- significado: origen de la venta.

- Propiedad: cantidad
- Tipo: int
- significado: cantidad de productos comprados

- Propiedad: precio
- Tipo: int
- significado: valor del producto por unidad

## Erroes encontrados en los datos

 -1. cantidad de cliente C06 tiene una venta con cantidad cero
 -2. se encuentra medellin en minuscula con el id: 5
 -3. la fecah esta en formato String 


# Verificación manual mediante tablas de traza

Se realizaron dos verificaciones manuales para comprobar el funcionamiento de las funciones `totalVendido()` y `unidadesVendidas()`.

## Primera verificación: `totalVendido(ventas)`

Se recorrieron los 12 registros de ventas, multiplicando la cantidad por el precio de cada producto. Se excluyó el registro con cantidad cero.

El resultado obtenido manualmente fue de **$985.000**.

## Segunda verificación: `unidadesVendidas("Origen Huila 500 g")`

Se revisaron los 12 registros y se sumaron únicamente las cantidades correspondientes al producto solicitado. Se encontró que las ventas de este producto fueron de 2, 1, 0 y 4 unidades.

El resultado obtenido manualmente fue de **7 unidades**.

## Conclusión

Al ejecutar ambas funciones en JavaScript, los resultados coincidieron con los cálculos realizados manualmente. Por lo tanto, se comprobó que las funciones realizan correctamente las operaciones esperadas con los datos proporcionados.

# Métodos de arreglo y agrupaciones

## 1. totalVendidoM(ventas)

- **¿Qué recorro?** Recorro el arreglo de ventas.
- **¿Qué filtro?** Ventas con precio y cantidad mayores que cero.
- **¿Qué transformo?** Cada registro en su valor total mediante `valorVen()`.
- **¿Qué acumulo?** El dinero generado por todas las ventas válidas.
- **¿Cómo agrupo?** No agrupo, solamente acumulo el total.

Se utilizan los métodos `filter()` y `reduce()`.

## 2. unidadesVendidasM(producto)

- **¿Qué recorro?** Recorro el arreglo global de ventas.
- **¿Qué filtro?** Ventas que coincidan con el producto solicitado y tengan cantidad mayor que cero.
- **¿Qué transformo?** Los registros en cantidades de unidades.
- **¿Qué acumulo?** La cantidad total de unidades vendidas.
- **¿Cómo agrupo?** No agrupo, solamente sumo las unidades del producto solicitado.

Se utilizan los métodos `filter()` y `reduce()`.

## 3. ventasPorCiudadM(ventas, ciudad)

- **¿Qué recorro?** Recorro el arreglo de ventas.
- **¿Qué filtro?** Ventas que pertenezcan a la ciudad indicada y tengan un valor mayor que cero.
- **¿Qué transformo?** Normalizo los nombres de las ciudades utilizando `trim()` y `toLowerCase()`.
- **¿Qué acumulo?** El dinero generado por las ventas de esa ciudad.
- **¿Cómo agrupo?** Selecciono las ventas de una ciudad específica y sumo sus valores.

Se utilizan los métodos `filter()` y `reduce()`.

## 4. totalPorCiudad(ventas)

- **¿Qué recorro?** Recorro todos los registros de ventas.
- **¿Qué filtro?** Excluyo las ventas cuyo valor no sea positivo.
- **¿Qué transformo?** Normalizo los nombres de las ciudades para evitar grupos duplicados por espacios o mayúsculas.
- **¿Qué acumulo?** El dinero generado por cada ciudad.
- **¿Cómo agrupo?** Utilizo el nombre normalizado de la ciudad como clave de un objeto.

Se utiliza el método `reduce()`.

## 5. unidadesPorProducto(ventas)

- **¿Qué recorro?** Recorro todos los registros de ventas.
- **¿Qué filtro?** Considero únicamente cantidades mayores que cero.
- **¿Qué transformo?** Los registros en cantidades de unidades.
- **¿Qué acumulo?** Las unidades vendidas de cada producto.
- **¿Cómo agrupo?** Utilizo el nombre del producto como clave de un objeto.

Se utiliza el método `reduce()`.

## 6. topProductosPorValor(ventas, k)

- **¿Qué recorro?** Recorro todos los registros de ventas.
- **¿Qué filtro?** Considero únicamente ventas con valor positivo.
- **¿Qué transformo?** Calculo el dinero generado por cada producto y creo objetos con el nombre y el total.
- **¿Qué acumulo?** El dinero generado por cada producto.
- **¿Cómo agrupo?** Agrupo los registros por producto, ordeno los resultados de mayor a menor y selecciono los primeros k productos.

Se utilizan los métodos `reduce()`, `map()`, `sort()` y `slice()`.

Se utiliza un nuevo arreglo para ordenar los resultados sin modificar el arreglo original de ventas.

## Conclusión

Se implementaron versiones de las funciones utilizando métodos de arreglo, permitiendo realizar filtros, transformaciones, acumulaciones y agrupaciones de manera más sencilla.

También se realizaron comparaciones entre las funciones originales y las nuevas versiones para comprobar que ambas producen los mismos resultados.


# Bitácora - Errores encontrados y corregidos

## Error 1: Resultado NaN al acumular ventas

**Síntoma:**

La función de total vendido devolvía `NaN` en lugar de un valor numérico.

**Entrada que lo produce:**

Un arreglo con una o más ventas válidas.

**Hipótesis:**

La variable utilizada para acumular el total no tenía un valor inicial.

**Prueba realizada:**

Se reprodujo el problema utilizando un acumulador sin inicializar:

```javascript
let total;

total += 84000;

console.log(total); // NaN
```

**Causa:**

La variable `total` tenía el valor `undefined`, por lo que no era posible realizar correctamente la suma.

**Corrección:**

Se inicializó el acumulador en cero:

```javascript
let total = 0;
```

La función ahora devuelve correctamente el total de las ventas.

---

## Error 2: Resultado NaN al calcular el promedio sin ventas

**Síntoma:**

La función de ticket promedio devolvía `NaN` cuando no existían ventas válidas.

**Entrada que lo produce:**

Un arreglo vacío `[]` o un arreglo sin ventas de valor positivo.

**Hipótesis:**

La función estaba realizando una división entre cero.

**Prueba realizada:**

```javascript
let total = 0;
let contador = 0;

console.log(total / contador); // NaN
```

**Causa:**

No se comprobaba si existían ventas antes de realizar la división.

**Corrección:**

Se agregó una condición para comprobar que el contador fuera mayor que cero:

```javascript
if (contador === 0) {
    return null;
}

return total / contador;
```

De esta manera, cuando no existen ventas válidas, la función devuelve `null` en lugar de `NaN`.

---

## Verificación de errores

Se realizaron pruebas para comprobar que ambos problemas ya no aparecen en las funciones corregidas.

- El acumulador inicia en cero.
- El promedio comprueba que existan ventas antes de dividir.
- Los días sin ventas muestran un total de $0 y un mensaje informativo.



# Bitácora de análisis de operaciones

## 1. Predicción inicial

Antes de realizar las mediciones, considero que las funciones `totalVendido`, `ventaMayor` y `totalPorCiudad` tienen un crecimiento lineal O(n), porque recorren el arreglo de ventas una sola vez.

Mi predicción es que, si multiplicamos por 10 la cantidad de ventas, el número de operaciones de cada función también se multiplicará aproximadamente por 10.

### Predicción por función

| Función | Complejidad esperada | Predicción |
|---|---|---|
| totalVendido | O(n) | Las operaciones se multiplican por 10. |
| ventaMayor | O(n) | Las operaciones y comparaciones se multiplican aproximadamente por 10. |
| totalPorCiudad | O(n) | Las operaciones se multiplican por 10. |

### Justificación

- **totalVendido:** recorre todas las ventas para calcular el valor total. Por cada venta realiza una visita.
- **ventaMayor:** recorre las ventas para encontrar la de mayor valor. Realiza una comparación por cada elemento después del primero.
- **totalPorCiudad:** recorre todas las ventas para acumular el dinero vendido en cada ciudad. Realiza una visita por cada venta.

### Ejemplo de mi predicción

Si comenzamos con 100 ventas y después aumentamos a 1.000 ventas, espero obtener:

| Función | 100 ventas | 1.000 ventas |
|---|---:|---:|
| totalVendido | 100 operaciones | 1.000 operaciones |
| ventaMayor | 99 operaciones | 999 operaciones |
| totalPorCiudad | 100 operaciones | 1.000 operaciones |

### Conclusión inicial

Mi hipótesis es que las tres funciones presentan complejidad temporal lineal O(n). Espero comprobarlo mediante el contador de operaciones, observando cómo aumenta el trabajo cuando crece la cantidad de ventas.

Esta es una predicción inicial y deberá compararse con los resultados reales de las mediciones.



## 2. Comparación entre complejidad constante y lineal

Se agregó la función `primeraVenta(ventas)`, cuya finalidad es devolver la primera venta del arreglo.

Esta función tiene complejidad constante O(1), porque solamente accede a una posición específica del arreglo y realiza siempre una cantidad fija de operaciones.

### Resultados esperados

| n | primeraVenta | Funciones lineales |
|---:|---:|---:|
| 100 | 1 | Aproximadamente 100 |
| 1.000 | 1 | Aproximadamente 1.000 |
| 10.000 | 1 | Aproximadamente 10.000 |
| 100.000 | 1 | Aproximadamente 100.000 |

### Análisis

La función `primeraVenta` mantiene el mismo número de operaciones aunque aumente la cantidad de ventas.

En cambio, `totalVendido`, `ventaMayor` y `totalPorCiudad` aumentan sus operaciones proporcionalmente al tamaño del arreglo.

### Conclusión

La complejidad constante O(1) realiza un trabajo que no depende del tamaño de los datos.

La complejidad lineal O(n) aumenta su trabajo conforme aumenta la cantidad de elementos.

Por lo tanto, para grandes cantidades de datos, una función O(1) necesita muchas menos operaciones que una función O(n).



## 3. Comparación de predicciones con resultados

Después de ejecutar las mediciones con 100, 1.000, 10.000 y 100.000 ventas, comparé los resultados con mis predicciones iniciales.

### Clasificación de las funciones

| Función | Complejidad | Justificación |
|---|---|---|
| totalVendido | O(n) | Recorre todas las ventas una vez. |
| ventaMayor | O(n) | Recorre las ventas y compara sus valores. |
| totalPorCiudad | O(n) | Recorre todas las ventas y acumula sus valores por ciudad. |
| primeraVenta | O(1) | Accede directamente a la primera posición del arreglo. |

### Comparación de resultados

Los resultados demostraron que las funciones lineales aumentan sus operaciones proporcionalmente al tamaño de los datos.

Por ejemplo, al pasar de 100 a 100.000 ventas, totalVendido y totalPorCiudad pasan de 100 a 100.000 operaciones.

En ventaMayor se pasa de 99 a 99.999 operaciones, porque el primer elemento se utiliza como referencia inicial.

Por otro lado, primeraVenta mantiene una sola operación independientemente de la cantidad de ventas.

### Análisis de complejidad cuadrática O(n²)

Ninguna de las funciones analizadas presenta complejidad O(n²), porque no utilizan ciclos anidados que recorran repetidamente el arreglo completo.

### Conclusión final

Mis predicciones iniciales se cumplieron con los resultados obtenidos.

Identifiqué una función de complejidad constante O(1) y tres funciones de complejidad lineal O(n).

Este ejercicio me permitió comprobar que el crecimiento de los datos influye directamente en el trabajo que realizan las funciones y que una función constante mantiene su cantidad de operaciones aunque aumente el tamaño del historial de ventas.


# Traza de `clientesRecurrentes`

## Objetivo

Seguir la ejecución de la función `clientesRecurrentes` con un arreglo
de 5 ventas, contar las comparaciones entre clientes y generalizar el
número de comparaciones para `n` ventas.

## Datos de prueba

``` javascript
const ventas = [
  { id: 1, cliente: "C01" },
  { id: 2, cliente: "C02" },
  { id: 3, cliente: "C01" },
  { id: 4, cliente: "C03" },
  { id: 5, cliente: "C02" }
];
```

## Traza de las comparaciones

El ciclo externo selecciona una venta con `i`. El ciclo interno comienza
en `j = i + 1`, así que compara esa venta solamente con las ventas que
aparecen después.

    `i`   `j` Comparación   ¿Coinciden?
  ----- ----- ------------- -------------
      0     1 C01 == C02    No
      0     2 C01 == C01    Sí
      0     3 C01 == C03    No
      0     4 C01 == C02    No
      1     2 C02 == C01    No
      1     3 C02 == C03    No
      1     4 C02 == C02    Sí
      2     3 C01 == C03    No
      2     4 C01 == C02    No
      3     4 C03 == C02    No

**Total: 10 comparaciones** de igualdad entre clientes.

En este ejemplo, los clientes recurrentes que se encuentran son `C01` y
`C02`. La lista de clientes recurrentes no cambia el número de
comparaciones que realizan los dos ciclos; la condición `includes()` sí
hace comprobaciones adicionales para evitar agregar un cliente más de
una vez, pero no se cuentan como comparaciones entre ventas.

## Generalización para `n` ventas

Con `n` ventas, el número de comparaciones es:

-   Para la primera venta: `n - 1`
-   Para la segunda venta: `n - 2`
-   Para la tercera venta: `n - 3`
-   ...
-   Para la penúltima venta: `1`
-   Para la última venta: `0`

Por tanto:

\[ C(n) = (n-1) + (n-2) + `\cdots `{=tex}+ 2 + 1 \]

La suma de los primeros `n - 1` números naturales es:

\[ C(n) = `\frac{n(n-1)}{2}`{=tex} \]

Para `n = 5`:

\[ C(5) = `\frac{5(5-1)}{2}`{=tex} = `\frac{20}{2}`{=tex} = 10 \]

## Conclusión

La función realiza:

\[ `\boxed{\frac{n(n-1)}{2}}`{=tex} \]

comparaciones de igualdad entre clientes. Esto crece de forma
cuadrática, por lo que su complejidad temporal se expresa como
**O(n²)**. Cuando se duplica la cantidad de ventas, el número de
comparaciones aumenta aproximadamente cuatro veces para volúmenes
grandes.


## Análisis de los tiempos de ejecución

Se realizaron pruebas con diferentes cantidades de ventas utilizando `console.time()` y `console.timeEnd()` para medir el tiempo que tarda la función `clientesRecurrentes()`.

### Tabla de resultados

| Número de ventas (n) | Tiempo de ejecución | Aumento respecto a la prueba anterior |
|---:|---:|---:|
| 1.000 | 5,088 ms | — |
| 2.000 | 10,1 ms | 1,98 veces |
| 4.000 | 44,013 ms | 4,36 veces |
| 8.000 | 171,39 ms | 3,89 veces |
| 16.000 | 587,927 ms | 3,43 veces |

### Análisis

Al analizar los resultados, se observa que cuando se duplica la cantidad de ventas, el tiempo de ejecución aumenta aproximadamente cuatro veces, especialmente en los volúmenes más grandes.

Esto sucede porque la función tiene dos ciclos anidados que comparan los clientes de las ventas. Por lo tanto, al aumentar los registros, también aumenta considerablemente el número de comparaciones.

Por ejemplo:

- 1.000 ventas: 499.500 comparaciones.
- 2.000 ventas: 1.999.000 comparaciones.
- 4.000 ventas: 7.998.000 comparaciones.
- 8.000 ventas: 31.996.000 comparaciones.
- 16.000 ventas: 127.992.000 comparaciones.

### Relación con la complejidad O(n²)

La función tiene una complejidad temporal O(n²), porque el número de comparaciones crece de forma cuadrática respecto a la cantidad de ventas.

Cuando duplicamos la cantidad de registros, las comparaciones se multiplican aproximadamente por cuatro.

### Conclusión

Los resultados demuestran que la función funciona correctamente con pocos registros, pero su rendimiento disminuye cuando aumenta el volumen de información.

Esto explica por qué la gerente experimentó demoras al ejecutar el reporte con el historial anual. Es necesario optimizar la función para reducir las comparaciones y mejorar el tiempo de ejecución cuando se procesan grandes cantidades de ventas.
## Costo oculto: método `recurrentes.includes()`

Al analizar la función `clientesRecurrentes()`, encontramos un costo oculto en la siguiente instrucción:

```javascript
!recurrentes.includes(ventas[i].cliente)
```

El método `includes()` busca si un cliente ya existe dentro del arreglo `recurrentes`. Para hacerlo, debe recorrer sus elementos hasta encontrarlo o llegar al final.

### ¿Cómo afecta la complejidad?

En el peor caso, cuando existen muchos clientes recurrentes, el arreglo `recurrentes` puede crecer hasta tener una gran cantidad de elementos.

Esto significa que cada vez que se ejecuta `includes()`, puede necesitar recorrer una gran parte del arreglo.

Por lo tanto, no solamente tenemos los dos ciclos anidados, sino también una búsqueda adicional dentro de otro arreglo.

Si hay `n` ventas y muchos clientes recurrentes, el costo acumulado de las búsquedas con `includes()` puede llegar a ser O(n²).

Sumado al costo de los ciclos anidados, el peor caso sigue siendo de complejidad O(n²), aunque aumenta considerablemente la cantidad de operaciones realizadas.

### Resultados de las pruebas

| Número de ventas | Tiempo de ejecución |
|---:|---:|
| 100.000 | 32,085 segundos |
| 1.000.000 | 55 minutos y 0,914 segundos |

Los resultados muestran que el tiempo aumenta considerablemente cuando crece el volumen de información.

### Conclusión

El método `includes()` representa un costo oculto porque realiza búsquedas lineales dentro del arreglo de clientes recurrentes.

Aunque la complejidad general de la función continúa siendo O(n²), estas búsquedas adicionales aumentan el tiempo real de ejecución.

Una posible solución es utilizar un `Set` de JavaScript, porque permite consultar si un cliente ya existe con un costo promedio de O(1). Esto ayudaría a reducir el costo de las búsquedas y mejorar el rendimiento del reporte.

## Conclusión para la gerente

El reporte de clientes recurrentes se vuelve lento porque, a medida que aumenta la cantidad de ventas, el sistema necesita realizar muchas más comparaciones para identificar qué clientes han comprado varias veces.

En las pruebas realizadas, con 100.000 ventas el reporte tardó aproximadamente 32 segundos, mientras que con 1.000.000 de ventas tardó cerca de 55 minutos.

Esto significa que el sistema funciona bien con cantidades pequeñas de información, pero pierde velocidad cuando debe procesar grandes historiales de ventas.

Por esta razón, recomendamos optimizar el funcionamiento del reporte para que pueda analizar la información de manera más rápida y entregar resultados oportunos, incluso cuando la empresa tenga millones de registros.


# Bitácora: cadena de métodos vs. una sola pasada

## Resultado de la ejecución

Ambas funciones calculan el mismo total: **486.818.000**. Además, la comparación devuelve `true`, así que las dos versiones producen el mismo resultado.

## 1. Comparación de recorridos, arreglos y complejidad

### Versión con métodos encadenados

Utiliza `map()`, `filter()`, otro `map()` y `reduce()`.

- **Recorridos:** realiza 4 recorridos sobre los datos. Cada método recorre el arreglo que recibe; el segundo `map()` y el `reduce()` trabajan con los elementos que quedaron después del filtro.
- **Arreglos nuevos:** crea 3 arreglos:
  1. El primer `map()` crea un arreglo con las ventas y sus ciudades normalizadas.
  2. El `filter()` crea otro arreglo con las ventas de la ciudad seleccionada.
  3. El segundo `map()` crea un arreglo con los valores de las ventas.
- `reduce()` suma los valores, pero no crea otro arreglo.

**Complejidad:**

- **Tiempo:** O(n), porque realiza una cantidad constante de recorridos lineales.
- **Espacio:** O(n), porque crea arreglos adicionales cuyo tamaño puede crecer según la cantidad de ventas.

### Versión con una sola pasada

Utiliza un ciclo `for` para revisar las ventas y acumular el total de la ciudad solicitada.

- **Recorridos:** realiza 1 recorrido completo de las ventas.
- **Arreglos nuevos:** crea 0 arreglos adicionales.
- Solo utiliza variables para guardar la ciudad buscada y acumular el total.

**Complejidad:**

- **Tiempo:** O(n), porque revisa cada venta una sola vez.
- **Espacio:** O(1), porque utiliza una cantidad constante de memoria adicional, sin importar cuántas ventas existan.

## 2. Tabla comparativa

| Característica       | Con cadena | Una pasada  |
| -------------------- | ---------- | ----------- |
| Recorridos           | 4 etapas   | 1           |
| Arreglos nuevos      | 3          | 0           |
| Complejidad temporal | O(n)       | O(n)        |
| Complejidad espacial | O(n)       | O(1)        |
| Resultado            | 486.818.000 | 486.818.000 |

## 3. Por qué ambas son O(n) aunque una recorra cuatro veces

Cuatro recorridos parecen más trabajo que uno, y en operaciones reales lo son. Pero la notación O mide **cómo crece** el trabajo cuando crecen los datos, no cuántas operaciones exactas se hacen. Para eso se aplican dos reglas de simplificación.

### Paso 1: contar el trabajo de cada versión

Con `n` ventas, y `m` las ventas que sobreviven al filtro (`m ≤ n`):

| Etapa de la cadena | Elementos que recorre |
| ------------------ | --------------------- |
| `map()` (normalizar ciudad) | n |
| `filter()` | n |
| `map()` (extraer valores) | m |
| `reduce()` | m |

- **Cadena:** T(n) = n + n + m + m ≤ 4n
- **Una pasada:** T(n) = n

### Paso 2: aplicar las reglas

1. **Regla de la suma:** los recorridos que se ejecutan uno después de otro se suman (n + n + m + m), y de la suma se conserva el término dominante. Aquí todos los términos crecen linealmente, así que el resultado sigue siendo lineal.
2. **Regla de las constantes:** se eliminan los factores multiplicativos, porque no cambian la forma de la curva. Entonces O(4n) = O(n).

Formalmente, f(n) = O(g(n)) si existen una constante `c` y un tamaño `n₀` tales que f(n) ≤ c · g(n) para todo n ≥ n₀. En la cadena, f(n) ≤ 4n, así que basta tomar c = 4 y g(n) = n. Por eso la cadena es O(n), igual que la versión de una pasada (donde c = 1).

### Paso 3: qué dice y qué no dice esto

Que ambas sean O(n) **no significa que hagan exactamente el mismo trabajo**. Significa que el crecimiento tiene la misma forma: al multiplicar los datos por 10, el trabajo de ambas se multiplica por 10.

| Tamaño n | Operaciones cadena (≈ 4n) | Operaciones una pasada (≈ n) | Razón |
| -------- | ------------------------- | ---------------------------- | ----- |
| 1.000    | 4.000                     | 1.000                        | 4     |
| 10.000   | 40.000                    | 10.000                       | 4     |
| 100.000  | 400.000                   | 100.000                      | 4     |

La razón entre las dos versiones se mantiene en 4 sin importar el tamaño: la constante cambia el costo, pero no el crecimiento. En cambio, un recorrido **anidado** (un ciclo dentro de otro) haría n · n operaciones, y ahí sí cambiaría la forma de la curva a O(n²), algo que ninguna constante puede absorber.

## 4. Conclusión para la bitácora

La versión con métodos encadenados y la versión de una sola pasada producen el mismo resultado, como demuestra la comparación que devuelve `true`. Sin embargo, la versión encadenada crea tres arreglos adicionales y necesita más memoria para procesar la información. La versión de una sola pasada recorre las ventas una única vez y no crea arreglos adicionales.

Por lo tanto, la versión de una sola pasada es más eficiente en el uso de memoria, ya que tiene complejidad espacial O(1), mientras que la versión encadenada tiene O(n). Ambas tienen complejidad temporal O(n), pero la versión de una sola pasada también evita recorridos y operaciones intermedias innecesarias.

# Complejidad espacial del motor de ventas

Bitácora · clasificación de memoria adicional: O(1), O(k) y O(n)

## Alcance de este análisis

Solo se revisaron las dos versiones de `totalCiudad`, así que esas se clasifican con certeza. De `totalPorCiudad` y `topProductosPorValor` no se tiene el código, y su clasificación depende de cómo estén escritas. Más abajo queda el criterio para verificarlas.

## Las dos funciones revisadas

| Función | Espacio adicional | Por qué |
| --- | --- | --- |
| `totalCiudadCadena` | **O(n)** | El primer `map()` crea un arreglo nuevo con n objetos, y cada uno es una copia de la venta (`...venta`). El `filter()` crea otro arreglo de hasta n elementos y el segundo `map()` uno de m números. |
| `totalCiudadUnaPasada` | **O(1)** | Solo guarda `total`, `ciudadBuscada`, `i` y `ciudadVenta`. |

Una precisión sobre la versión de una pasada: `toLowerCase().trim()` crea un string temporal en cada vuelta. Ese string mide lo que mide el nombre de la ciudad, no depende de n, y se descarta en la siguiente iteración. Por eso sigue siendo O(1) respecto a los datos.

## Las dos funciones por revisar

### `totalPorCiudad`

Normalmente devuelve un objeto o `Map` con un total por ciudad. Su memoria no es proporcional a las ventas sino a las **ciudades distintas** (k):

- Si solo acumula totales, el espacio es **O(k)**. Con el generador k = 4 y no crece con n, así que en la práctica se comporta como constante.
- Formalmente k ≤ n, así que O(k) solo equivale a O(1) si el número de ciudades está acotado. Con datos sucios (`"medellín"` y `"Medellín"` como claves distintas) k crece sin que haya más ciudades reales.
- Si en cambio agrupa las ventas por ciudad (guarda listas de ventas) para sumar después, es **O(n)**.

### `topProductosPorValor`

Normalmente acumula el valor por producto, ordena y toma los primeros k. Hay que mirar cada paso:

- El acumulador (`Map` producto → valor) ocupa **O(p)**, con p productos distintos. En el catálogo actual p = 5.
- Convertirlo con `Array.from` y ordenarlo usa otro O(p). Ojo con que `sort()` no garantiza O(1) de memoria extra, así que cuenta como O(p).
- El `slice(0, k)` del resultado agrega O(k).
- Si en cambio ordena una copia de las ventas (`[...ventas].sort(...)`), el espacio es **O(n)**.

## Cómo clasificar el resto del motor

1. Si solo hay acumuladores escalares (sumas, contadores, máximos), es **O(1)**.
2. Si hay un `Map` u objeto indexado por una clave, es **O(k)**, con k las claves distintas. Hay que aclarar si k está acotado (ciudades, productos) o crece con n (clientes, ids, fechas).
3. Si se crea un arreglo del tamaño de las ventas (`map`, `filter`, `[...ventas]`, `sort` sobre una copia), es **O(n)**.

## Pendiente

Pasar el código de `totalPorCiudad`, `topProductosPorValor` y las demás funciones del motor para completar la clasificación.

# Decisión: versión de `totalCiudad` en el motor

## Decisión

Se deja **`totalCiudadUnaPasada`** en el motor. La versión con cadena (`totalCiudadCadena`) se conserva solo en las pruebas, como referencia para verificar resultados.

## Legibilidad

La cadena es más declarativa. Se lee como una receta: normalizar, filtrar, calcular el valor, sumar. Cada etapa hace una sola cosa, y eso ayuda a quien la lee por primera vez.

Pero la versión de una pasada no es mucho más difícil. Son unas 8 líneas, con un acumulador y un `if`, y cualquier persona que sepa JavaScript la entiende de un vistazo. La ventaja de legibilidad de la cadena existe, pero aquí es pequeña.

## Recursos

| Criterio | Cadena | Una pasada |
| --- | --- | --- |
| Operaciones (n ventas) | ≈ 4n | ≈ n |
| Tiempo | O(n) | O(n) |
| Espacio adicional | O(n) | O(1) |
| Arreglos nuevos | 3 | 0 |

Aunque las dos son O(n) en tiempo, el trabajo real de la cadena se multiplica por unas 4 veces. En memoria la diferencia es de crecimiento, no de constante: para 100.000 ventas, la cadena crea 100.000 objetos copiados con `...venta` solo para cambiar el nombre de la ciudad, además de dos arreglos más. Esos objetos aumentan la presión sobre el recolector de basura.

## Por qué gana la una pasada

El motor está pensado para crecer, y la premisa del equipo es medir cuánto crece el trabajo, no suponer que es rápido. Cuando una versión es casi tan legible y claramente más barata, la decisión es fácil. Con 12 ventas daría igual, pero con historiales grandes la cadena paga memoria y operaciones por una claridad que casi no aporta.

La cadena habría ganado si la función fuera mucho más compleja, con muchas etapas y condiciones, porque ahí una cadena bien nombrada se mantiene mejor que un ciclo largo. No es el caso.

## Ajustes recomendados

1. **Extraer la normalización** a una función pequeña, por ejemplo `normalizar(texto)`, para que no se repita `toLowerCase().trim()` y la intención quede explícita. Así se recupera parte de la legibilidad de la cadena sin pagar su costo.
2. **Guardar la cadena en las pruebas** como "oráculo": una implementación simple y obvia para comprobar que la versión optimizada devuelve lo mismo. La comparación que devolvió `true` ya cumple ese papel.

# Bitácora — Informe de rendimiento (`RENDIMIENTO.md`)


## Entrada 1 — Revisión por pares

- **Fecha:** 22 de noviembre de 2026
- **Documento revisado:** `RENDIMIENTO.md` (tabla de rendimiento, evidencia de escalamiento, priorización, proyección, riesgos y plan de optimización)
- **Revisor:** compañero de equipo (simulado)

### Observaciones del revisor

| # | Observación | Severidad |
|---|---|---|
| O1 | En "Proyección", la columna "Rango proyectado" parece un intervalo de confianza, pero el valor medido con 1.000.000 de ventas queda **fuera** del rango en la mayoría de funciones. Un lector del marketplace podría confiar en un rango que no cumple. | Alta |
| O2 | El puesto #1 de "Riesgos" y todo el "Plan de optimización" tratan una función (`clientesRecurrentes`) que **no está en el código entregado**. Se aclara al final de la sección, pero un lector que solo mire la tabla puede creer que el defecto está en el motor. | Media |
| O3 | Todos los tiempos son la mediana de una sola máquina y una sola serie de ejecuciones; no se muestra la dispersión (mínimo, máximo o percentiles). Con las irregularidades vistas a 100.000–400.000 ventas, no se sabe cuánta confianza dar a cada número. | Media |
| O4 | `ticketPromedio` aparece en el puesto #14 con nivel "Bajo", aunque es la única función con un error de resultado. El ranking puede dar la impresión de que es la menos importante. | Baja |

### Respuestas de la autora

**O1 — Aceptada y corregida.** Revisé la tabla contra las mediciones: el valor medido cayó dentro del rango en 5 de 13 funciones (`ventasDelDia`, `unidadesPorProducto`, `topProductosPorValor`, `ventasPorCiudad`, `totalPorCiudad`); en 7 quedó por encima (`totalVendido`, `ventaMayor`, `ticketPromedio`, `unidadesVendidas`, `unidadesVendidasM`, `totalVendidoM`, `clientesRecurrentes`) y en 1 por debajo (`ventasPorCiudadM`). El rango solo comparaba dos bases de extrapolación (10.000 y 40.000), así que el nombre era engañoso.
*Cambios:* la columna ahora se llama "Rango de extrapolación"; el método aclara que no es un intervalo de confianza; y se agregó una línea en "Cómo leer la tabla" con el 5 de 13 y la indicación de usar la columna "medido" para planificar.

**O2 — Aceptada parcialmente.** Tiene razón en que el aviso estaba escondido al final. No quité las filas porque la función es un requisito del enunciado y el contraste O(n²) frente a `Map` es evidencia útil. *Cambios:* las filas 1 y 2 llevan ⚠️ y la leyenda "referencia; no está en el archivo entregado", y antes de la tabla agregué un párrafo de alcance que dice que, entre las funciones realmente entregadas, la de mayor riesgo es `totalVendidoM`. Queda pendiente confirmar con el código real de clientes recurrentes y remedirlo.

**O3 — Aceptada, pendiente.** Es una limitación real y no la corregí en esta revisión. Propuesta: repetir las mediciones con 1.000.000 de ventas al menos 30 veces, en dos ejecuciones separadas del proceso, y reportar mediana, mínimo y percentil 95; luego comprobar si alguna conclusión de "Riesgos" cambia de orden. Hasta entonces, el informe ya advierte que los tiempos dependen de la máquina y que lo importante es el orden de magnitud.

**O4 — Respondida sin cambios.** Mantengo la posición. La sección "Riesgos" ordena por **escalamiento de los datos** (tiempo, memoria, uso repetido), y el error de `ticketPromedio` no empeora al crecer los datos. Su gravedad ya está tratada como **prioridad 1** en "Priorización", y la fila #14 dice "Bajo (escala)" y remite a esa sección. Si el revisor prefiere que se vea en ambos lugares, puedo añadir una columna "riesgo funcional" separada, pero mezclarlo en un solo orden haría que el criterio dejara de ser consistente.

### Estado de las observaciones

| # | Estado | Cambio en `RENDIMIENTO.md` |
|---|---|---|
| O1 | Resuelta | Columna renombrada, aclaración del método y nota de lectura |
| O2 | Resuelta parcialmente | ⚠️ en filas 1–2 y párrafo "Alcance del ranking"; falta remedir con el código real |
| O3 | Pendiente | Ninguno todavía |
| O4 | Rechazada con justificación | Ninguno |