// Ayudante común a todos los servicios: hace la petición y devuelve el JSON,
// o lanza un Error con un mensaje que se puede enseñar al usuario.
//
// Ojo: fetch solo falla si no hay red. Un 404 o un 500 llegan como
// respuestas "normales", así que hay que comprobar r.ok a mano.
export async function pedirJSON(url, opciones = {}, nombreApi = 'the server') {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (error) {
    // Si TanStack Query cancela la petición (signal), dejamos pasar el AbortError tal cual.
    if (error.name === 'AbortError') throw error;
    // "cause" guarda el error original (útil al depurar en consola).
    throw new Error(`Couldn't reach ${nombreApi}. Check your connection and try again.`, {
      cause: error,
    });
  }

  if (!respuesta.ok) {
    throw new Error(`Something went wrong on ${nombreApi} (HTTP ${respuesta.status}).`);
  }
  return respuesta.json();
}
