# M3 · Reactor Core: Recetario en React

Reconstrucción en **React 19 + Vite** de mi app de la misión M2 (*Async Odyssey: buscador de recetas* con la API pública de [TheMealDB](https://www.themealdb.com/api.php)). La lógica es la misma, pero ahora la interfaz reacciona al estado en lugar de manipular el DOM a mano.

## Qué hace

- **Buscar recetas** por nombre (en inglés: *chicken*, *pasta*, *cake*…), con mensajes de carga, error y "sin resultados".
- **🎲 Sorpréndeme**: trae una receta aleatoria para cuando no sabes qué cocinar.
- **Filtro por categoría**: las opciones salen de las recetas que estás viendo.
- **Detalle de la receta** con ingredientes, cantidades y preparación. Se cierra con ✕, haciendo clic fuera o con la tecla `Escape`.
- **Favoritas ★**: se guardan en `localStorage` y siguen ahí al recargar la página.
- **Caché de búsquedas**: repetir una búsqueda no vuelve a llamar a la API (la mejora extra de M2, ahora dentro del hook `useFetch`).

## Cómo arrancarlo

```bash
cd M3
npm install
npm run dev
```

Abre la dirección que indique la terminal (por defecto http://localhost:5173/).

## Estructura

```
src/
├── main.jsx                 Punto de entrada
├── App.jsx                  Estado de la app y composición de componentes
├── api.js                   URLs de TheMealDB y transformación de los datos
├── hooks/
│   ├── useFetch.js          Hook reutilizable: petición + caché + cancelación
│   └── useLocalStorage.js   Hook reutilizable: useState que persiste
└── components/
    ├── Buscador.jsx         Formulario (controla su propio texto)
    ├── Pestanas.jsx         Resultados / Favoritas
    ├── FiltroCategoria.jsx  Select de categorías
    ├── ListaRecetas.jsx     Rejilla o mensaje si está vacía
    ├── TarjetaReceta.jsx    Una receta + botón de favorita
    └── DetalleReceta.jsx    Ventana con ingredientes y preparación
```

### Cómo se aplica lo que pide la rúbrica

- **Estado mínimo:** `App` solo guarda lo que decide el usuario (`peticion`, `vista`, `categoria`, `idAbierta` y `favoritas`). La URL, la lista transformada, las categorías, la lista filtrada y la receta abierta se **calculan en el render**.
- **`cargando` también es derivado:** `useFetch` guarda a qué URL pertenece la última respuesta. Si no coincide con la URL actual, está cargando.
- **Efectos solo para sistemas externos, todos con su motivo:**
  1. `useFetch`: petición a la API, con **limpieza** (`AbortController`) para que una respuesta antigua no pise a la nueva.
  2. `useLocalStorage`: escribir en `localStorage` cuando cambia el valor.
  3. `DetalleReceta`: escuchar la tecla `Escape`, con **limpieza** del listener al cerrar.
  4. `App`: sincronizar `document.title` con la búsqueda.
- **Keys estables:** `receta.id` (el `idMeal` de la API), el nombre de la categoría y la posición fija del ingrediente en la receta (de 1 a 20). Nunca el índice del `map`.
- **Cero mutaciones:** las favoritas se actualizan con `filter` o con *spread*, y las categorías se ordenan sobre una copia (`[...new Set(...)]`).
- **Bonus:** dos custom hooks reutilizables, `useFetch` y `useLocalStorage`.

## Uso de IA

- **Qué pedí:** usé Claude Code para generar una primera versión en React. Como no correspondía a mi app de M2, después le pedí a Claude que revisara el código frente a la rúbrica y que reconstruyera mi buscador de recetas de M2 en React, reaprovechando `api.js` y `transform.js`.
- **Cómo lo verifiqué:** la app se probó en el navegador con respuestas simuladas de la API. Se comprobaron la búsqueda, el filtro, la apertura y el cierre del detalle (también con `Escape`), las favoritas tras recargar, la caché, el mensaje sin resultados, el error del servidor y la vista en móvil. *(completar: cuando la arranques con `npm run dev` y pruebes búsquedas reales, añádelo aquí)*
- **Qué escribí a mano:** *(completar: lo que hayas cambiado o escrito tú)*

## Autopsia

1. **`cargando` derivado en lugar de tener su propio estado.**
   - **Alternativa descartada:** el `useFetch` clásico, con tres `useState` (`datos`, `cargando`, `error`) y un `setCargando(true)` al principio del efecto.
   - **Por qué:** así habría estado duplicado que puede desincronizarse, y además se actualiza el estado de forma síncrona dentro del efecto, lo que provoca un render extra. Guardando a qué URL pertenece la respuesta, "cargando" es simplemente "la respuesta no es de esta URL". Es la idea de *estado mínimo, valores derivados* aplicada al hook.

2. **Favoritas guardadas como objetos completos, no solo como ids.**
   - **Alternativa descartada:** guardar solo los `id` en `localStorage` y pedir cada receta a la API (`lookup.php`) al abrir la pestaña de favoritas.
   - **Por qué:** con objetos completos, las favoritas funcionan sin red y al instante, y no hace falta otro `useEffect` con varias peticiones. El precio es que una favorita guardada no se actualiza si la receta cambia en la API. Para un recetario personal, me parece un intercambio razonable.
