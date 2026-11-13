const ventas  = require('./datos.js');

const totalVendido = (ventas) => {
  let total = 0;

  for (const venta of ventas) {
    if (venta.precio <= 0 || venta.cantidad <= 0) {
      continue;
    }

    total += venta.precio * venta.cantidad;
  }

  return total;
};

console.log("Total vendido:");
console.log(totalVendido(ventas));