import { z } from "zod";

const esquemaJugador = z.object({
  alias: z.string().min(3, "El alias necesita al menos 3 caracteres"),
  email: z.email("Ese email no cuela"),
  nivel: z.coerce.number().int().min(1).max(99),
});

// 1. Objeto correcto
console.log("1.", esquemaJugador.parse({ alias: "Nova", email: "nova@base.com", nivel: 10 }));

// 2. nivel llega como string y z.coerce lo convierte en número
console.log("2.", esquemaJugador.parse({ alias: "Kira", email: "kira@base.com", nivel: "42" }));

// 3. Objeto inválido con .parse(): lanza un error
const invalido = { alias: "Yo", email: "no-es-un-email", nivel: 150 };
try {
  esquemaJugador.parse(invalido);
} catch (error) {
  console.log("3.", error.name, error.message);
}

// 4. El mismo con .safeParse(): no lanza, devuelve un resultado
const resultado = esquemaJugador.safeParse(invalido);
if (!resultado.success) {
  console.log("4.", resultado.error.issues);
}
// Fallan los tres campos:
// - alias: "El alias necesita al menos 3 caracteres"
// - email: "Ese email no cuela"
// - nivel: mensaje por defecto de Zod, porque no le hemos puesto uno propio
//   (Too big: expected number to be <=99)

// .parse: cuando un dato inválido es un fallo inesperado y quiero que se lance
//   un error (por ejemplo, la configuración de la app).
// .safeParse: cuando un dato inválido es normal y quiero tratarlo sin try/catch
//   (por ejemplo, un formulario o la respuesta de una API).
