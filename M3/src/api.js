// Todo lo que sabe de TheMealDB vive aquí: URLs y transformación de datos.
// Viene de api.js + transform.js de M2, pero sin tocar el DOM.

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export const urlBusqueda = (texto) =>
  `${BASE}/search.php?s=${encodeURIComponent(texto)}`;

// "n" solo sirve para que cada sorpresa tenga una URL distinta.
export const urlAleatoria = (n) => `${BASE}/random.php?n=${n}`;

// La API devuelve 20 pares strIngredientX / strMeasureX, muchos vacíos.
function extraerIngredientes(meal) {
  return Array.from({ length: 20 }, (_, i) => ({
    posicion: i + 1,
    nombre: meal[`strIngredient${i + 1}`]?.trim(),
    medida: meal[`strMeasure${i + 1}`]?.trim() ?? '',
  })).filter((ingrediente) => ingrediente.nombre);
}

export function transformarRecetas(meals) {
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
