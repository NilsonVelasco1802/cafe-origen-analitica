
# Café Origen - Analítica de Ventas

## Descripción del proyecto

Café Origen - Analítica de Ventas es un proyecto desarrollado en JavaScript para analizar información de ventas de una cafetería.

El sistema permite calcular indicadores comerciales, agrupar información por ciudad y producto, identificar los productos que generan mayores ingresos y generar reportes generales y diarios.

Se utilizan ciclos y métodos de arreglos como `filter()`, `reduce()`, `map()`, `sort()` y `slice()` para procesar los datos.

## Estructura del proyecto

```text
cafe-origen-analitica/
│
├── analitica.js
├── README.md
├── bitacora.md
│
└── src/
    ├── verificar.js
    └── reporte.js
```

## Requisitos

- Node.js instalado.
- Visual Studio Code o cualquier editor de código.
- Terminal para ejecutar los archivos JavaScript.

## Cómo ejecutar el proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd cafe-origen-analitica
```

Ejecutar las verificaciones:

```bash
node src/verificar.js
```

Generar el reporte:

```bash
node src/reporte.js
```

## Funcionalidades

El proyecto permite:

- Calcular el total vendido.
- Calcular las unidades vendidas por producto.
- Identificar la venta de mayor valor.
- Calcular el ticket promedio.
- Consultar las ventas por ciudad.
- Agrupar los ingresos por ciudad.
- Agrupar las unidades por producto.
- Identificar los productos que generan mayores ingresos.
- Consultar las ventas correspondientes a una fecha.
- Generar un reporte general de ventas.

## Preguntas que responde el proyecto

1. ¿Cuánto dinero se ha vendido en total?
2. ¿Cuántas unidades se han vendido de cada producto?
3. ¿Cuál ha sido la venta de mayor valor?
4. ¿Cuál es el ticket promedio?
5. ¿Qué ciudad genera mayores ingresos?
6. ¿Cuánto dinero se ha vendido en cada ciudad?
7. ¿Qué productos generan mayores ingresos?
8. ¿Cuáles son los tres productos con mayor valor vendido?
9. ¿Cuánto se vendió en una fecha determinada?
10. ¿Qué sucede cuando no existen ventas para una fecha?

## Formato de valores

Los valores monetarios se muestran en pesos colombianos utilizando:

```javascript
toLocaleString("es-CO")
```

Los nombres de las ciudades se normalizan para evitar grupos duplicados por diferencias de mayúsculas y espacios al inicio o al final.

## Tecnologías utilizadas

- JavaScript
- Node.js
- Git
- GitHub

## Versión

v0.1 - Generación de reportes y análisis de ventas.
