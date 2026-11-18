
const {
    ventas,
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventasPorCiudad,
    ventasPorCiudadM
} = require("./analitica.js");


function verificar(nombre, resultadoCiclo, resultadoMetodo) {
    if (resultadoCiclo === resultadoMetodo) {
        console.log(`${nombre}: OK`);
    } else {
        console.log(`${nombre}: DIFERENTE`);
        console.log("Ciclo:", resultadoCiclo);
        console.log("Método:", resultadoMetodo);
    }
}


// 1. Verificar total vendido
verificar(
    "Total vendido",
    totalVendido(ventas),
    totalVendidoM(ventas)
);


// 2. Verificar unidades vendidas
verificar(
    "Unidades vendidas",
    unidadesVendidas("Origen Huila 500 g"),
    unidadesVendidasM("Origen Huila 500 g")
);


// 3. Verificar ventas por ciudad
verificar(
    "Ventas por ciudad",
    ventasPorCiudad(ventas, "Medellín"),
    ventasPorCiudadM(ventas, "Medellín")
);
