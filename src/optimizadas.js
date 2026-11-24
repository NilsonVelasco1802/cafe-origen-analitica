const ventas  = require('./datos.js');
const {generarVentas} = require("./generador.js");
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