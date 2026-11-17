// "Mis recetas": las que sube el usuario, guardadas en json-server (npm run api).
import { z } from 'zod';
import { pedirJSON } from './http';
import { esquemaRecetaGuardada } from '../schemas/receta';

const URL_RECETAS = `${import.meta.env.VITE_API_URL}/recetas`;
const NOMBRE = 'the recipes API';

// Es la queryFn de ['misRecetas']. Bonus: además de comprobar r.ok (pedirJSON),
// valida con Zod CADA receta que llega. Las que no cumplen el esquema no se pintan:
// se cuentan en "descartadas" para avisar al usuario y se detallan en la consola.
// Así un dato corrupto no rompe la lista entera (ni llega a un <img src>).
export async function obtenerMisRecetas(signal) {
  const datos = await pedirJSON(URL_RECETAS, { signal }, NOMBRE);

  if (!Array.isArray(datos)) {
    throw new Error('The recipes API sent something unexpected. Please try again later.');
  }

  const recetas = [];
  const descartadas = [];
  for (const dato of datos) {
    const resultado = esquemaRecetaGuardada.safeParse(dato);
    if (resultado.success) {
      recetas.push(resultado.data);
    } else {
      descartadas.push(String(dato?.id ?? '(sin id)'));
      console.warn(`Receta descartada (id: ${dato?.id}). Zod dice:\n${z.prettifyError(resultado.error)}`);
    }
  }
  return { recetas, descartadas };
}

export async function crearReceta(receta) {
  const guardada = await pedirJSON(
    URL_RECETAS,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receta),
    },
    NOMBRE,
  );

  // También se valida lo que contesta el servidor tras el POST.
  const resultado = esquemaRecetaGuardada.safeParse(guardada);
  if (!resultado.success) {
    console.warn(`Respuesta del POST no válida. Zod dice:\n${z.prettifyError(resultado.error)}`);
    throw new Error('Your recipe was sent, but the server’s reply looks wrong. Check My recipes.');
  }
  return resultado.data;
}
