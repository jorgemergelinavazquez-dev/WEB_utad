# M3 - Reactor Core: Recipe Box en React

## Qué es el proyecto
Es mi app de la misión M2 (*Async Odyssey*, el buscador de recetas con la API de [TheMealDB](https://www.themealdb.com/api.php)) rehecha en React 19 con Vite. Hace lo mismo que antes y alguna cosa más, pero ya no toco el DOM a mano: guardo el estado y React pinta lo que toca.

La web está en inglés a propósito. La API solo tiene las recetas en inglés, y si buscabas "lasaña" o "puré de calabaza" no salía nada. Con toda la interfaz en inglés se entiende desde el principio que hay que buscar en inglés.

Qué se puede hacer:
- Buscar recetas por nombre, en inglés: *chicken*, *lasagna*, *pumpkin*… Si tarda sale un mensaje de carga, y si falla o no encuentra nada también te avisa.
- Pulsar 🎲 Surprise me para que salga una receta aleatoria.
- Filtrar por categoría. Las opciones del desplegable salen de las recetas que tienes en pantalla.
- Abrir una receta para ver los ingredientes con sus cantidades y cómo se prepara. Se cierra con la ✕, pinchando fuera o con `Escape`.
- Guardar favoritas con la ★. Se quedan guardadas en `localStorage` aunque recargues.
- Repetir una búsqueda sin volver a llamar a la API, porque mantengo la caché que hice como reto extra en M2.
- Cambiar entre tema claro y oscuro con el botón de arriba a la derecha. La primera vez coge el tema del sistema operativo, y luego se acuerda de lo que elegiste.

## Cómo arrancar el proyecto
1. Clona o descarga el repositorio.
2. Abre la terminal en la carpeta `M3`.
3. Instala las dependencias con `npm install`.
4. Levanta el servidor con `npm run dev`.
5. Abre en el navegador la dirección que te dé la terminal (por defecto http://localhost:5173/).

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
    ├── BotonTema.jsx        Botón de claro / oscuro
    └── DetalleReceta.jsx    Ventana con ingredientes y preparación
```

`api.js` junta lo que en M2 eran `api.js` y `transform.js`, pero ahora solo prepara las URLs y limpia los datos. La petición la hace el hook `useFetch`.

## Estado y efectos
En `App` solo guardo lo que decide el usuario: qué ha buscado (`peticion`), en qué pestaña está (`vista`), la categoría elegida, qué receta tiene abierta (`idAbierta`), sus favoritas y el tema. Todo lo demás lo calculo en el render cada vez: la URL, la lista ya transformada, las categorías, la lista filtrada y la receta abierta. Hasta el "cargando" sale de ahí (lo explico en la Autopsia).

Hay cinco `useEffect` y los cinco hablan con algo de fuera de React:
1. En `useFetch`, la petición a la API. Lleva limpieza con `AbortController`, así que si buscas dos cosas seguidas la respuesta de la primera no pisa a la segunda.
2. En `useLocalStorage`, guardar el valor cada vez que cambia.
3. En `DetalleReceta`, escuchar la tecla `Escape`. Al cerrar la ventana quito el listener.
4. En `App`, poner la búsqueda en el título de la pestaña del navegador.
5. En `App`, poner el tema como atributo `data-tema` en `<html>`. Los colores son variables CSS, así que con cambiar ese atributo cambia toda la página sin que ningún componente tenga que saber qué tema hay puesto.

Como keys de las listas uso el `idMeal` de cada receta, el nombre de la categoría y la posición del ingrediente dentro de la receta (va del 1 al 20 en la API). En ningún sitio uso el índice del `map`. Tampoco muto nada: las favoritas se actualizan con `filter` o con *spread*, y las categorías se ordenan sobre una copia.

Para el bonus he sacado dos custom hooks, `useFetch` y `useLocalStorage`. Los dos se pueden usar tal cual en otra app.

## Uso de IA
- **Qué pedí:** le pedí a Claude que pasara mi buscador de recetas de M2 a React siguiendo la rúbrica, aprovechando mi `api.js` y mi `transform.js`. Después le fui pidiendo cambios según probaba la app. (El primer commit de esta rama tiene un quiz de otro ejercicio que subí por error. Lo borré en el siguiente commit.)
- **Ejemplos de prompts utilizados:**
    - *"Quiero que cambies dos cosas. Que, por un lado, los colores no sean negro y amarillo, porque son horribles. Haz algo más neutro. Y además quiero que tenga un botón para cambiar entre claro y oscuro."*
    - *"vale, como la api esta en ingles, quiero que la web tmb este en incgles asi se intuye desde el principio que tienes que escribir en ingles"*
- **Cómo lo verifiqué:** se probó en el navegador con respuestas de la API simuladas: búsqueda, filtro, abrir y cerrar la receta (también con `Escape`), favoritas después de recargar, caché, búsqueda sin resultados, error del servidor, cambio de tema y vista de móvil. Luego la arranqué yo con `npm run dev` y probé búsquedas reales. Al buscar "lasaña" o "puré de calabaza" no salía nada, y así me di cuenta de que la API solo funciona en inglés. Por eso pedí poner la web en inglés.
- **Qué escribí a mano:** *(completar: lo que hayas cambiado o escrito tú)*

## Autopsia
1. **Decisión 1: `cargando` se calcula, no tiene su propio estado.**
   - **Alternativa descartada:** el `useFetch` de siempre, con tres `useState` (`datos`, `cargando` y `error`) y un `setCargando(true)` al principio del efecto.
   - **Por qué tomé esta decisión:** con tres estados pueden quedar descuadrados entre sí, y cambiar el estado dentro del efecto provoca un render de más. Lo que hago es guardar junto a la respuesta la URL de la que viene. Si no coincide con la URL actual es que todavía está cargando. Me ahorro un estado y no hay forma de que se desincronice.

2. **Decisión 2: las favoritas se guardan enteras, no solo su id.**
   - **Alternativa descartada:** guardar solo los `id` en `localStorage` y pedir cada receta a la API (`lookup.php`) al entrar en la pestaña de favoritas.
   - **Por qué tomé esta decisión:** así las favoritas salen al momento y funcionan sin conexión, y no necesito otro `useEffect` lanzando una petición por cada una. Lo malo es que si una receta cambia en la API, la copia guardada no se actualiza. Pero si al final guardaste la receta en favoritos es porque te gusto la version anterior y no me parece un problema.
