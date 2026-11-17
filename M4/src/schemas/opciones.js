// Opciones fijas del formulario "Share your recipe".
// Un único sitio para ellas: el esquema Zod las usa para validar (z.enum)
// y el formulario para pintar los <select>, radios y checkboxes.
// "valor" es lo que se guarda en la API; "etiqueta" lo que ve el usuario (en inglés).

// Las mismas categorías que usa TheMealDB, para que encajen con el filtro.
export const CATEGORIAS = [
  'Beef',
  'Breakfast',
  'Chicken',
  'Dessert',
  'Goat',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
];

// Categorías que llevan carne o pescado: no pueden ser vegetarianas ni veganas.
export const CATEGORIAS_CON_CARNE = ['Beef', 'Chicken', 'Goat', 'Lamb', 'Pork', 'Seafood'];

export const DIFICULTADES = [
  { valor: 'easy', etiqueta: 'Easy' },
  { valor: 'medium', etiqueta: 'Medium' },
  { valor: 'hard', etiqueta: 'Hard' },
];

export const DIETAS = [
  { valor: 'none', etiqueta: 'No special diet' },
  { valor: 'vegetarian', etiqueta: 'Vegetarian' },
  { valor: 'vegan', etiqueta: 'Vegan' },
];

export const ALERGENOS = [
  { valor: 'wheat', etiqueta: 'Wheat' },
  { valor: 'lactose', etiqueta: 'Lactose' },
  { valor: 'nuts', etiqueta: 'Nuts' },
  { valor: 'shellfish', etiqueta: 'Shellfish' },
  { valor: 'fish', etiqueta: 'Fish' },
  { valor: 'fruit-veg', etiqueta: 'Fruit & vegetables' },
  { valor: 'meat', etiqueta: 'Meat' },
  { valor: 'eggs', etiqueta: 'Eggs' },
];

// Qué alérgenos no puede llevar cada dieta.
export const ALERGENOS_PROHIBIDOS = {
  none: [],
  vegetarian: ['meat', 'fish', 'shellfish'],
  vegan: ['meat', 'fish', 'shellfish', 'lactose', 'eggs'],
};

// Sacar solo los valores, que es lo que necesita z.enum.
export const valores = (opciones) => opciones.map((opcion) => opcion.valor);

// Del valor a la etiqueta en inglés (para mensajes y para el listado).
export const etiquetaDe = (opciones, valor) =>
  opciones.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor;
