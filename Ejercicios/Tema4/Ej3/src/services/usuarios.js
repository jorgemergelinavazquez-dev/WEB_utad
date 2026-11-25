export async function obtenerUsuario(id) {
  const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
  // fetch no rechaza la promesa con un 404: hay que comprobar ok
  if (!respuesta.ok) {
    throw new Error(`HTTP: ${respuesta.status}`)
  }
  return respuesta.json()
}

// Versión sin la comprobación de ok:
// export async function obtenerUsuario(id) {
//   const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
//   return respuesta.json()
// }

// ¿Qué error obtienes ahora y por qué es más confuso?
// Ninguno: con el 404 la API devuelve {}, fetch no rechaza y el nombre sale
// undefined. Es más confuso porque parece que todo ha ido bien y el fallo
// aparece más tarde, lejos de la petición que lo causó.
