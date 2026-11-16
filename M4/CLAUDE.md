# Contexto para Claude Code — Misión M4 «Full Contact Forms»

## Quién soy y qué es esto
- Soy Jorge Mergelina, estudiante de 3º en U-tad. Esto es una entrega de la asignatura **Programación Web 1** (Unidad 4: Formularios y peticiones HTTP).
- En esta asignatura el profesor pide programar con IA: no se espera código escrito a mano, pero sí que yo lo entienda.
- Háblame en español.

## El repositorio
- Repo `WEB_utad` (GitHub: jorgemergelinavazquez-dev/WEB_utad). Una carpeta y una rama por misión: M1, M2, M3, M4 + carpeta `Ejercicios`.
- **Trabajo solo dentro de `M4/`, en la rama `M4`.** La carpeta `M3/` no se toca nunca.
- `M4/` empezó como copia exacta de `M3/` (commit «Crear M4 a partir de M3»). Uso GitHub Desktop para commits y push.

## La app
- Es mi **Recipe Box**: buscador de recetas con la API de TheMealDB (solo lectura), hecho en React 19 + Vite, en JavaScript (no TypeScript).
- La interfaz está en inglés a propósito (TheMealDB solo tiene recetas en inglés). Código, comentarios y README en español.
- Ya tiene: búsqueda, receta aleatoria, filtro por categoría, detalle en modal, favoritas en localStorage, tema claro/oscuro.
- Archivos clave: `src/App.jsx`, `src/services/` (`http.js` = fetch + comprobación de `r.ok`; `mealdb.js` = TheMealDB; `misRecetas.js` = json-server GET/POST), `src/hooks/useLocalStorage.js`, `src/components/*`. Ya no hay `api.js` ni `useFetch.js`: la búsqueda va con `useQuery`.

## Lo que la M4 tiene que añadir (idea decidida: seguir con las recetas)
Un formulario serio de **registro + listado**: «Sube tu receta» que se valida, se envía con POST a una API y aparece en un listado «Mis recetas».
- API para el POST: **json-server en local** (decidido). JSONPlaceholder no guarda nada y entonces la invalidación no se notaría en el listado. Arranca con `npm run api` (puerto 3001, datos en `db.json`, colección `recetas`); URL en `VITE_API_URL`. TheMealDB sigue usándose para la búsqueda (solo lectura).

## Rúbrica de la M4 (100 pts + bonus)
| Bloque | Qué se evalúa | Pts |
|---|---|---|
| React Hook Form | Formulario no controlado con RHF (`register`/`handleSubmit`, estados de error), errores accesibles y UX cuidada | 20 |
| Validación con Zod | Esquema expresivo (refinamientos, mensajes propios) conectado con `zodResolver`; Zod como **única fuente de verdad** | 15 |
| TanStack Query | `useQuery`/`useMutation` (v5) con claves bien diseñadas e invalidación correcta | 15 |
| Experiencia de usuario | Estados de carga / error / éxito comunicados con claridad | 10 |
| Originalidad | Dominio del formulario elegido y detalles extra | 10 |
| Checks automáticos | README, declaración de IA, repo limpio, commits, tecnología, estructura | 30 |
| **Bonus** | Validar también la respuesta del API con Zod (`safeParse`) y demostrar que atrapa un dato corrupto | extra |

## Estado de la configuración (ya hecho)
- Instaladas: `react-hook-form`, `zod` (v4), `@hookform/resolvers`, `@tanstack/react-query` (v5), `@tanstack/react-query-devtools`, y `json-server` (v1 beta, devDependency).
- `src/main.jsx` ya envuelve `<App />` con `QueryClientProvider` y tiene `<ReactQueryDevtools />`.
- `.env` con `VITE_MEALDB_URL` (TheMealDB) y `VITE_API_URL=http://localhost:3001` (json-server). `.env` está en `.gitignore`; se sube `.env.example` como plantilla.
- Tras instalar json-server, `npm install` ya dice **0 vulnerabilidades** (las 3 moderate de antes desaparecieron). Aun así, **no** usar nunca `npm audit fix --force`.
- `npm run lint` y `npm run build` pasan sin errores. El lint exige `cause` al relanzar un error capturado (regla `preserve-caught-error`).

## Cómo quiere el tema que se haga (sigue esto)
**Formulario**
- RHF con `register` + `handleSubmit`; `noValidate` en el `<form>`; `defaultValues`; `reset()` tras un envío correcto.
- Nada de reglas sueltas en `register`: toda la validación en el esquema Zod vía `zodResolver`.
- Zod 4: mensajes con `error` (no `message`), `z.email()` de primer nivel, `z.coerce.number()` para inputs numéricos, al menos un `.refine` con `path`. Ojo: si falla un `enum`/`literal`/tipo, el `.refine` no se ejecuta. Si un error depende de otro campo, usar `register("campo", { deps: ["otro"] })`.
- `Controller` solo para componentes de terceros; con inputs nativos, `register`.

**Accesibilidad (la rúbrica lo mira)**
- `<label htmlFor>` en cada campo (el placeholder no es etiqueta), `autoComplete` donde aplique, radios/checkbox en `<fieldset>` + `<legend>`.
- `aria-invalid={!!errors.x}`, `aria-describedby` al id del mensaje, mensaje de error con `role="alert"`.
- Éxito con `role="status"`, error global (servidor) con `role="alert"`.
- Foco al primer campo con error; botón deshabilitado **solo** mientras se envía, nunca «hasta que sea válido».
- Todo el formulario usable solo con teclado.

**Peticiones**
- Capa de servicios separada (p. ej. `src/services/recetas.js`); los componentes solo usan `useQuery`/`useMutation`.
- Siempre comprobar `r.ok` y lanzar `Error` con mensaje útil (fetch no falla con 404/500).
- POST con `method`, `headers: { "Content-Type": "application/json" }`, `body: JSON.stringify(...)`.
- `useQuery({ queryKey, queryFn })`: claves en array y con sus parámetros (`["recetas", texto]`, `["misRecetas"]`); `enabled` para queries dependientes; en v5 es `isPending` (no `isLoading`) y `gcTime` (no `cacheTime`). Reintenta 3 veces por defecto (ajustable con `retry`).
- `useMutation` + `onSuccess: () => queryClient.invalidateQueries({ queryKey: [...] })`.
- Bonus: validar la respuesta con un esquema Zod (`safeParse`) dentro de la `queryFn` y demostrarlo con un dato corrupto.
- URLs base en variables `VITE_` del `.env`; nunca secretos ahí.
- `useFetch.js` (useEffect + fetch) se sustituye por TanStack Query.

**Seguridad**
- La validación del cliente es UX, no seguridad. Nada de `dangerouslySetInnerHTML` sin DOMPurify, nada de `href` con datos sin comprobar `http(s)://`. Sesión, si la hubiera, en cookie httpOnly, no en localStorage.

## Plan de trabajo y progreso (ir actualizando)
1. ✅ **API con json-server**: script `npm run api`, `db.json` con `{ "recetas": [] }`, `VITE_API_URL`, `.env.example`, `.env` en `.gitignore`. Commit propuesto: «Añadir json-server como API local para Mis recetas».
2. ✅ **Capa de servicios + useQuery**: `src/services/http.js` (`pedirJSON`: fetch, `r.ok`, errores con mensaje para el usuario, deja pasar `AbortError`), `mealdb.js` (`buscarRecetas`, `recetaAleatoria`, transformación privada), `misRecetas.js` (`obtenerMisRecetas`, `crearReceta`, aún sin usar). En `App.jsx`: `useQuery` con claves `['recetas', texto]` y `['aleatoria', n]`, `enabled: Boolean(peticion)`, `staleTime: Infinity` (si no, la sorpresa cambia al volver a la pestaña), `signal` de TanStack para cancelar. Carga = `Boolean(peticion) && isPending` (una query desactivada también está `pending`). Error con `role="alert"` + botón «Try again» (`refetch`). Borrados `api.js` y `useFetch.js`. Commit propuesto: «Crear capa de servicios y pasar la búsqueda a useQuery».
   - Cambio de comportamiento: antes las búsquedas se cacheaban en localStorage; ahora la caché de TanStack es en memoria (se pierde al recargar).
3. ⏳ **Esquema Zod** (`src/schemas/receta.js`) — siguiente paso. Campos propuestos (pendiente de que Jorge los confirme): name (3–60), author email (`z.email()`), category (`z.enum` + `<select>`), difficulty (enum, radios en fieldset), prep time y servings (`z.coerce.number().int()` con rango), ingredients (textarea, uno por línea → array con `.transform`, mínimo 2), instructions (mín. 20), image URL (opcional, solo `http(s)://`), vegetarian (checkbox) con `.refine` `path: ["ingredients"]`: si es vegetariana no puede llevar carne/pescado (con `deps`).
4. ⬜ **Formulario RHF** «Share your recipe» con toda la accesibilidad de arriba.
5. ⬜ **useMutation + listado «My recipes»** (tercera pestaña en `Pestanas`), `invalidateQueries({ queryKey: ['misRecetas'] })`.
6. ⬜ **Bonus**: esquema de respuesta + `safeParse` en la `queryFn` de «My recipes», con una receta corrupta en `db.json` para demostrarlo.
7. ⬜ **Cierre**: README M4 (arranque con `npm run api` + `npm run dev`, estructura, declaración de IA), revisar `db.json` antes de commitear (los POST de prueba se guardan ahí), repo limpio.

**Notas**
- `../Claude outputs/` (fuera de `M4/`) sale como sin seguimiento en git: no meterla en ningún commit.
- Los comandos de terminal piden permiso a Jorge; leer archivos no. Agrupar comandos para pedir permiso las menos veces posibles.
- **Registro de prompts (obligatorio):** después de cada petición de Jorge, añadir una entrada al final de `M4/PROMPTS.md` con: fecha, su prompt literal (copiado tal cual, con erratas), qué hizo la IA, qué archivos se tocaron y si Jorge cambió o rechazó algo (incluidos los permisos de herramientas rechazados). Seguir la numeración y el formato de las entradas que ya hay. Enlazarlo desde la declaración de IA del README.
- Si Jorge edita este archivo con otra herramienta, comprobar que no se pierden las secciones de progreso.

## Entrega
- Actualizar `README.md` a M4 (ahora mismo todavía describe la M3): qué es, cómo arrancar (incluido json-server si se usa), estructura, y **declaración de uso de IA**.
- Commits pequeños y con sentido; repo limpio (sin `node_modules`, sin archivos sueltos).
