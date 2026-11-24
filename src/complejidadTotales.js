const {generarVentas} = require("./generador.js");

function totalCiudadCadena(ventas, ciudad) {
    return ventas
        .map(venta => ({
            ...venta,
            ciudad: venta.ciudad.toLowerCase().trim()
        }))
        .filter(venta => venta.ciudad === ciudad.toLowerCase().trim())
        .map(venta => venta.cantidad * venta.precio)
        .reduce((total, valor) => total + valor, 0);
}


function totalCiudadUnaPasada(ventas, ciudad) {
    let total = 0;
    const ciudadBuscada = ciudad.toLowerCase().trim();

    for (let i = 0; i < ventas.length; i++) {
        const ciudadVenta = ventas[i].ciudad.toLowerCase().trim();

        if (ciudadVenta === ciudadBuscada) {
            total += ventas[i].cantidad * ventas[i].precio;
        }
    }

    return total;
}

//console.log(totalCiudadCadena(ventas, "Medellín"));
//console.log(totalCiudadUnaPasada(ventas, "Medellín"));

const ventas = generarVentas(10000);

const resultadoCadena =
    totalCiudadCadena(ventas, "Medellín");

const resultadoUnaPasada =
    totalCiudadUnaPasada(ventas, "Medellín");

console.log("Total con cadena:", resultadoCadena);
console.log("Total con una pasada:", resultadoUnaPasada);

console.log(
    "¿Los resultados coinciden?:",
    resultadoCadena === resultadoUnaPasada
);

module.exports = totalCiudadUnaPasada;
module.exports = totalCiudadCadena;

