const ventas  = require('./datos.js');
const {generarVentas} = require("./generador.js");
const catalogo = require("./catalogo.js");
const assert = require("node:assert");
const { performance } = require("node:perf_hooks");

//CON SET
function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();
  for (const v of ventas) {
    if (vistos.has(v.cliente)) recurrentes.add(v.cliente);
    else vistos.add(v.cliente);
  }
  return [...recurrentes];
}

//CON MAP
function comprasPorCliente(ventas) {
  const compras = new Map();
  for (const v of ventas) {
    compras.set(v.cliente, (compras.get(v.cliente) || 0) + 1);
  }

  const recurrentes = [];
  for (const [cliente, cantidad] of compras) {
    if (cantidad > 1) recurrentes.push(cliente);
  }
  return recurrentes;
}

//ORIGINAL
function clientesRecurrentes(ventas) {
    const recurrentes = [];

    for (let i = 0; i < ventas.length; i++) {
        for (let j = i + 1; j < ventas.length; j++) {
            if (
                ventas[i].cliente === ventas[j].cliente &&
                !recurrentes.includes(ventas[i].cliente)
            ) {
                recurrentes.push(ventas[i].cliente);
            }
        }
    }

    return recurrentes;
}


//comboRegalo()

//FUERZA BRUTA
function comboRegalo(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        return [catalogo[i].producto, catalogo[j].producto];
      }
    }
  }
  return null; // ningún par suma el valor exacto
}


//OPTIMIZADA CON MAP
function comboRegaloMap(catalogo, valor) {
  const vistos = new Map(); // precio -> producto

  for (const { producto, precio } of catalogo) {
    const complemento = valor - precio;

    if (vistos.has(complemento)) {
      return [vistos.get(complemento), producto];
    }
    vistos.set(precio, producto);
  }
  return null; // ningún par suma el valor exacto
}

//PRUEBA MINI RETO 10

/*
const casos = [
  { valor: 87000, nota: "combo único" },
  { valor: 61000, nota: "combo único, en otra posición" },
  { valor: 50000, nota: "sin combinación" },
  { valor: 52000, nota: "26.000 + 26.000: no vale, es el mismo producto" },
];

for (const { valor, nota } of casos) {
  console.log(`\nValor ${valor} (${nota})`);
  console.log("  fuerza bruta:", comboRegalo(catalogo, valor));
  console.log("  map:         ", comboRegaloMap(catalogo, valor));
}
*/

//PRODUCTOS ESTRELLA
// "medellín" y "Medellín" deben contar como la misma ciudad

function normalizarCiudad(ciudad) {
  return ciudad.trim().toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
}

function productoEstrellaPorCiudad(ventas) {
  // 1. Conteo: ciudad -> (producto -> veces que aparece)
  const conteos = new Map();
  for (const { ciudad, producto } of ventas) {
    const c = normalizarCiudad(ciudad);
    if (!conteos.has(c)) conteos.set(c, new Map());
    const porProducto = conteos.get(c);
    porProducto.set(producto, (porProducto.get(producto) || 0) + 1);
  }

  // 2. Máximo de cada ciudad
  const estrellas = new Map();
  for (const [ciudad, porProducto] of conteos) {
    let mejor = null;
    let max = 0;
    for (const [producto, veces] of porProducto) {
      if (veces > max) {   // ">" estricto: en empate gana el que apareció primero
        mejor = producto;
        max = veces;
      }
    }
    estrellas.set(ciudad, { producto: mejor, veces: max });
  }
  return estrellas;
}

//TEST
//console.log(productoEstrellaPorCiudad(ventas));

//PRIMER CLIENTE UNICO
function primerClienteUnico(ventas) {
  // Recorrido 1: contar cuántas veces aparece cada cliente
  const conteo = new Map();
  for (const { cliente } of ventas) {
    conteo.set(cliente, (conteo.get(cliente) || 0) + 1);
  }

  // Recorrido 2: en orden de ventas, el primero cuyo conteo sea 1
  for (const { cliente } of ventas) {
    if (conteo.get(cliente) === 1) return cliente;
  }
  return null; // todos los clientes compraron más de una vez
}


//La mejor racha y el presupuesto exacto
const ventasDiarias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370,
];

// FUERZA BRUTA: suma cada bloque de k días desde cero
function mejorSemanaBruta(dias, k) {
  if (k <= 0 || k > dias.length) return null;

  let mejor = null;
  for (let inicio = 0; inicio + k <= dias.length; inicio++) {
    let suma = 0;
    for (let i = inicio; i < inicio + k; i++) {
      suma += dias[i];
    }
    // ">" estricto: en empate gana la primera semana
    if (mejor === null || suma > mejor.total) {
      mejor = { inicio, fin: inicio + k - 1, total: suma };
    }
  }
  return mejor;
}
//console.log(mejorSemanaBruta(ventasDiarias, 7));

// VENTANA DESLIZANTE: una sola pasada, O(n) sin importar k
function mejorSemana(dias, k) {
  if (k <= 0 || k > dias.length) return null;

  // 1. Primera ventana: se suma una sola vez
  let suma = 0;
  for (let i = 0; i < k; i++) suma += dias[i];

  let mejor = { inicio: 0, fin: k - 1, total: suma };

  // 2. Deslizar: entra dias[i], sale dias[i - k]
  for (let i = k; i < dias.length; i++) {
    suma += dias[i] - dias[i - k];

    // ">" estricto: en empate gana la primera semana
    if (suma > mejor.total) {
      mejor = { inicio: i - k + 1, fin: i, total: suma };
    }
  }
  return mejor;
}
//console.log(mejorSemana(ventasDiarias, 7));

// DOS PUNTEROS: el par con la mayor suma que no supera el presupuesto
function parMasCercano(catalogo, presupuesto) {
  if (catalogo.length < 2) return null;

  // Ordenamos una copia de menor a mayor precio (sin alterar el catálogo)
  const ord = [...catalogo].sort((a, b) => a.precio - b.precio);

  let izq = 0;
  let der = ord.length - 1;
  let mejor = null;

  while (izq < der) {
    const suma = ord[izq].precio + ord[der].precio;

    if (suma > presupuesto) {
      der--; // se pasa: el más caro no cabe con ningún otro
    } else {
      if (mejor === null || suma > mejor.suma) {
        mejor = { productos: [ord[izq].producto, ord[der].producto], suma };
      }
      if (suma === presupuesto) break; // no se puede acercar más
      izq++; // cabe: probar un barato más caro
    }
  }
  return mejor; // null si ningún par cabe en el presupuesto
}

//Prueba con presupuestos de 100.000, 140.000 y 40.000,
const casos = [
  { presupuesto: 100000, nota: "cabe, pero no exacto" },
  { presupuesto: 140000, nota: "suma exacta" },
  { presupuesto: 40000, nota: "sin solución" },
];

for (const { presupuesto, nota } of casos) {
  console.log(`\nPresupuesto ${presupuesto} (${nota})`);
  console.log(parMasCercano(catalogo, presupuesto));
}


/*
//TEST CONTRA LA FUERZA BRUTA
// 1. Datos de septiembre
assert.deepStrictEqual(mejorSemana(ventasDiarias, 7), mejorSemanaBruta(ventasDiarias, 7));
assert.deepStrictEqual(mejorSemana(ventasDiarias, 7), { inicio: 23, fin: 29, total: 3670 });

// 2. Casos borde
for (const k of [0, -1, 31]) {
  assert.strictEqual(mejorSemana(ventasDiarias, k), null);
}
assert.deepStrictEqual(mejorSemana(ventasDiarias, 1), mejorSemanaBruta(ventasDiarias, 1));   // un día
assert.deepStrictEqual(mejorSemana(ventasDiarias, 30), mejorSemanaBruta(ventasDiarias, 30)); // todo el mes

// 3. Arreglos aleatorios (con muchos empates posibles)
for (let t = 0; t < 500; t++) {
  const n = 1 + Math.floor(Math.random() * 60);
  const dias = Array.from({ length: n }, () => Math.floor(Math.random() * 10) * 100);
  const k = 1 + Math.floor(Math.random() * n);
  assert.deepStrictEqual(mejorSemana(dias, k), mejorSemanaBruta(dias, k), `Difieren con n=${n}, k=${k}`);
}
console.log("✔ mejorSemana coincide con mejorSemanaBruta");


//COMPROBAR AMBAS VERCIONES SEPTIEMBRE CON 100.000 DATOS AL AZAR (COMPRUEBA TIEMPOS)
// Generador con semilla (mulberry32): mismos datos en cada ejecución
function crearAzar(semilla) {
  return function () {
    semilla |= 0; semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generarDias(n, semilla = 42) {
  const azar = crearAzar(semilla);
  // Enteros entre 0 y 999 (miles de pesos): hay empates, y las sumas son exactas
  return Array.from({ length: n }, () => Math.floor(azar() * 1000));
}

function mediana(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function medir(fn, dias, k, repeticiones) {
  let resultado = fn(dias, k); // calentamiento
  const tiempos = [];
  for (let i = 0; i < repeticiones; i++) {
    const t0 = performance.now();
    resultado = fn(dias, k);
    tiempos.push(performance.now() - t0);
  }
  return { ms: mediana(tiempos), resultado };
}

// 1. Datos de septiembre
const bruta = mejorSemanaBruta(ventasDiarias, 7);
const deslizante = mejorSemana(ventasDiarias, 7);
assert.deepStrictEqual(deslizante, bruta);
assert.deepStrictEqual(deslizante, { inicio: 23, fin: 29, total: 3670 });
console.log("✔ Septiembre: coinciden", deslizante);

// 2. 100.000 días al azar, varios tamaños de ventana
const N = 100000;
const dias = generarDias(N);
assert.strictEqual(dias.length, N);

const filas = [];
for (const k of [7, 1000, 10000]) {
  const repeticiones = k <= 1000 ? 5 : 3;
  const a = medir(mejorSemanaBruta, dias, k, repeticiones);
  const b = medir(mejorSemana, dias, k, repeticiones);

  assert.deepStrictEqual(b.resultado, a.resultado, `Difieren con k=${k}`);

  filas.push({
    k,
    bruta_ms: a.ms.toFixed(2),
    deslizante_ms: b.ms.toFixed(2),
    veces_mas_rapida: (a.ms / b.ms).toFixed(1),
    inicio: b.resultado.inicio,
    total: b.resultado.total,
  });
  console.log(`✔ ${N.toLocaleString("es-CO")} días, k=${k}: coinciden`);
}

console.table(filas);

console.log("\n| k | Bruta (ms) | Deslizante (ms) | Veces más rápida |");
console.log("|---:|---:|---:|---:|");
for (const f of filas) {
  console.log(`| ${f.k.toLocaleString("es-CO")} | ${f.bruta_ms} | ${f.deslizante_ms} | ${f.veces_mas_rapida} |`);
}
*/

/*

//TEST
console.log(primerClienteUnico(ventas));
//PEUBAS RAPIDAS
console.log(primerClienteUnico([]));  // null
console.log(primerClienteUnico([
  { cliente: "A" }, { cliente: "A" }, { cliente: "B" }, { cliente: "B" },
])); // null: todos repiten
console.log(primerClienteUnico([
  { cliente: "A" }, { cliente: "B" }, { cliente: "A" }, { cliente: "C" },
])); // 'B': A repite, B es el primero que no
*/

/*
//TESTEO
function verificar(nombre, datos) {
  const resultados = {
    original: clientesRecurrentes(datos),
    set: clientesRecurrentesSet(datos),
    map: comprasPorCliente(datos),
  };

  // Ordenamos copias para no alterar los arreglos originales
  const ordenados = {};
  for (const [k, arr] of Object.entries(resultados)) {
    ordenados[k] = [...arr].sort();
    // Ninguna versión debe devolver clientes repetidos
    assert.strictEqual(new Set(arr).size, arr.length, `${k} devolvió duplicados`);
  }

  assert.deepStrictEqual(ordenados.set, ordenados.original, `${nombre}: Set ≠ original`);
  assert.deepStrictEqual(ordenados.map, ordenados.original, `${nombre}: Map ≠ original`);

  console.log(`✔ ${nombre}: las 3 versiones coinciden (${ordenados.original.length} recurrentes)`);
  return ordenados.original;
}

// Día 1: resultado esperado calculado a mano
// C01 (ids 1, 4, 11), C02 (ids 2, 7) y C03 (ids 3, 9) compraron más de una vez
const dia1 = verificar("Día 1", ventas);
assert.deepStrictEqual(dia1, ["C01", "C02", "C03"]);

// 5.000 ventas generadas
const generadas = generarVentas(5000);
assert.strictEqual(generadas.length, 5000);
verificar("5.000 ventas generadas", generadas);

// Opcional: comparar tiempos
for (const [nombre, fn] of [
  ["original", clientesRecurrentes],
  ["set", clientesRecurrentesSet],
  ["map", comprasPorCliente],
]) {
  console.time(nombre);
  fn(generadas);
  console.timeEnd(nombre);
}



const TAMANOS = [1000, 10000, 100000];
const LIMITE_ORIGINAL = 10000; // por encima de esto la original se omite

const versiones = [
  { nombre: "original", fn: clientesRecurrentes },
  { nombre: "set", fn: clientesRecurrentesSet },
  { nombre: "map", fn: comprasPorCliente },
];

function mediana(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function medir(fn, datos, repeticiones) {
  let resultado = fn(datos); // calentamiento: deja que V8 optimice
  const tiempos = [];
  for (let i = 0; i < repeticiones; i++) {
    const t0 = performance.now();
    resultado = fn(datos);
    tiempos.push(performance.now() - t0);
  }
  return { ms: mediana(tiempos), resultado };
}

const filas = [];

for (const n of TAMANOS) {
  const datos = generarVentas(n);
  const repeticiones = n >= 100000 ? 5 : 11;
  const fila = { ventas: n };
  let referencia = null;

  for (const { nombre, fn } of versiones) {
    if (nombre === "original" && n > LIMITE_ORIGINAL) {
      fila[nombre] = "omitida";
      continue;
    }
    const { ms, resultado } = medir(fn, datos, repeticiones);
    fila[nombre] = ms.toFixed(2);

    // De paso, comprobamos que siguen coincidiendo
    const ordenado = [...resultado].sort();
    if (referencia === null) referencia = ordenado;
    else assert.deepStrictEqual(ordenado, referencia, `${nombre} difiere con n=${n}`);
    fila.recurrentes = ordenado.length;
  }
  filas.push(fila);
}

console.table(filas);

// Tabla en Markdown para copiar
console.log("\n| Ventas | Original (ms) | Set (ms) | Map (ms) | Recurrentes |");
console.log("|---:|---:|---:|---:|---:|");
for (const f of filas) {
  console.log(`| ${f.ventas.toLocaleString("es-CO")} | ${f.original} | ${f.set} | ${f.map} | ${f.recurrentes} |`);
}

*/

module.exports = {
  clientesRecurrentes,
  clientesRecurrentesSet,
  comprasPorCliente,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  comboRegalo,
  comboRegaloMap,
  parMasCercano,
  ventasDiarias,
  mejorSemanaBruta,
  mejorSemana,
};