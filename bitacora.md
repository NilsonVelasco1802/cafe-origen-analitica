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
