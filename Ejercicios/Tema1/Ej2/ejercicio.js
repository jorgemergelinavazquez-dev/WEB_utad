const crearEntrada = (nombre, evento, precio = 15) => `==============================
  🎟️  ${evento}
  Asistente: ${nombre}
  Precio final: ${precio + precio * 0.1} €
==============================`;

console.log(crearEntrada("Ada Lovelace", "JS FEST 2026"));
