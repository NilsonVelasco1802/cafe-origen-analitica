
const productos = [
  { nombre: "Origen Huila 500 g", precio: 42000 },
  { nombre: "Origen Nariño 250 g", precio: 26000 },
  { nombre: "Prensa francesa", precio: 95000 },
  { nombre: "Origen Sierra 500 g", precio: 45000 },
  { nombre: "Molino manual", precio: 120000 },
];

const ciudades = [
  "Medellín",
  "Bogotá",
  "Cali",
  "Pereira",
];

function generarVentas(n) {
  const ventas = [];

  const cantidadClientes = Math.max(1, Math.floor(n / 3));

  for (let i = 0; i < n; i++) {
    const producto =
      productos[Math.floor(Math.random() * productos.length)];

    const ciudad =
      ciudades[Math.floor(Math.random() * ciudades.length)];

    const clienteNumero =
      Math.floor(Math.random() * cantidadClientes) + 1;

    const cantidad =
      Math.floor(Math.random() * 5) + 1;

    const dia =
      Math.floor(Math.random() * 30) + 1;

    ventas.push({
      id: i + 1,
      fecha: `2026-09-${String(dia).padStart(2, "0")}`,
      cliente: `C${String(clienteNumero).padStart(2, "0")}`,
      producto: producto.nombre,
      ciudad,
      cantidad,
      precio: producto.precio,
    });
  }

  return ventas;
}


const contador = {
  operaciones: 0,
  comparaciones: 0
};

function totalVendido(ventas, contador) {
  let total = 0;

  for (let i = 0; i < ventas.length; i++) {
    contador.operaciones++; // Visitamos un elemento

    total += ventas[i].cantidad * ventas[i].precio;
  }

  return total;
}

function ventaMayor(ventas, contador) {
  if (ventas.length === 0) return null;

  let mayor = ventas[0];

  for (let i = 1; i < ventas.length; i++) {
    contador.operaciones++; // Visitamos un elemento

    contador.comparaciones++; // Comparamos dos ventas

    if (
      ventas[i].cantidad * ventas[i].precio >
      mayor.cantidad * mayor.precio
    ) {
      mayor = ventas[i];
    }
  }

  return mayor;
}

function totalPorCiudad(ventas, contador) {
  const resultados = {};

  for (let i = 0; i < ventas.length; i++) {
    contador.operaciones++; // Visitamos un elemento

    const ciudad = ventas[i].ciudad;

    if (!resultados[ciudad]) {
      resultados[ciudad] = 0;
    }

    resultados[ciudad] +=
      ventas[i].cantidad * ventas[i].precio;
  }

  return resultados;
}

function primeraVenta(ventas, contador) {
  contador.operaciones++;

  if (ventas.length === 0) {
    return null;
  }

  return ventas[0];
}

module.exports = {
    totalVendido,
    ventaMayor,
    totalPorCiudad,
    generarVentas,
    primeraVenta,
    contador
};
