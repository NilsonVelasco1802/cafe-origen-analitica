
const {
    ventas,
    totalVendido,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia
} = require("./analitica.js");

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

// ==========================================
// ENCABEZADO
// ==========================================

function titulo(seccion) {
    console.log("\n");
    console.log("=".repeat(65));
    console.log(`  ${seccion}`);
    console.log("=".repeat(65));
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
// EJECUCIÓN DEL REPORTE
// ==========================================

function generarReporte() {
    console.log("\n");
    console.log("*".repeat(65));
    console.log("             CAFÉ ORIGEN - REPORTE DE ANALÍTICA");
    console.log("*".repeat(65));

    resumenGeneral(ventas);
    reporteCiudades(ventas);
    reporteProductos(ventas);
    reporteTopProductos(ventas);

    // Día que sí tiene ventas
    reporteDiario(ventas, "2026-09-01");

    // Día que no tiene ventas
    reporteDiario(ventas, "2026-09-07");

    console.log("\n" + "*".repeat(65));
    console.log("                 FIN DEL REPORTE");
    console.log("*".repeat(65));
}

generarReporte();
