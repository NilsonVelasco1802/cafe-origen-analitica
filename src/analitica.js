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

/*
console.log("Total vendido:");
console.log(totalVendido(ventas));
console.log(unidadesVendidas(ventas[0].producto));
console.log(ventaMayor(ventas));
console.log(ticketPromedio(ventas));
console.log(ventasPorCiudad(ventas,"Medellín"));
*/


const ventaUnica = [ventas[0]];
const ventasVacias = [];

// TOTAL VENDIDO
console.log("Total completo:", totalVendido(ventas));
console.log("Total una venta:", totalVendido(ventaUnica));
console.log("Total vacío:", totalVendido(ventasVacias));

// UNIDADES VENDIDAS
console.log(unidadesVendidas("Origen Huila 500 g")); // 7
console.log(unidadesVendidas("Prensa francesa"));    // 2
console.log(unidadesVendidas("Molino manual"));      // 1
console.log(unidadesVendidas("Producto inexistente")); // 0

// VENTA MAYOR
console.log("Mayor completo:", ventaMayor(ventas));
console.log("Mayor una venta:", ventaMayor(ventaUnica));
console.log("Mayor vacío:", ventaMayor(ventasVacias));

// TICKET PROMEDIO
console.log("Promedio completo:", ticketPromedio(ventas));
console.log("Promedio una venta:", ticketPromedio(ventaUnica));
console.log("Promedio vacío:", ticketPromedio(ventasVacias));

// VENTAS POR CIUDAD
console.log("Ciudad completo:", ventasPorCiudad(ventas, "Medellín"));
console.log("Ciudad una venta:", ventasPorCiudad(ventaUnica, "Medellín"));
console.log("Ciudad vacío:", ventasPorCiudad(ventasVacias, "Medellín"));




// VERSIONES CON MÉTODOS DE ARREGLO



const totalVendidoM = (ventas) => {
    return ventas
        .filter(venta => venta.precio > 0 && venta.cantidad > 0)
        .reduce((total, venta) => total + valorVen(venta), 0);
};



function unidadesVendidasM(producto) {
    return ventas
        .filter(venta => venta.producto === producto && venta.cantidad > 0)
        .reduce((total, venta) => total + venta.cantidad, 0);
}



function ventasPorCiudadM(ventas, ciudad) {
    return ventas
        .filter(venta =>
            venta.ciudad.trim().toLowerCase() === ciudad.trim().toLowerCase()
            && valorVen(venta) > 0
        )
        .reduce((total, venta) => total + valorVen(venta), 0);
}


// AGRUPACIONES



function totalPorCiudad(ventas) {
    return ventas.reduce((totales, venta) => {
        const ciudad = venta.ciudad.trim().toLowerCase();

        if (valorVen(venta) > 0) {
            totales[ciudad] = (totales[ciudad] || 0) + valorVen(venta);
        }

        return totales;
    }, {});
}



function unidadesPorProducto(ventas) {
    return ventas.reduce((totales, venta) => {
        if (venta.cantidad > 0) {
            totales[venta.producto] =
                (totales[venta.producto] || 0) + venta.cantidad;
        }

        return totales;
    }, {});
}



function topProductosPorValor(ventas, k) {
    const totales = ventas.reduce((resultado, venta) => {
        if (valorVen(venta) > 0) {
            resultado[venta.producto] =
                (resultado[venta.producto] || 0) + valorVen(venta);
        }

        return resultado;
    }, {});

    return Object.entries(totales)
        .map(([producto, total]) => ({ producto, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, Math.max(0, k));
}



// EXPORTAR FUNCIONES


module.exports = {
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventasPorCiudad,
    ventasPorCiudadM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    valorVen,
    ventas
};
