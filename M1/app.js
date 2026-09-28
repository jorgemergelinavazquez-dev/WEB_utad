// 1. Seleccionamos todas las casillas del tablero
const casillas = document.querySelectorAll('.casilla');

// Variables de estado para saber dónde está el bug y controlar el tiempo
let posicionActual = null;
let temporizadorBug = null;

// 2. Función principal de movimiento
function moverBug() {
    // Limpiamos la clase 'bug-activo' de todas las casillas iterando sobre ellas
    casillas.forEach(casilla => {
        casilla.classList.remove('bug-activo');
    });

    // Generamos un número aleatorio entre 0 y 8 (los índices de nuestras 9 casillas)
    const indiceAleatorio = Math.floor(Math.random() * 9);
    const casillaAleatoria = casillas[indiceAleatorio];

    // Le añadimos la clase que muestra el bicho al elemento seleccionado
    casillaAleatoria.classList.add('bug-activo');

    // Guardamos el id de esta casilla en el estado para poder comprobar los aciertos luego
    posicionActual = casillaAleatoria.id;
}

// 3. Función para arrancar el bucle temporal
function iniciarJuego() {
    // Ejecuta moverBug cada 800 milisegundos
    temporizadorBug = setInterval(moverBug, 800);
}

// Llamamos a la función directamente para probar esta fase
iniciarJuego();

// 1. Seleccionamos el elemento del DOM donde mostraremos los puntos
const displayPuntos = document.querySelector('#puntos');
let puntuacion = 0; // Nueva variable de estado para guardar los puntos

// 2. Añadimos el evento de clic a cada una de las casillas
casillas.forEach(casilla => {
    casilla.addEventListener('click', () => {
        
        // 3. Comprobamos si la casilla en la que hemos hecho clic es la que tiene el bug
        if (casilla.id === posicionActual) {
            // Sumamos un punto
            puntuacion++;
            
            // 4. Actualizamos el texto en el HTML
            displayPuntos.textContent = puntuacion;
            
            // 5. Quitamos el bug inmediatamente para que el jugador no pueda 
            // hacer doble clic y sumar más puntos en la misma aparición
            casilla.classList.remove('bug-activo');
            posicionActual = null; 
        }
    });
});