const { performance } = require("node:perf_hooks");

const {
    ventas: ventasDia1,
    totalVendido,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia
} = require("./analitica.js");

const { generarVentas } = require("./generador.js");
const catalogo = require("./catalogo.js");

const {
    clientesRecurrentesSet,
    productoEstrellaPorCiudad,
    primerClienteUnico,
    comboRegaloMap,
    ventasDiarias,
    mejorSemana
} = require("./optimizadas.js");

const VALOR_TARJETA = 87000;
const DIAS_SEMANA = 7;
const MS_DIA = 86400000;

// ==========================================
// FORMATO DE VALORES
// ==========================================

function formatoPesos(valor) {
    if (!Number.isFinite(valor)) {
        return "$0";
    }

    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

function formatoNumero(valor) {
    return Number(valor || 0).toLocaleString("es-CO");
}

function capitalizar(texto) {
    const t = String(texto).trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
}

// ==========================================
// ENCABEZADO Y MEDICIÓN DE TIEMPOS
// ==========================================

function titulo(seccion) {
    console.log("\n");
    console.log("=".repeat(65));
    console.log(`  ${seccion}`);
    console.log("=".repeat(65));
}

const tiempos = [];

function medir(nombre, fn) {
    const t0 = performance.now();
    fn();
    tiempos.push({ nombre, ms: performance.now() - t0 });
}

// ==========================================
// 1. RESUMEN GENERAL
// ==========================================

function resumenGeneral(ventas) {
    titulo("RESUMEN GENERAL");

    const total = totalVendido(ventas);

    const ventasValidas = ventas.filter(
        venta => venta.precio > 0 && venta.cantidad > 0
    );

    const promedio = ventasValidas.length > 0
        ? total / ventasValidas.length
        : 0;

    console.log(`  Total de registros:       ${formatoNumero(ventas.length)}`);
    console.log(`  Ventas válidas:           ${formatoNumero(ventasValidas.length)}`);
    console.log(`  Total vendido:            ${formatoPesos(total)}`);
    console.log(`  Ticket promedio:          ${formatoPesos(promedio)}`);
}

// ==========================================
// 2. VENTAS POR CIUDAD
// ==========================================

function reporteCiudades(ventas) {
    titulo("VENTAS POR CIUDAD");

    const ciudades = totalPorCiudad(ventas);

    console.log(`  ${"CIUDAD".padEnd(30)} ${"TOTAL VENDIDO".padStart(25)}`);
    console.log("  " + "-".repeat(55));

    for (const [ciudad, total] of Object.entries(ciudades)) {
        const nombre = ciudad.charAt(0).toUpperCase() + ciudad.slice(1);

        console.log(
            `  ${nombre.padEnd(30)} ${formatoPesos(total).padStart(25)}`
        );
    }
}

// ==========================================
// 3. UNIDADES POR PRODUCTO
// ==========================================

function reporteProductos(ventas) {
    titulo("UNIDADES VENDIDAS POR PRODUCTO");

    const productos = unidadesPorProducto(ventas);

    console.log(`  ${"PRODUCTO".padEnd(40)} ${"UNIDADES".padStart(12)}`);
    console.log("  " + "-".repeat(53));

    for (const [producto, unidades] of Object.entries(productos)) {
        console.log(
            `  ${producto.padEnd(40)} ${formatoNumero(unidades).padStart(12)}`
        );
    }
}

// ==========================================
// 4. TOP 3 PRODUCTOS POR VALOR
// ==========================================

function reporteTopProductos(ventas) {
    titulo("TOP 3 PRODUCTOS POR VALOR");

    const top = topProductosPorValor(ventas, 3);

    console.log(
        `  ${"POS.".padEnd(6)} ${"PRODUCTO".padEnd(35)} ${"TOTAL".padStart(20)}`
    );

    console.log("  " + "-".repeat(63));

    if (top.length === 0) {
        console.log("  No hay productos para mostrar.");
        return;
    }

    top.forEach((producto, indice) => {
        console.log(
            `  ${String(indice + 1).padEnd(6)} ${producto.producto.padEnd(35)} ${formatoPesos(producto.total).padStart(20)}`
        );
    });
}

// ==========================================
// 5. RESUMEN DE VENTAS POR DÍA
// ==========================================

function reporteDiario(ventas, fecha) {
    titulo(`RESUMEN DEL DÍA: ${fecha}`);

    const ventasDia = ventasDelDia(ventas, fecha);
    const total = totalVendido(ventasDia);

    console.log(`  Fecha:                    ${fecha}`);
    console.log(`  Cantidad de registros:    ${formatoNumero(ventasDia.length)}`);

    if (ventasDia.length === 0) {
        console.log("  Estado:                   Sin ventas registradas");
        console.log(`  Total vendido:            ${formatoPesos(0)}`);
        return;
    }

    console.log("  Estado:                   Con ventas");
    console.log(`  Total vendido:            ${formatoPesos(total)}`);
}

// ==========================================
// 6. CLIENTES RECURRENTES (Set, O(n))
// ==========================================

function reporteRecurrentes(ventas) {
    titulo("CLIENTES RECURRENTES (más de una compra)");

    const recurrentes = clientesRecurrentesSet(ventas);
    const distintos = new Set(ventas.map(v => v.cliente)).size;
    const porcentaje = distintos > 0 ? (recurrentes.length / distintos) * 100 : 0;

    console.log(`  Clientes distintos:       ${formatoNumero(distintos)}`);
    console.log(`  Clientes recurrentes:     ${formatoNumero(recurrentes.length)}`);
    console.log(
        `  Porcentaje recurrente:    ${porcentaje.toLocaleString("es-CO", { maximumFractionDigits: 1 })} %`
    );

    if (recurrentes.length === 0) return;

    const ordenados = [...recurrentes].sort();
    if (ordenados.length <= 10) {
        console.log(`  Clientes:                 ${ordenados.join(", ")}`);
    } else {
        console.log(`  Primeros 5 (orden alfab.): ${ordenados.slice(0, 5).join(", ")} ...`);
    }
}

// ==========================================
// 7. PRODUCTO ESTRELLA POR CIUDAD (Map de Maps, O(n))
// ==========================================

function reporteEstrellas(ventas) {
    titulo("PRODUCTO ESTRELLA POR CIUDAD");

    const estrellas = productoEstrellaPorCiudad(ventas);

    console.log(
        `  ${"CIUDAD".padEnd(15)} ${"PRODUCTO".padEnd(28)} ${"VECES".padStart(10)}`
    );
    console.log("  " + "-".repeat(55));

    if (estrellas.size === 0) {
        console.log("  No hay ventas para analizar.");
        return;
    }

    for (const [ciudad, { producto, veces }] of estrellas) {
        console.log(
            `  ${ciudad.padEnd(15)} ${String(producto).padEnd(28)} ${formatoNumero(veces).padStart(10)}`
        );
    }
}

// ==========================================
// 8. COMBO DE REGALO SUGERIDO (Map, O(n))
// ==========================================

function reporteCombo(catalogo, valor) {
    titulo(`COMBO DE REGALO PARA TARJETA DE ${formatoPesos(valor)}`);

    const combo = comboRegaloMap(catalogo, valor);

    if (combo === null) {
        console.log("  Ningún par de productos suma exactamente el valor de la tarjeta.");
        return;
    }

    const precios = new Map(catalogo.map(p => [p.producto, p.precio]));
    let suma = 0;

    combo.forEach((producto, i) => {
        const precio = precios.get(producto);
        suma += precio;
        console.log(
            `  Producto ${i + 1}:               ${producto.padEnd(24)} ${formatoPesos(precio).padStart(12)}`
        );
    });

    console.log(`  Suma:                     ${" ".repeat(24)} ${formatoPesos(suma).padStart(12)}`);
}

// ==========================================
// 9. CLIENTE PARA CUPÓN DE REGRESO (dos recorridos, O(n))
// ==========================================

function reporteCupon(ventas) {
    titulo("CLIENTE PARA CUPÓN DE REGRESO");

    const cliente = primerClienteUnico(ventas);

    if (cliente === null) {
        console.log("  Todos los clientes compraron más de una vez: no hay cupón que enviar.");
        return;
    }

    const venta = ventas.find(v => v.cliente === cliente);

    console.log(`  Cliente:                  ${cliente}`);
    console.log(`  Única compra:             ${venta.fecha}`);
    console.log(`  Ciudad:                   ${capitalizar(venta.ciudad)}`);
    console.log(`  Producto:                 ${venta.producto}`);
}

// ==========================================
// 10. MEJOR SEMANA (ventana deslizante, O(n))
// ==========================================

function fechaDesdeDia(dia) {
    return new Date(dia * MS_DIA).toISOString().slice(0, 10);
}

// Totales por día en pesos, sin saltos: los días sin ventas valen 0
function totalesDiarios(ventas) {
    const porDia = new Map();

    for (const { fecha, cantidad, precio } of ventas) {
        const dia = Date.parse(`${fecha}T00:00:00Z`) / MS_DIA;
        if (!Number.isFinite(dia)) continue;
        porDia.set(dia, (porDia.get(dia) || 0) + cantidad * precio);
    }

    if (porDia.size === 0) return { inicioDia: null, totales: [] };

    let min = Infinity;
    let max = -Infinity;
    for (const dia of porDia.keys()) {
        if (dia < min) min = dia;
        if (dia > max) max = dia;
    }

    const totales = new Array(max - min + 1).fill(0);
    for (const [dia, total] of porDia) totales[dia - min] = total;

    return { inicioDia: min, totales };
}

function reporteSemana(ventas) {
    titulo(`MEJOR SEMANA DE VENTAS (${DIAS_SEMANA} días consecutivos)`);

    let { inicioDia, totales } = totalesDiarios(ventas);
    let factor = 1; // pesos
    let etiqueta = i => fechaDesdeDia(inicioDia + i);

    if (totales.length < DIAS_SEMANA) {
        console.log(`  Las ventas cubren ${totales.length} día(s), menos de una semana.`);
        console.log("  Se usan los totales diarios de septiembre (dato del negocio).");
        totales = ventasDiarias;
        factor = 1000; // vienen en miles de pesos
        etiqueta = i => `2026-09-${String(i + 1).padStart(2, "0")}`;
    } else {
        console.log(`  Días analizados:          ${formatoNumero(totales.length)} (los días sin ventas cuentan como 0)`);
    }

    const mejor = mejorSemana(totales, DIAS_SEMANA);

    console.log(`  Semana:                   ${etiqueta(mejor.inicio)} al ${etiqueta(mejor.fin)}`);
    console.log(`  Total de la semana:       ${formatoPesos(mejor.total * factor)}`);
}

// ==========================================
// TIEMPOS
// ==========================================

function reporteTiempos(msTotal) {
    titulo("TIEMPO DE EJECUCIÓN POR SECCIÓN");

    for (const { nombre, ms } of tiempos) {
        console.log(`  ${nombre.padEnd(40)} ${ms.toFixed(2).padStart(10)} ms`);
    }

    console.log("  " + "-".repeat(53));
    console.log(`  ${"Total del reporte".padEnd(40)} ${msTotal.toFixed(2).padStart(10)} ms`);
}

// ==========================================
// EJECUCIÓN DEL REPORTE
// ==========================================

function generarReporte(ventas, origen, msGeneracion = null) {
    const inicio = performance.now();
    tiempos.length = 0;

    console.log("\n");
    console.log("*".repeat(65));
    console.log("             CAFÉ ORIGEN - REPORTE DE ANALÍTICA");
    console.log("*".repeat(65));
    console.log(`  Datos:                    ${origen}`);
    if (msGeneracion !== null) {
        console.log(`  Generación de datos:      ${msGeneracion.toFixed(0)} ms`);
    }

    medir("Resumen general", () => resumenGeneral(ventas));
    medir("Ventas por ciudad", () => reporteCiudades(ventas));
    medir("Unidades por producto", () => reporteProductos(ventas));
    medir("Top 3 productos por valor", () => reporteTopProductos(ventas));

    // Día que sí tiene ventas y día que no tiene ventas
    medir("Resumen del día (con ventas)", () => reporteDiario(ventas, "2026-09-01"));
    medir("Resumen del día (sin ventas)", () => reporteDiario(ventas, "2026-09-07"));

    medir("Clientes recurrentes", () => reporteRecurrentes(ventas));
    medir("Producto estrella por ciudad", () => reporteEstrellas(ventas));
    medir("Combo de regalo", () => reporteCombo(catalogo, VALOR_TARJETA));
    medir("Cliente para cupón", () => reporteCupon(ventas));
    medir("Mejor semana", () => reporteSemana(ventas));

    reporteTiempos(performance.now() - inicio);

    console.log("\n" + "*".repeat(65));
    console.log("                 FIN DEL REPORTE");
    console.log("*".repeat(65));
}

// ==========================================
// LÍNEA DE COMANDOS
//   node src/reporte.js           -> datos reales del Día 1
//   node src/reporte.js 100000    -> 100.000 ventas generadas
// ==========================================

function leerArgumento(argv) {
    const arg = argv[2];
    if (arg === undefined) return { n: null };

    const limpio = arg.replace(/[._,]/g, ""); // acepta 100000, 100.000 o 100_000
    if (!/^\d+$/.test(limpio) || Number(limpio) < 1) {
        return {
            error:
                `Argumento no válido: "${arg}".\n` +
                "Uso: node src/reporte.js [n]\n" +
                "  sin n: datos reales del Día 1\n" +
                "  con n: n ventas generadas (por ejemplo, 100000)"
        };
    }
    return { n: Number(limpio) };
}

function main() {
    const { n, error } = leerArgumento(process.argv);

    if (error) {
        console.error(error);
        process.exit(1);
    }

    if (n === null) {
        generarReporte(ventasDia1, "Datos reales del Día 1");
        return;
    }

    const t0 = performance.now();
    const generadas = generarVentas(n);
    const msGeneracion = performance.now() - t0;

    if (!Array.isArray(generadas) || generadas.length !== n) {
        console.error(`generarVentas(${n}) no devolvió un arreglo de ${n} ventas.`);
        process.exit(1);
    }

    generarReporte(generadas, `${formatoNumero(n)} ventas generadas`, msGeneracion);
}

if (require.main === module) {
    main();
}

module.exports = { generarReporte };
