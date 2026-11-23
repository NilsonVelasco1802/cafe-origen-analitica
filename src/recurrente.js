const ventas  = require('./datos.js');

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

const cantidades = /*[1000, 2000, 4000, 8000, 16000]*/ [100000,1000000,];

for (const n of cantidades) {
    const ventas = Array.from(
        { length: n },
        (_, i) => ({ cliente: `C${i}` })
    );

    console.time(`Tiempo para ${n} ventas`);

    clientesRecurrentes(ventas);

    console.timeEnd(`Tiempo para ${n} ventas`);
}


const resultado = clientesRecurrentes(ventas);

console.log(resultado);

module.exports = clientesRecurrentes;