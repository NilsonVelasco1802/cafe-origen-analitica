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
