// Todo lo que sabe de TheMealDB vive aquí: URLs, petición y transformación de datos.
// TheMealDB es solo lectura: aquí no hay POST.
import { pedirJSON } from './http';

const BASE = import.meta.env.VITE_MEALDB_URL;
const NOMBRE = 'TheMealDB';

// La API devuelve 20 pares strIngredientX / strMeasureX, muchos vacíos.
function extraerIngredientes(meal) {
  return Array.from({ length: 20 }, (_, i) => ({
    posicion: i + 1,
    nombre: meal[`strIngredient${i + 1}`]?.trim(),
    medida: meal[`strMeasure${i + 1}`]?.trim() ?? '',
  })).filter((ingrediente) => ingrediente.nombre);
}

// Pasa del formato de TheMealDB (strMeal, strCategory...) al nuestro.
function transformarRecetas(meals) {
  return (meals ?? [])
    .filter((meal) => meal.strMealThumb && meal.strCategory)
    .map((meal) => ({
      id: meal.idMeal,
      nombre: meal.strMeal,
      imagen: meal.strMealThumb,
      categoria: meal.strCategory,
      origen: meal.strArea,
      instrucciones: meal.strInstructions ?? '',
      ingredientes: extraerIngredientes(meal),
    }));
}

// "signal" lo pasa TanStack Query: si la query deja de interesar, cancela el fetch.
export async function buscarRecetas(texto, signal) {
  const url = `${BASE}/search.php?s=${encodeURIComponent(texto)}`;
  const datos = await pedirJSON(url, { signal }, NOMBRE);
  return transformarRecetas(datos.meals);
}

export async function recetaAleatoria(signal) {
  const datos = await pedirJSON(`${BASE}/random.php`, { signal }, NOMBRE);
  return transformarRecetas(datos.meals);
}
