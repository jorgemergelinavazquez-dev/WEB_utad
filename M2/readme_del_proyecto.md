# Async Odyssey - Buscador de Recetas

Este proyecto es la entrega para la misión **M2 - ASYNC ODYSSEY**. Es una aplicación web construida con Vite que permite buscar recetas consumiendo la API pública de TheMealDB. 

El objetivo principal es demostrar el manejo de asincronía (`fetch` + `async/await`), la manipulación de arrays (`map`, `filter`, `reduce`) y la correcta separación del código en Módulos ES, incluyendo el manejo de estados de carga y error. Además, incluye una caché local para optimizar las peticiones (Reto Bonus).

## 🚀 Cómo arrancar el proyecto

1. Clona este repositorio o descarga los archivos.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias ejecutando: `npm install`
4. Arranca el servidor de desarrollo de Vite ejecutando: `npm run dev`

## 🤖 Uso de IA

Para el desarrollo de esta misión, he utilizado el asistente de IA Gemini como apoyo.

*   **¿Qué partes hice con IA?** La estructuración inicial del HTML y la separación lógica en módulos ES (`api.js`, `transform.js`, `ui.js`, `main.js`). También me apoyé en la IA para implementar el reto bonus del `localStorage` de manera limpia.
*   **Prompt real relevante utilizado:** *"Crea una aplicación (con Vite) que consuma una API pública real (TheMealDB) usando fetch + async/await, módulos ES y métodos de array. [...] quiero ir poco a poco, empieza dándome el html"*
*   **Cómo verifiqué lo generado:** Revisé que cada módulo exportara e importara correctamente las funciones, asegurándome de que el `try/catch` de `api.js` funcionara provocando un error intencionado en la URL, y comprobé mediante el inspector del navegador (Application > Local Storage) que la caché se estaba guardando correctamente.
*   **Qué escribí a mano:** La inicialización del proyecto con Vite, la configuración de los repositorios y las adaptaciones del código de la IA para que encajara con mis nombres de variables y estilos preferidos.

## 🔪 Autopsia

A continuación, detallo las 2 decisiones más discutibles del código y sus alternativas:

1.  **Decisión:** Separar la transformación de datos (`transform.js`) de la generación del HTML (`ui.js`).
    *   **Por qué es discutible:** Para una aplicación tan pequeña, podría parecer excesivo tener un archivo solo para hacer un `map` y un `filter`, añadiendo complejidad a los imports.
    *   **Alternativa descartada:** Hacer el `map/filter` directamente dentro de `main.js` justo antes de llamar a la función de pintar. Lo descarté porque separar la capa de datos de la capa de vista hace que el código sea mucho más escalable e independiente, cumpliendo mejor el objetivo de "responsabilidades definidas" de la rúbrica.

2.  **Decisión:** Guardar en `localStorage` los datos "crudos" tal y como vienen de la API en el archivo `api.js`, antes de transformarlos.
    *   **Por qué es discutible:** Ocupa más espacio en la memoria del navegador guardar todos los datos de la API en lugar de guardar solo los 5 campos que extraigo en `transform.js`.
    *   **Alternativa descartada:** Guardar en caché el array ya procesado dentro de `main.js`. Lo descarté porque al encapsular la caché directamente en `api.js`, evito que el resto de la aplicación "sepa" que existe una caché. Además, si en el futuro decido mostrar más datos de la receta, ya los tendré guardados sin necesidad de borrar la caché existente.