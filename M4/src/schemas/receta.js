// Esquema Zod del formulario "Share your recipe".
// Es la ÚNICA fuente de verdad de la validación: el formulario no tiene reglas
// propias, solo conecta este esquema con zodResolver.
// Mensajes en inglés porque los ve el usuario.
import { z } from 'zod';
import {
  ALERGENOS,
  ALERGENOS_PROHIBIDOS,
  CATEGORIAS,
  CATEGORIAS_CON_CARNE,
  DIETAS,
  DIFICULTADES,
  etiquetaDe,
  valores,
} from './opciones.js';

const URL_WEB = /^https?:\/\/\S+$/;
const esImagenValida = (url) => url === '' || (URL_WEB.test(url) && URL.canParse(url));

// --- Campos sueltos ---------------------------------------------------------

const campos = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, { error: 'Give your recipe a name (at least 3 characters).' })
    .max(60, { error: 'Keep the name under 60 characters.' }),

  // El mensaje cambia según si está vacío o mal escrito.
  email: z.email({
    error: (issue) =>
      issue.input === '' ? 'Tell us your email.' : 'That email doesn’t look right (e.g. chef@example.com).',
  }),

  categoria: z.enum(CATEGORIAS, { error: 'Pick a category.' }),

  dificultad: z.enum(valores(DIFICULTADES), { error: 'Choose how hard it is.' }),

  dieta: z.enum(valores(DIETAS), { error: 'Choose a diet option.' }),

  // Los <input type="number"> devuelven texto: z.coerce lo pasa a número.
  // Ojo: un campo vacío ('') se convierte en 0, así que el mensaje del .min
  // también es el que se ve si se deja vacío.
  tiempo: z.coerce
    .number({ error: 'Enter the prep time in minutes.' })
    .int({ error: 'Use whole minutes.' })
    .min(1, { error: 'Enter a prep time of at least 1 minute.' })
    .max(600, { error: 'Keep it under 600 minutes (10 hours).' }),

  raciones: z.coerce
    .number({ error: 'Enter how many servings it makes.' })
    .int({ error: 'Use a whole number of servings.' })
    .min(1, { error: 'Enter how many people it serves (at least 1).' })
    .max(20, { error: 'Up to 20 servings.' }),

  // Un ingrediente por línea: el texto se convierte en array y luego se valida el array.
  ingredientes: z
    .string()
    .transform((texto) =>
      texto
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().max(80, { error: 'Each ingredient line must be under 80 characters.' }))
        .min(2, { error: 'Add at least 2 ingredients, one per line.' })
        .max(30, { error: 'Up to 30 ingredients.' }),
    ),

  instrucciones: z
    .string()
    .trim()
    .min(20, { error: 'Explain the steps a bit more (at least 20 characters).' })
    .max(3000, { error: 'Keep the instructions under 3000 characters.' }),

  // Opcional. Si se rellena, solo http(s): así nunca acaba en un src/href un "javascript:".
  imagen: z
    .string()
    .trim()
    .refine(esImagenValida, {
      error: 'Use a full link starting with http:// or https://',
    }),

  // Checkboxes: RHF devuelve un array con los valores marcados. Puede ir vacío.
  alergenos: z.array(z.enum(valores(ALERGENOS)), { error: 'Pick allergens from the list.' }),
});

// --- Reglas entre campos ----------------------------------------------------

// Por defecto Zod no ejecuta un .refine del objeto si algún campo ya tiene error.
// Con "when" decimos: ejecútalo en cuanto los campos que usa sean válidos,
// aunque el resto del formulario todavía esté a medias.
const sonValidos = (...nombres) => (payload) =>
  campos.pick(Object.fromEntries(nombres.map((n) => [n, true]))).safeParse(payload.value).success;

const prohibidosEn = ({ dieta, alergenos }) =>
  alergenos.filter((alergeno) => ALERGENOS_PROHIBIDOS[dieta].includes(alergeno));

export const esquemaReceta = campos
  // 1) La dieta tiene que cuadrar con los alérgenos marcados.
  .refine((receta) => prohibidosEn(receta).length === 0, {
    path: ['alergenos'],
    when: sonValidos('dieta', 'alergenos'),
    error: (issue) => {
      const receta = issue.input;
      const lista = prohibidosEn(receta).map((a) => etiquetaDe(ALERGENOS, a)).join(', ');
      return `A ${etiquetaDe(DIETAS, receta.dieta).toLowerCase()} recipe can’t contain: ${lista}.`;
    },
  })
  // 2) Y también con la categoría: un "Beef" no puede ser vegetariano.
  .refine((receta) => receta.dieta === 'none' || !CATEGORIAS_CON_CARNE.includes(receta.categoria), {
    path: ['dieta'],
    when: sonValidos('dieta', 'categoria'),
    error: (issue) => `A ${issue.input.categoria} recipe can’t be vegetarian or vegan.`,
  });

// --- Lo que DEVUELVE la API (bonus) -----------------------------------------
// No nos fiamos del servidor: cada receta que llega se valida antes de pintarla.
// No es el mismo esquema que el del formulario: aquí los datos ya vienen
// transformados (números, arrays), y además llevan id y fecha.
// Comparte con el formulario las listas de opciones (opciones.js).
export const esquemaRecetaGuardada = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  nombre: z.string().min(1).max(60),
  email: z.email().optional(), // se guarda, pero nunca se muestra
  categoria: z.enum(CATEGORIAS),
  dificultad: z.enum(valores(DIFICULTADES)),
  dieta: z.enum(valores(DIETAS)),
  tiempo: z.number().int().positive(),
  raciones: z.number().int().positive(),
  ingredientes: z.array(z.string()),
  instrucciones: z.string(),
  imagen: z.string().refine(esImagenValida, { error: 'Image must be empty or an http(s) link.' }),
  alergenos: z.array(z.enum(valores(ALERGENOS))),
  creadaEn: z.iso.datetime(),
});

// Valores iniciales del formulario (RHF defaultValues). Todo vacío salvo la dieta.
export const recetaVacia = {
  nombre: '',
  email: '',
  categoria: '',
  dificultad: '',
  dieta: 'none',
  tiempo: '',
  raciones: '',
  ingredientes: '',
  instrucciones: '',
  imagen: '',
  alergenos: [],
};
