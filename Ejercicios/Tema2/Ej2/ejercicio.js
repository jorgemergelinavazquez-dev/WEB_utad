const respuesta = {
  data: {
    usuario: {
      nombre: "Río", nivel: 12,
      stats: { victorias: 40, derrotas: 5 },
    },
    amigos: ["Vega", "Kai", "Nova"],
  },
};

const {
  data: {
    usuario: {
      nombre,
      rango = "novato", // no existe: se usa el valor por defecto
      stats: { victorias: wins },
    },
    amigos: [mejorAmigo, ...resto],
  },
} = respuesta;

console.log(
  `${nombre} · wins: ${wins} · rango: ${rango} · mejor amigo: ${mejorAmigo} · resto: ${resto.join(", ")}`
);
