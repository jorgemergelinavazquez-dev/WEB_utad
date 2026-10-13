# M2 - Async Odyssey: Buscador de Recetas

## Qué es el proyecto
Esta es mi solución para la misión "M2 - Async Odyssey" de la asignatura de Web. Es una aplicación web construida con Vite que consume la API pública de TheMealDB para buscar recetas por nombre. Permite al usuario ver resultados en tiempo real, manejar estados de carga y error, y transforma los datos crudos de la API en una interfaz limpia.

## Cómo arrancar el proyecto
1.  Clona o descarga el repositorio en tu equipo.
2.  Abre la terminal en la carpeta raíz del proyecto.
3.  Instala las dependencias ejecutando: `npm install`
4.  Levanta el servidor de desarrollo ejecutando: `npm run dev`
5.  Abre en tu navegador la dirección local que te indique la terminal (por defecto http://localhost:5173/).

## Uso de IA
- **Qué partes hice con IA:** Utilicé Gemini para ayudarme a estructurar el proyecto según los requisitos de Módulos ES, generar el esqueleto HTML, los estilos CSS y separar la lógica en `api.js`, `transform.js` y `ui.js`.
- **Ejemplos de prompts utilizados:**
    - *"quiero ir poco a poco, empieza dandome el html"*
    - *"pasame el css entero"*
    - *"que hace el archivo transform.js, pasa arrays a json para la api?"*
- **Cómo lo verifiqué:** Revisé que el código HTML no tuviera estilos en línea (corrigiendo una versión inicial propuesta), probé localmente con `npm run dev` que la estructura de carpetas de Vite funcionara y me aseguré de entender la función de los métodos de array en `transform.js`.
- **Qué escribí a mano:** Redacté los prompts, corregí la ubicación de los archivos dentro de la carpeta `src`, e implementé y configuré el entorno local con Vite en mi máquina.

## Autopsia
1.  **Decisión 1: Separación de la lógica del DOM en `ui.js` usando `reduce`.**
    - **Alternativa descartada:** Podría haber manipulado el DOM directamente desde `main.js` usando un bucle `forEach` para crear elementos con `document.createElement()`.
    - **Por qué tomé esta decisión:** Decidí usar `reduce` en un módulo separado (`ui.js`) para construir un gran string HTML y hacer una sola inyección al DOM con `innerHTML`. Esto cumple más estrictamente el requisito de usar métodos de array (como pide la rúbrica) y mantiene `main.js` limpio y centrado solo en orquestar los eventos.

2.  **Decisión 2: Implementación de la caché local dentro de `api.js` (Reto Bonus).**
    - **Alternativa descartada:** Podría haber guardado los datos transformados en el `localStorage` desde el `main.js` después de procesarlos.
    - **Por qué tomé esta decisión:** Decidí implementar la caché en la capa de red (`api.js`), interceptando la petición antes de que se lance el fetch y guardando los datos crudos (JSON). De esta forma, la función de transformación y la UI no necesitan saber si los datos vienen de la red o de la caché, manteniendo las responsabilidades aisladas.