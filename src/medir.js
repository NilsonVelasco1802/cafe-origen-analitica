
const { generarVentas,
        totalVendido,
        ventaMayor,
        totalPorCiudad,
        primeraVenta
    } = require("./generador.js");


// Cantidades de ventas que vamos a medir
const cantidades = [100, 1000, 10000, 100000];

// Aquí guardaremos los resultados
const resultados = [];

for (const n of cantidades) {

  // Generamos las ventas
  const ventas = generarVentas(n);

  // Contador independiente para cada función
  let contador = {
    operaciones: 0,
    comparaciones: 0
  };

  // Medimos totalVendido
  totalVendido(ventas, contador);

  const operacionesTotal = contador.operaciones;

  // Reiniciamos el contador
  contador = {
    operaciones: 0,
    comparaciones: 0
  };

  // Medimos ventaMayor
  ventaMayor(ventas, contador);

  const operacionesMayor = contador.operaciones;

  // Reiniciamos el contador
  contador = {
    operaciones: 0,
    comparaciones: 0
  };

  // Medimos totalPorCiudad
  totalPorCiudad(ventas, contador);

  const operacionesCiudad = contador.operaciones;

  contador = { 
    operaciones: 0,
    comparaciones: 0 
  };

  primeraVenta(ventas, contador);
  const operacionesPrimera = contador.operaciones;

  // Guardamos los resultados
  resultados.push({
    n,
    totalVendido: operacionesTotal,
    ventaMayor: operacionesMayor,
    totalPorCiudad: operacionesCiudad,
    primeraVenta: operacionesPrimera
  });
}

// Mostramos la tabla
console.log("RESULTADOS DE LAS MEDICIONES");
console.table(resultados);
