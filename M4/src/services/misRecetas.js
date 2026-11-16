// "Mis recetas": las que sube el usuario, guardadas en json-server (npm run api).
import { pedirJSON } from './http';

const URL_RECETAS = `${import.meta.env.VITE_API_URL}/recetas`;
const NOMBRE = 'the recipes API';

export function obtenerMisRecetas(signal) {
  return pedirJSON(URL_RECETAS, { signal }, NOMBRE);
}

export function crearReceta(receta) {
  return pedirJSON(
    URL_RECETAS,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receta),
    },
    NOMBRE,
  );
}
