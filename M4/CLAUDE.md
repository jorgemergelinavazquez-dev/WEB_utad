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
3. ✅ **Esquema Zod**: `src/schemas/opciones.js` (único sitio de las opciones fijas, con `valor` para la API y `etiqueta` en inglés para la UI: `CATEGORIAS` de TheMealDB, `CATEGORIAS_CON_CARNE`, `DIFICULTADES`, `DIETAS` none/vegetarian/vegan, `ALERGENOS` wheat/lactose/nuts/shellfish/fish/fruit-veg/meat/eggs, `ALERGENOS_PROHIBIDOS` por dieta, helpers `valores` y `etiquetaDe`) y `src/schemas/receta.js` (`esquemaReceta` + `recetaVacia` para `defaultValues`). Campos (nombres en español): `nombre`, `email`, `categoria` (select), `dificultad` (radios), `dieta` (radios, decidido por Jorge; no checkbox porque es excluyente), `tiempo` y `raciones` (`z.coerce`), `ingredientes` (textarea → array de strings con `.transform().pipe()`), `instrucciones`, `imagen` (opcional, solo http(s)), `alergenos` (checkboxes → `z.array(z.enum)`). Dos `.refine` con `path` y `when` (para que salten aunque el resto del formulario tenga errores): dieta vs alérgenos (`path: ['alergenos']`, mensaje con la lista concreta) y dieta vs categoría con carne (`path: ['dieta']`). Probado con un script de casos y lint OK. Commit propuesto: «Añadir esquema Zod de la receta con alérgenos y dieta».
   - En el formulario: `register('dieta', { deps: ['alergenos', 'categoria'] })` (y viceversa) para que los errores cruzados se recalculen. Ojo: `ingredientes` queda como array de strings; en el paso 5 habrá que adaptarlo a la forma `{ posicion, nombre, medida }` que usa `DetalleReceta`, o adaptar el componente.
4. ✅ **Formulario RHF + useMutation**: `src/components/FormularioReceta.jsx` en una tercera pestaña «✍️ My recipes» (id `'mias'` en `Pestanas`; en `App.jsx` esa vista muestra el formulario y oculta el filtro de categorías). `useForm` con `zodResolver(esquemaReceta)`, `defaultValues: recetaVacia`, `mode: 'onTouched'`, `noValidate`, foco al primer error (`shouldFocusError` por defecto), `deps` cruzados categoria↔dieta↔alergenos. Accesibilidad: `label htmlFor` en todo, radios/checkboxes en `fieldset` + `legend`, `aria-invalid`, `aria-describedby` (ayuda + error), errores con `role="alert"`, éxito `role="status"`, error del servidor `role="alert"`, `autoComplete` (email, url), asterisco de obligatorio con texto para lector de pantalla (`.solo-lector`), `:focus-visible` marcado. `useMutation(crearReceta)` con `onSuccess` → `invalidateQueries({ queryKey: ['misRecetas'] })`; `reset()` tras éxito; botón deshabilitado solo con `isPending` («Saving…»); botón «Clear form». Se guarda también `creadaEn`. Estilos en `App.css` (sección «Formulario»). Lint y build OK; Jorge lo probó en el navegador y funciona. Commit propuesto: «Añadir formulario Share your recipe con RHF, Zod y useMutation».
5. ✅ **Listado «My recipes»**: `src/components/ListaMisRecetas.jsx`, debajo del formulario en la vista `'mias'`. `useQuery({ queryKey: ['misRecetas'], queryFn, select })`; `select` ordena por `creadaEn` (más nuevas primero) sin tocar la caché. Estados: `isPending` («Loading your recipes…», `role="status"`), `isError` (`role="alert"` + «Try again»), vacío, e indicador «Updating…» cuando `isFetching && !isPending` (se ve la invalidación tras guardar). Tarjeta propia `TarjetaMiReceta` (no se reutilizan `TarjetaReceta`/`DetalleReceta`, que son para TheMealDB): imagen solo si es http(s) (si no, 🍲), categoría, dificultad, tiempo, raciones, sello de dieta, alérgenos como chips, ingredientes e instrucciones en `<details>`, fecha. El email no se muestra (privacidad). Lint y build OK. Commit propuesto: «Añadir listado My recipes con useQuery».
   - **Formulario desplegable** (pedido por Jorge): `src/components/MisRecetas.jsx` es la vista `'mias'`; tiene el estado `abierto` y el botón «+ Add recipe» / «✕ Close form» (`aria-expanded`, `aria-controls="compartir"`) que se pasa como `accion` a la cabecera de `ListaMisRecetas`; el formulario va como `children` entre cabecera y lista. El formulario se oculta con `hidden` (no se desmonta) para no perder lo escrito; al abrir, `setFocus('nombre')`; al cerrar (botón o «Cancel»), el foco vuelve al botón. El título del formulario pasó a `h3`.
   - `db.json` tiene una receta de prueba de Jorge con un **email real**: cambiarlo por uno de ejemplo (`chef@example.com`) antes de commitear. json-server v1 añade `"$schema"` a `db.json`; es normal.
6. ✅ **Bonus**: `esquemaRecetaGuardada` en `src/schemas/receta.js` (esquema de lo que DEVUELVE la API: id, enums compartidos de `opciones.js`, números, arrays, imagen vacía o http(s), `creadaEn` con `z.iso.datetime()`; distinto del del formulario porque aquí no hay transformaciones). En `src/services/misRecetas.js`, `obtenerMisRecetas` (la `queryFn`) comprueba que llega un array y hace `safeParse` de **cada** receta: devuelve `{ recetas, descartadas }`; las inválidas se descartan con `console.warn` + `z.prettifyError`. `crearReceta` también valida la respuesta del POST. `ListaMisRecetas` muestra el aviso «⚠ N recipe(s) hidden because the data from the server is corrupted» (`role="status"`). **Demo**: en `db.json` está la receta `receta-corrupta-demo` (dificultad `impossible`, tiempo `"twenty"`, ingredientes como string, imagen `javascript:`, alérgeno `gluten`, fecha `yesterday`) → Zod la descarta con 6 errores. Sin la validación, `ingredientes.map` sobre un string rompería la lista. Lint y build OK. Commit propuesto: «Bonus: validar la respuesta del API con Zod (safeParse) y receta corrupta de demo».
7. ⏳ **Cierre** (siguiente paso): README M4 (arranque con `npm run api` + `npm run dev`, estructura, declaración de IA), revisar `db.json` antes de commitear (los POST de prueba se guardan ahí), repo limpio.

**Notas**
- `../Claude outputs/` (fuera de `M4/`) sale como sin seguimiento en git: no meterla en ningún commit.
- Los comandos de terminal piden permiso a Jorge; leer archivos no. Agrupar comandos para pedir permiso las menos veces posibles.
- **Registro de prompts (obligatorio):** después de cada petición de Jorge, añadir una entrada al final de `M4/PROMPTS.md` con: fecha, su prompt literal (copiado tal cual, con erratas), qué hizo la IA, qué archivos se tocaron y si Jorge cambió o rechazó algo (incluidos los permisos de herramientas rechazados). Seguir la numeración y el formato de las entradas que ya hay. Enlazarlo desde la declaración de IA del README.
- Si Jorge edita este archivo con otra herramienta, comprobar que no se pierden las secciones de progreso.

## Entrega
- Actualizar `README.md` a M4 (ahora mismo todavía describe la M3): qué es, cómo arrancar (incluido json-server si se usa), estructura, y **declaración de uso de IA**.
- Commits pequeños y con sentido; repo limpio (sin `node_modules`, sin archivos sueltos).
