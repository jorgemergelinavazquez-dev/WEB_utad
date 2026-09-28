# Caza al Bug
Misión M1 El Despertar del DOM - Web Development I.

## Cómo probarlo
Abre `index.html` en el navegador (o con Live Server). Pulsa el botón "Iniciar Partida": tienes 30 segundos para cazar los bugs haciendo clic sobre ellos. 
* Mecánica de puntuación: Cada acierto suma 1 punto, pero fallar y hacer clic en una casilla vacía resta 2 puntos. 
* Récord: La puntuación máxima se guarda mientras no recargues la pestaña.
* Tecla secreta: Pulsa "n" en tu teclado en cualquier momento para activar el modo oscuro.

## Uso de IA
He utilizado Gemini como asistente de programación, trabajando de forma iterativa y dividiendo la construcción del proyecto en 5 fases manejables (HTML base, movimiento aleatorio, eventos de clic, temporizador y bonus extra). 

Ejemplo de prompt real utilizado: "haz la parte 5, quiero que ademas añadas que si el jugador pulsa donde no esta el bug le quites 2 puntos".

Verifiqué cada cambio probando el juego en el navegador al final de cada fase, asegurándome mediante comprobaciones visuales de que la lógica de tiempo y puntuación funcionaba antes de avanzar a la siguiente característica. Modifiqué y ajusté manualmente los selectores y la lógica de estado de variables como `puntuacionMaxima` para integrarlas con el flujo que ya tenía construido.

## Autopsia
1. **Penalización por fallo y validación de estado:** He implementado una resta de 2 puntos si se hace clic en una casilla vacía, y he envuelto la lógica del clic en un `if (!juegoActivo) return;`. Descarté la alternativa de simplemente sumar puntos al acertar sin penalizar, porque eso permitía al usuario hacer "spam" de clics rápidamente por toda la cuadrícula para ganar puntos sin apuntar. Además, validar el estado `juegoActivo` evita bugs donde el jugador podría seguir sumando puntos si el bug se quedaba en pantalla tras acabar el tiempo.
2. **Gestión del Récord (Estado persistente):** Decidí declarar la variable `puntuacionMaxima` en el ámbito global del script y actualizarla solo dentro de la función `finalizarJuego()`, sin reiniciarla nunca en `iniciarJuego()`. Descarté usar `localStorage` para esta entrega inicial al buscar una solución nativa basada únicamente en el ciclo de vida de la ejecución del script en memoria, manteniendo la separación clara entre variables que deben reiniciarse por partida y variables persistentes en la sesión.
3. **Delegación del evento de teclado:** Para el bonus del modo oscuro, he añadido el `addEventListener` del evento `keydown` directamente sobre el objeto global `document`, utilizando `classList.toggle('modo-oscuro')` en el `body`. Descarté asociar el cambio a un botón de la interfaz visual con un `if/else` para comprobar clases, ya que el requerimiento pedía una "tecla secreta" y `toggle` hace que el código sea mucho más limpio y directo.
