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