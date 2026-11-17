# M4 - Full Contact Forms: Recipe Box con formulario

## Qué es el proyecto
Es mi Recipe Box de la M3 (el buscador de recetas de [TheMealDB](https://www.themealdb.com/api.php) hecho en React 19 + Vite) con una parte nueva: **«My recipes»**, donde puedes subir tus propias recetas con un formulario. El formulario se valida con Zod, se envía con un POST a una API y la receta aparece al momento en tu listado.

La web sigue en inglés a propósito: TheMealDB solo tiene recetas en inglés, y así se entiende desde el principio que hay que buscar en inglés. El código, los comentarios y este README están en español.

Qué se puede hacer:
- **Buscar recetas** por nombre en inglés (*chicken*, *lasagna*…) o pulsar 🎲 *Surprise me* para una aleatoria. Si tarda sale un mensaje de carga, y si falla te avisa con un botón *Try again*.
- **Filtrar por categoría**, abrir una receta para ver ingredientes y preparación, guardar **favoritas** (★, se quedan en `localStorage`) y cambiar entre **tema claro y oscuro**.
- **Subir tu receta** en la pestaña ✍️ *My recipes* con el botón **+ Add recipe**: nombre, email, categoría, dificultad, tiempo, raciones, dieta (ninguna / vegetariana / vegana), **alérgenos**, ingredientes, instrucciones y una foto opcional.
- **Ver tus recetas** en tarjetas con su dificultad, tiempo, raciones, un sello 🌱 si es vegetariana o vegana, los alérgenos como etiquetas y los ingredientes e instrucciones desplegables.

## Cómo arrancar el proyecto
Hacen falta **dos terminales**, una para la API y otra para la web.

1. Clona el repositorio y abre la terminal en la carpeta `M4`.
2. Instala las dependencias: `npm install`.
3. Copia `.env.example` como `.env` (tiene las URLs de las dos APIs; no hay ningún secreto).
4. **Terminal 1:** levanta la API con `npm run api`. Es [json-server](https://github.com/typicode/json-server) en http://localhost:3001 y guarda las recetas en `db.json`.
5. **Terminal 2:** levanta la web con `npm run dev` y abre la dirección que te dé (por defecto http://localhost:5173/).

Si no arrancas la API, la búsqueda de TheMealDB funciona igual, pero *My recipes* te enseñará un mensaje de error con *Try again*.

¿Por qué json-server y no JSONPlaceholder? Porque JSONPlaceholder responde al POST pero no guarda nada, así que después de enviar el formulario la receta no aparecería en el listado y no se notaría la invalidación de la caché.

## Estructura

```
M4/
├── db.json                     "Base de datos" de json-server (colección recetas)
├── .env.example                Plantilla de variables VITE_ (URLs de las APIs)
├── PROMPTS.md                  Registro de todos los prompts que usé con la IA
└── src/
    ├── main.jsx                QueryClientProvider + React Query Devtools
    ├── App.jsx                 Estado de la app, búsqueda con useQuery y vistas
    ├── services/               Los ÚNICOS archivos que hacen fetch
    │   ├── http.js             pedirJSON: fetch + comprobar r.ok + errores legibles
    │   ├── mealdb.js           TheMealDB: buscar, aleatoria y transformar datos
    │   └── misRecetas.js       json-server: GET y POST, validando la respuesta con Zod
    ├── schemas/
    │   ├── opciones.js         Categorías, dificultades, dietas y alérgenos (un solo sitio)
    │   └── receta.js           Esquema del formulario y esquema de la respuesta del API
    ├── hooks/
    │   └── useLocalStorage.js  useState que persiste (favoritas y tema)
    └── components/
        ├── Buscador.jsx        Búsqueda + Surprise me
        ├── Pestanas.jsx        Results / Favorites / My recipes
        ├── FiltroCategoria.jsx Select de categorías
        ├── ListaRecetas.jsx    Rejilla de recetas de TheMealDB
        ├── TarjetaReceta.jsx   Una receta + botón de favorita
        ├── DetalleReceta.jsx   Ventana con ingredientes y preparación
        ├── BotonTema.jsx       Claro / oscuro
        ├── MisRecetas.jsx      Vista My recipes: botón + Add recipe y formulario desplegable
        ├── FormularioReceta.jsx Formulario con React Hook Form + useMutation
        └── ListaMisRecetas.jsx Listado con useQuery y estados de carga / error / vacío
```

## El formulario: React Hook Form + Zod
- Es un formulario **no controlado**: React Hook Form lee los campos con `register` y envía con `handleSubmit`. Tiene `noValidate` (para que no salgan los globos del navegador), `defaultValues` y `reset()` después de guardar.
- **Zod es la única fuente de verdad.** En el componente no hay ni una regla de validación: todo está en `src/schemas/receta.js` y se conecta con `zodResolver`. Los mensajes de error son propios (en inglés, porque los ve el usuario).
- Algunas cosas del esquema:
  - `z.email()` con un mensaje distinto si el campo está vacío o si está mal escrito.
  - `z.coerce.number()` para el tiempo y las raciones, porque los inputs numéricos devuelven texto.
  - Los ingredientes se escriben uno por línea y Zod los convierte en un array (`.transform().pipe()`).
  - La foto solo admite enlaces `http://` o `https://`.
  - **Dos `.refine` entre campos**: una receta vegetariana o vegana no puede tener alérgenos incompatibles (el mensaje dice cuáles, p. ej. *"A vegan recipe can't contain: Eggs, Lactose."*), y una categoría con carne (Beef, Chicken…) no puede ser vegetariana.
- Esos dos refines usan `when` para que el error salga aunque el resto del formulario esté a medias (por defecto Zod no ejecuta un refine del objeto si hay otros errores), y en el formulario los campos relacionados usan `deps`, así que el error se recalcula al cambiar la dieta, la categoría o los alérgenos.
- Las opciones (categorías, dietas, alérgenos…) están en `src/schemas/opciones.js`. El esquema las usa para validar y el formulario para pintar los campos, así que añadir un alérgeno es tocar una línea.

### Accesibilidad
- Cada campo tiene su `<label htmlFor>`; la dificultad, la dieta y los alérgenos van en `<fieldset>` con `<legend>`.
- Los campos con error llevan `aria-invalid` y `aria-describedby` apuntando a su ayuda y a su mensaje; los mensajes tienen `role="alert"`.
- El éxito se anuncia con `role="status"` y el error del servidor con `role="alert"`.
- Al enviar con errores, el foco va al primer campo mal. Al abrir el formulario el foco va al primer campo, y al cerrarlo vuelve al botón.
- El botón de enviar solo se deshabilita **mientras se envía** (*Saving…*), nunca "hasta que sea válido".
- Todo se puede usar con teclado y el foco se ve bien. Los errores no se marcan solo con color: también hay borde, icono y texto.

## Peticiones: TanStack Query
- `useFetch` (el `useEffect` + `fetch` de la M3) ya no existe: ahora todo va con **TanStack Query v5**.
- Los componentes nunca hacen `fetch`: llaman a funciones de `src/services/`, que comprueban `r.ok` y lanzan un `Error` con un mensaje que se puede enseñar al usuario (recordatorio: `fetch` no falla con un 404 o un 500).
- **Claves:** `['recetas', texto]` para cada búsqueda, `['aleatoria', n]` para cada sorpresa y `['misRecetas']` para el listado. La búsqueda usa `enabled` para no pedir nada hasta que el usuario busca algo.
- **Mutación:** el formulario usa `useMutation` con `crearReceta` (POST con `Content-Type: application/json` y `JSON.stringify`). En `onSuccess` hace `invalidateQueries({ queryKey: ['misRecetas'] })`, y el listado se vuelve a pedir solo. Se ve un momento el aviso *Updating…*.
- **Estados:** carga (`isPending`), error con *Try again* (`refetch`), lista vacía, actualizando (`isFetching`) y éxito del envío.

## Bonus: validar la respuesta del API con Zod
No me fío de lo que llega del servidor. La `queryFn` de *My recipes* (`obtenerMisRecetas`) valida **cada receta** con `esquemaRecetaGuardada.safeParse()`. Las válidas se muestran; las que no cumplen el esquema se descartan, en pantalla sale el aviso *"⚠ 1 recipe was hidden because the data from the server is corrupted."* y en la consola del navegador aparece el detalle con `z.prettifyError`. La respuesta del POST también se valida.

**Demo:** en `db.json` hay a propósito una receta rota, `receta-corrupta-demo`:

| Campo | Valor corrupto | Lo que dice Zod |
|---|---|---|
| `dificultad` | `"impossible"` | no es easy / medium / hard |
| `tiempo` | `"twenty"` | esperaba un número |
| `ingredientes` | `"sugar, flour"` | esperaba un array |
| `imagen` | `"javascript:alert('xss')"` | solo admite http(s) |
| `alergenos` | `["gluten"]` | no está en la lista |
| `creadaEn` | `"yesterday"` | no es una fecha ISO |

Sin esta validación, la lista entera se rompería (el componente hace `ingredientes.map(...)` y un texto no tiene `map`), y además un `javascript:` podría acabar en un `src`. Para verlo: abre *My recipes* con la consola abierta (F12). Si borras esa receta de `db.json`, el aviso desaparece.

## Seguridad
- La validación del cliente es para que el usuario tenga una buena experiencia, **no es seguridad**: cualquiera puede saltársela y llamar a la API directamente. Por eso también valido lo que vuelve del servidor.
- No uso `dangerouslySetInnerHTML` en ningún sitio, y las imágenes solo se pintan si su URL empieza por `http(s)://`.
- El email se guarda pero no se muestra en las tarjetas.
- En `.env` solo hay URLs públicas (todo lo que empieza por `VITE_` acaba en el navegador). El `.env` no se sube; se sube `.env.example` como plantilla.

## Uso de IA
- **Herramienta:** Claude Code (modelo Claude Opus 5.5) dentro de VS Code. El profesor pide programar con IA, así que el código lo ha escrito la IA y mi parte ha sido decidir qué quería, revisar lo que hacía, probarlo y entenderlo.
- **Qué pedí:** primero que leyera el `CLAUDE.md` (donde tengo apuntada la rúbrica y cómo quiere el tema que se haga) y me propusiera un plan. Luego lo fuimos haciendo paso a paso: json-server, capa de servicios, esquema Zod, formulario, listado y bonus. Por el camino cambié cosas: pedí añadir los **alérgenos** y la opción **vegana / vegetariana / ninguna** en lugar del checkbox de "vegetariana" que me propuso, y que el formulario se **desplegara con un botón "+ Add recipe"** en vez de estar siempre visible.
- **Registro completo de prompts:** está en [`PROMPTS.md`](PROMPTS.md), con la fecha, mi prompt tal cual, qué hizo la IA, qué archivos tocó y qué le cambié o rechacé.
- **Ejemplos de prompts utilizados:**
    - *"añade tmb un z.enum con alergenos, y supongo q abra que crear un sitio donde guardar las posibes alergias […] recuarda que la web esta en ingles y por tanto las alergias tmb tienen que estarlo"*
    - *"vale, quiero que en my recipis aparezcan las recetas como ahora, pero el form se despliegue conn un boto de "+ add recipy""*
- **Cómo lo verifiqué:** después de cada paso la IA pasó `npm run lint` y `npm run build`. El esquema Zod se probó con un script de casos (formulario vacío, receta válida, vegana con huevos, Beef vegetariano, email mal escrito, imagen `javascript:`, decimales y fuera de rango), y el esquema de respuesta con las recetas de `db.json`. Yo probé el formulario en el navegador con `npm run api` y `npm run dev` y guardé una receta de prueba, que se quedó en `db.json`.

## Autopsia
1. **Decisión 1: la respuesta del API se valida receta a receta, no la lista entera de golpe.**
   - **Alternativa descartada:** hacer `z.array(esquemaRecetaGuardada).parse(datos)` en la `queryFn`, que es lo más directo.
   - **Por qué tomé esta decisión:** con `parse` sobre el array, una sola receta rota hace que falle toda la query y el usuario se queda sin ver ninguna de sus recetas, solo un error. Con `safeParse` en cada una, las buenas se siguen viendo, la rota se descarta y sale un aviso diciendo cuántas se han ocultado. Lo malo es que una receta descartada no se puede arreglar desde la web (hay que tocar `db.json`), pero eso es un problema del servidor, no del usuario.

2. **Decisión 2: la dieta es un grupo de radios (ninguna / vegetariana / vegana) y no un checkbox de "vegetariana".**
   - **Alternativa descartada:** el checkbox *Vegetarian* que me propuso la IA al principio.
   - **Por qué tomé esta decisión:** una receta no puede ser vegetariana y vegana a la vez, así que las opciones son excluyentes y eso es justo para lo que sirven los radios. Además, con la vegana el `.refine` tiene más sentido, porque cada dieta prohíbe unos alérgenos distintos (la vegetariana no deja meter carne, pescado ni marisco, y la vegana tampoco huevos ni lactosa).

3. **Decisión 3: el formulario se oculta con `hidden` en vez de desmontarlo.**
   - **Alternativa descartada:** pintarlo solo cuando está abierto (`{abierto && <FormularioReceta />}`).
   - **Por qué tomé esta decisión:** si se desmonta, React Hook Form pierde todo lo escrito, y si alguien cierra el formulario sin querer a mitad de una receta tiene que empezar de cero. Con `hidden` sigue montado pero no se ve ni se puede llegar a él con el teclado. El precio es que el formulario existe aunque no se use, pero es un componente pequeño y no se nota.
