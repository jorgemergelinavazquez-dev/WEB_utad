//  Seleccionamos todas las casillas del tablero
const casillas = document.querySelectorAll('.casilla');

// Variables de estado para saber dónde está el bug y controlar el tiempo
let posicionActual = null;
let temporizadorBug = null;

// constantes sobre el tiempo y estado de partida
const displayTiempo = document.querySelector('#tiempo');
const btnIniciar = document.querySelector('#btn-iniciar');

// Nuevas variables de estado para el tiempo y el control del juego
let tiempoRestante = 30;
let temporizadorCuentaAtras = null;
let juegoActivo = false;

//  Función principal de movimiento
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

//  Función para arrancar el bucle temporal
function iniciarJuego() {
    // Reiniciamos los marcadores por si es la segunda partida
    puntuacion = 0;
    tiempoRestante = 30;
    displayPuntos.textContent = puntuacion;
    displayTiempo.textContent = tiempoRestante;
    
    // Cambiamos el estado y bloqueamos el botón para que no se pulse varias veces
    juegoActivo = true;
    btnIniciar.disabled = true;
    
    // Arrancamos el salto del bug (como en la fase 2) y el reloj
    temporizadorBug = setInterval(moverBug, 800);
    temporizadorCuentaAtras = setInterval(actualizarReloj, 1000);
}

//  Función para ir restando segundos
function actualizarReloj() {
    tiempoRestante--;
    displayTiempo.textContent = tiempoRestante;
    
    // Comprobamos si se ha acabado el tiempo
    if (tiempoRestante <= 0) {
        finalizarJuego();
    }
}

//  Función para detener todo
function finalizarJuego() {
    juegoActivo = false;
    
    // clearInterval detiene los bucles temporales usando la variable donde los guardamos
    clearInterval(temporizadorBug);
    clearInterval(temporizadorCuentaAtras);
    
    // Limpiamos el tablero
    casillas.forEach(casilla => casilla.classList.remove('bug-activo'));
    posicionActual = null;
    
    // Volvemos a activar el botón por si quiere jugar otra vez
    btnIniciar.disabled = false;
    
    // Un pequeño aviso visual de fin de partida
    setTimeout(() => {
        alert(`¡Fin del tiempo! Has cazado ${puntuacion} bugs.`);
    }, 100);
}

//  Enganchamos el evento al botón
btnIniciar.addEventListener('click', iniciarJuego);

// Llamamos a la función directamente para probar esta fase
iniciarJuego();

//Seleccionamos el elemento del DOM donde mostraremos los puntos
const displayPuntos = document.querySelector('#puntos');
let puntuacion = 0; // Nueva variable de estado para guardar los puntos

//Añadimos el evento de clic a cada una de las casillas
casillas.forEach(casilla => {
    casilla.addEventListener('click', () => {
        
        //Comprobamos si la casilla en la que hemos hecho clic es la que tiene el bug
        if (casilla.id === posicionActual) {
            // Sumamos un punto
            puntuacion++;
            
            //Actualizamos el texto en el HTML
            displayPuntos.textContent = puntuacion;
            
            // Quitamos el bug inmediatamente para que el jugador no pueda 
            // hacer doble clic y sumar más puntos en la misma aparición
            casilla.classList.remove('bug-activo');
            posicionActual = null; 
        }
    });
});