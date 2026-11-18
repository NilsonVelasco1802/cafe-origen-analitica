const ventas  = require('./datos.js');


const valorVen = (venta) =>{return venta.cantidad * venta.precio;}

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


function unidadesVendidas(producto){
  let unidadesVendidas = 0;
  for (const venta of ventas) {
    if(venta.producto === producto){
      if(venta.cantidad > 0){
        unidadesVendidas += venta.cantidad
      }
    }   
  }
  return unidadesVendidas;
}

function ventaMayor(ventas) {
    if (ventas.length === 0) {
        return null;
    }

    let mayor = ventas[0];

    for (const venta of ventas) {
        if (valorVen(venta) > valorVen(mayor)) {
            mayor = venta;
        }
    }

    return mayor;
}

function ticketPromedio(ventas){
  let total= 0;
  let contador= 0; 
  for (const venta of ventas) {
    if(valorVen(venta) >0){
      total += valorVen(venta)
      contador++
    }

    if (contador === 0) {
        return null;
    }
  }
  return  total/contador
}

function ventasPorCiudad(ventas, ciudad){
  let totalVen=0;

  for (const v of ventas) {
    if (v.ciudad.trim().toLowerCase() === ciudad.trim().toLowerCase() && valorVen(v) > 0) {
      totalVen += valorVen(v);
    }
  }

  return totalVen;
}


console.log("Total vendido:");
console.log(totalVendido(ventas));
console.log(unidadesVendidas(ventas[0].producto));
console.log(ventaMayor(ventas));
console.log(ticketPromedio(ventas));
console.log(ventasPorCiudad(ventas,"Medellín"));
