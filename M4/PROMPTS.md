# Registro de prompts — M4 «Full Contact Forms»

Registro de todo lo que le he pedido a la IA (Claude Code, modelo Claude Opus 5.5) durante la M4.
Cada entrada lleva la fecha, mi prompt copiado literalmente (con sus erratas), qué hizo la IA, qué archivos tocó y si le cambié o rechacé algo.

---

## 1. Ubicación del proyecto
- **Fecha:** 2026-11-16
- **Prompt:**
  > en q carpeta estas?
- **Qué hizo:** Respondió que está en `M4/` del repo `WEB_utad`, rama `M4`.
- **Archivos tocados:** Ninguno.
- **Cambios / rechazos:** Ninguno.

## 2. Plan para la M4
- **Fecha:** 2026-11-16
- **Prompt:**
  > vale, guay, lee el claude.md y dime como empezarias tu con la M4
- **Qué hizo:** Leyó `package.json`, `src/api.js`, `src/App.jsx` y `src/hooks/useFetch.js` y propuso un plan en 8 pasos: (1) json-server como API, (2) capa de servicios, (3) cambiar `useFetch` por `useQuery`, (4) esquema Zod con una propuesta de campos (incluido un `.refine` «vegetariana sin carne»), (5) formulario RHF accesible, (6) `useMutation` + listado «My recipes» con invalidación, (7) bonus `safeParse`, (8) README y declaración de IA.
- **Archivos tocados:** Ninguno (solo lectura).
- **Cambios / rechazos:** **Rechacé** un comando de terminal que solo servía para leer archivos, con el motivo: «para que me estas pidiendo permisos?». La IA explicó que los comandos de terminal piden permiso y pasó a leer los archivos con su herramienta de lectura, que no lo pide.

## 3. Montar la API con json-server
- **Fecha:** 2026-11-16
- **Prompt:**
  > vale, pues vamos a cambiar la api
- **Qué hizo:** Instaló `json-server` (v1 beta) como dependencia de desarrollo; tras instalarlo, npm pasó a decir 0 vulnerabilidades. Añadió el script `npm run api` (puerto 3001), creó `db.json` con `{ "recetas": [] }`, añadió `VITE_API_URL` al `.env`, creó `.env.example` como plantilla y metió `.env` en `.gitignore`. Actualizó el `CLAUDE.md` para que dijera que la API está decidida.
- **Archivos tocados:** `package.json`, `package-lock.json`, `db.json` (nuevo), `.env`, `.env.example` (nuevo), `.gitignore`, `CLAUDE.md`.
- **Cambios / rechazos:** Ninguno.

## 4. Qué es la capa de servicios
- **Fecha:** 2026-11-16
- **Prompt:**
  > que hace a capa de servicios?
- **Qué hizo:** Explicó qué es (archivos que son los únicos que hablan con las APIs), cómo está repartido ahora el código entre `api.js`, `useFetch.js` y `App.jsx`, cómo quedaría y por qué conviene (separar responsabilidades, encaja con `queryFn`/`mutationFn`, comprobar `r.ok` en un solo sitio, lugar para el `safeParse` del bonus).
- **Archivos tocados:** Ninguno.
- **Cambios / rechazos:** Ninguno.

## 5. Crear los servicios y pasar la búsqueda a useQuery
- **Fecha:** 2026-11-16
- **Prompt:**
  > si, cambia los servicios
- **Qué hizo:** Creó `src/services/http.js` (`pedirJSON`: fetch, comprueba `r.ok`, errores con mensaje para el usuario y `cause`), `src/services/mealdb.js` (`buscarRecetas`, `recetaAleatoria`) y `src/services/misRecetas.js` (`obtenerMisRecetas` y `crearReceta` con POST). En `App.jsx` cambió `useFetch` por `useQuery` (claves `['recetas', texto]` y `['aleatoria', n]`, `enabled`, `staleTime: Infinity`, `signal` para cancelar) y puso el error con `role="alert"` y un botón «Try again». Borró `src/api.js` y `src/hooks/useFetch.js`. Pasó `npm run lint` (dio 1 error de la regla `preserve-caught-error`, que corrigió añadiendo `cause`) y `npm run build` (correcto). Actualizó los archivos clave en el `CLAUDE.md`.
- **Archivos tocados:** `src/services/http.js` (nuevo), `src/services/mealdb.js` (nuevo), `src/services/misRecetas.js` (nuevo), `src/App.jsx`, `src/api.js` (borrado), `src/hooks/useFetch.js` (borrado), `CLAUDE.md`.
- **Cambios / rechazos:** Ninguno. La IA juntó en este paso los pasos 2 y 3 del plan (servicios + `useQuery`) porque, si no, la app se quedaba rota a medias.

## 6. Guardar los prompts según el CLAUDE.md
- **Fecha:** 2026-11-16
- **Prompt:**
  > vuelve a leer el claude.md y guarda los promsp como pide
- **Qué hizo:** Releyó el `CLAUDE.md` y avisó de que no decía nada sobre guardar prompts, y de que el archivo había vuelto a su versión original (se habían perdido sus cambios de los pasos 3 y 5). Propuso crear `PROMPTS.md` y preguntó por el formato.
- **Archivos tocados:** Ninguno.
- **Cambios / rechazos:** Ninguno.

## 7. Recuperar el CLAUDE.md y guardar lo hablado
- **Fecha:** 2026-11-16
- **Prompt:**
  > vale, pues guarda la informacion de lo hablado en claude.md y edita lo que se ha borrado por haber usado claude normal para hacer una edicion el el
- **Qué hizo:** Rehízo en el `CLAUDE.md` los cambios perdidos (archivos clave, API decidida) y actualizó «Estado de la configuración» (json-server, `.env` y `.env.example`, 0 vulnerabilidades, lint y build). Añadió una sección «Plan de trabajo y progreso» con los 7 pasos marcados (hecho / siguiente / pendiente), los campos propuestos para Zod y unas notas.
- **Archivos tocados:** `CLAUDE.md`.
- **Cambios / rechazos:** Ninguno.

## 8. Crear este registro de prompts
- **Fecha:** 2026-11-16
- **Prompt:**
  > Sí, quiero el registro de prompts en M4/PROMPTS.md. Cada vez que te pida algo, añade al final: fecha, mi prompt literal, qué hiciste y qué archivos tocaste, y si te cambié o rechacé algo. Empieza recuperando los prompts de esta sesión desde el principio.
- **Qué hizo:** Creó este archivo con los prompts de la sesión desde el principio y añadió al `CLAUDE.md` la norma de ir completándolo después de cada petición.
- **Archivos tocados:** `PROMPTS.md` (nuevo), `CLAUDE.md`.
- **Cambios / rechazos:** Ninguno.

## 9. Siguiente paso
- **Fecha:** 2026-11-17
- **Prompt:**
  > cual es el siguiente paso a seguir?
- **Qué hizo:** Indicó que el siguiente paso es el 3, el esquema Zod (`src/schemas/receta.js`). Recordó hacer antes los commits pendientes y volvió a presentar los campos propuestos para que Jorge los confirme. Como categorías propuso las mismas de TheMealDB.
- **Archivos tocados:** `PROMPTS.md`.
- **Cambios / rechazos:** Ninguno.

## 10. Esquema Zod con alérgenos y dieta
- **Fecha:** 2026-11-17
- **Prompt:**
  > añade tmb un z.enum con alergenos, y supongo q abra que crear un sitio donde guardar las posibes alergias, crealo para que las posibles alergias sean (Trigo,Lactosa,Frutos secos, mariscos,pescados,fruta/verdura,carne y huevos) y tambien un checkbox para marcar si la receta es vegana,vejetariana o ninguna, recuarda que la web esta en ingles y por tanto las alergias tmb tienen que estarlo
- **Qué hizo:** Creó `src/schemas/opciones.js`, el sitio donde se guardan las opciones fijas: categorías, dificultades, dietas y alérgenos, con el valor y la etiqueta en inglés (Wheat, Lactose, Nuts, Shellfish, Fish, Fruit & vegetables, Meat, Eggs), y qué alérgenos prohíbe cada dieta. Creó `src/schemas/receta.js` con el esquema completo y mensajes propios en inglés. Tiene dos `.refine` con `path` y `when`: una dieta vegetariana o vegana no puede tener alérgenos incompatibles (el mensaje dice cuáles), y una categoría con carne (Beef, Chicken…) no puede ser vegetariana. Lo probó con un script de 7 casos (vacío, válido, vegana con huevos, el refine saltando aunque el resto esté vacío, Beef vegetariano, email mal + `javascript:` en la imagen, decimales y fuera de rango) y pasó el lint.
- **Archivos tocados:** `src/schemas/opciones.js` (nuevo), `src/schemas/receta.js` (nuevo), `CLAUDE.md`, `PROMPTS.md`. El script de prueba quedó fuera del repo (carpeta temporal).
- **Cambios / rechazos:** **Cambié** la propuesta inicial: en vez de un checkbox «Vegetarian» con refine sobre los ingredientes, pedí un `z.enum` de alérgenos y una opción vegana / vegetariana / ninguna. La IA hizo la dieta con radios en vez de checkbox porque las opciones se excluyen entre sí, y pasó el refine a comparar la dieta con los alérgenos.
