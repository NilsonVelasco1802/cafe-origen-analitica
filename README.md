# Café Origen — Motor de Analítica de Ventas

Motor de análisis de datos desarrollado en JavaScript (Node.js) para **Café Origen**. Procesa registros históricos y sintéticos de ventas para responder preguntas clave del negocio sobre ingresos, comportamiento de clientes, desempeño por ciudad, optimización de combos y ventanas temporales de mayor demanda.

---

## Características y preguntas que responde

El reporte de analítica (`src/reporte.js`) responde de forma automatizada las siguientes preguntas de negocio:

1. **Resumen general:** ¿Cuántos registros hay, cuántas ventas son válidas (con cantidad y precio positivos), cuál es el ingreso total y cuál es el ticket promedio?
2. **Ventas por ciudad:** ¿Cuánto dinero genera cada ciudad (`Medellín`, `Bogotá`, `Cali`, `Pereira`), normalizando inconsistencias de mayúsculas o espacios?
3. **Unidades por producto:** ¿Cuántas unidades físicas se vendieron de cada referencia del catálogo?
4. **Top 3 productos por valor:** ¿Cuáles son los 3 productos que generan mayor facturación total?
5. **Resumen diario:** ¿Cuál fue el volumen de registros y el total vendido en una fecha específica, diferenciando días con ventas de días sin actividad?
6. **Clientes recurrentes:** ¿Cuántos y qué porcentaje de los clientes han realizado más de una compra?
7. **Producto estrella por ciudad:** ¿Cuál es el producto más comprado (por frecuencia de transacciones) en cada ciudad?
8. **Combo de regalo (suma exacta):** Dado el monto de una tarjeta de regalo (ej. `$ 87.000`), ¿qué par de productos del catálogo suman exactamente ese valor?
9. **Cliente para cupón de regreso:** ¿Quién fue el primer cliente registrado con una única compra para incentivarlo a volver?
10. **Mejor semana de ventas:** ¿Cuál es el bloque de 7 días consecutivos con mayor facturación total?
11. **Par más cercano al presupuesto:** Dado un presupuesto máximo (ej. `$ 100.000`), ¿qué par de productos maximiza el gasto sin exceder el límite?

---

## Requisitos y cómo ejecutarlo

### Requisitos previos
- **Node.js** (v16 o superior recomendado). No requiere instalación de dependencias externas.

### Ejecución del reporte principal

1. **Con los datos reales del Día 1 (12 registros base):**
   ```bash
   node src/reporte.js
   ```

2. **Con generación sintética de datos a escala** (pasando la cantidad de ventas como argumento):
   ```bash
   # Ejemplo con 10.000 ventas
   node src/reporte.js 10000

   # Ejemplo con 100.000 ventas
   node src/reporte.js 100000
   ```

### Scripts adicionales de prueba y medición
```bash
# Exploración inicial y verificación de cálculos base
node src/explorar.js
node src/verificar.js

# Pruebas de complejidad y medición de tiempos
node src/complejidadTotales.js
node src/medir.js
```

---

## Estructura del proyecto

```text
cafe-origen-analitica/
├── index.html                  # Punto de entrada web básico
├── package.json                # Configuración y metadatos del proyecto
├── README.md                   # Documentación del producto y guía de uso
├── RENDIMIENTO.md              # Informe de benchmarks, complejidad Big-O y optimizaciones
├── bitacora.md                 # Diario técnico de desarrollo, trazas, errores y decisiones
└── src/
    ├── datos.js                # Dataset base del Día 1 (12 registros con casos borde)
    ├── catalogo.js             # Catálogo oficial de productos y precios unitarios
    ├── generador.js            # Generador de ventas sintéticas para pruebas de escala
    ├── analitica.js            # Funciones base del motor de analítica (v0.1)
    ├── optimizadas.js          # Implementaciones optimizadas (Map, Set, ventana deslizante, dos punteros)
    ├── recurrente.js           # Implementación y análisis de detección de clientes recurrentes
    ├── complejidadTotales.js   # Conteo de operaciones para análisis $O(1)$ vs. $O(n)$
    ├── medir.js                # Utilidad de benchmarking y medición de tiempos de ejecución
    ├── explorar.js             # Script de inspección inicial de datos
    ├── verificar.js            # Pruebas de consistencia entre versiones base y optimizadas
    └── reporte.js              # Orquestador principal que ejecuta pruebas y emite el reporte en consola
```

---

## Rendimiento y optimización

El motor evolucionó desde implementaciones iniciales con recorridos múltiples y búsquedas cuadráticas $O(n^2)$ hacia estructuras hash (`Map` y `Set`), recorridos de una sola pasada $O(n)$, ventana deslizante y dos punteros. Esto permite procesar **100.000 ventas en ~220–255 ms**. Para ver el detalle de tiempos por sección y análisis asintótico, consulta [`RENDIMIENTO.md`](./RENDIMIENTO.md).