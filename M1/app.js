// 1. Selección de elementos del DOM
const casillas = document.querySelectorAll('.casilla');
const displayPuntos = document.querySelector('#puntos');
const displayTiempo = document.querySelector('#tiempo');
const btnIniciar = document.querySelector('#btn-iniciar');
const displayRecord = document.querySelector('#record'); 

// 2. Variables de estado
let puntuacion = 0;
let tiempoRestante = 30;
let temporizadorBug = null;
let temporizadorCuentaAtras = null;
let juegoActivo = false;
let posicionActual = null;
let puntuacionMaxima = 0; 

// 3. Función para mover el bug aleatoriamente
function moverBug() {
    // Limpiar rastro anterior
    casillas.forEach(casilla => {
        casilla.classList.remove('bug-activo');
    });

    // Elegir nueva casilla
    const indiceAleatorio = Math.floor(Math.random() * 9);
    const casillaAleatoria = casillas[indiceAleatorio];

    // Pintar el bug y guardar su posición
    casillaAleatoria.classList.add('bug-activo');
    posicionActual = casillaAleatoria.id;
}

// 4. Función para actualizar el reloj
function actualizarReloj() {
    tiempoRestante--;
    displayTiempo.textContent = tiempoRestante;
    
    // Comprobar fin de partida
    if (tiempoRestante <= 0) {
        finalizarJuego();
    }
}

// 5. Función para iniciar la partida
function iniciarJuego() {
    // Reiniciar marcadores y estado
    puntuacion = 0;
    tiempoRestante = 30;
    displayPuntos.textContent = puntuacion;
    displayTiempo.textContent = tiempoRestante;
    
    juegoActivo = true;
    btnIniciar.disabled = true; // Evitar múltiples clics
    
    // Iniciar temporizadores
    temporizadorBug = setInterval(moverBug, 800);
    temporizadorCuentaAtras = setInterval(actualizarReloj, 1000);
}

// 6. Función para detener la partida
function finalizarJuego() {
    juegoActivo = false;
    
    // Detener bucles de tiempo
    clearInterval(temporizadorBug);
    clearInterval(temporizadorCuentaAtras);
    
    // Limpiar tablero
    casillas.forEach(casilla => casilla.classList.remove('bug-activo'));
    posicionActual = null;
    
    // --- NUEVA LÓGICA DEL RÉCORD ---
    // Si la puntuación actual es mayor que el récord, lo actualizamos
    if (puntuacion > puntuacionMaxima) {
        puntuacionMaxima = puntuacion;
        displayRecord.textContent = puntuacionMaxima;
    }
    
    // Reactivar botón para jugar de nuevo
    btnIniciar.disabled = false;
    
    // Mostrar puntuación final
    setTimeout(() => {
        alert(`¡Fin del tiempo! Has conseguido ${puntuacion} puntos.`);
    }, 100);
}

// 7. Eventos de clic en el tablero (lógica de aciertos y fallos)
casillas.forEach(casilla => {
    casilla.addEventListener('click', () => {
        if (!juegoActivo) return; // Si el juego no ha empezado, no hacer nada

        if (casilla.id === posicionActual) {
            // Acierto
            puntuacion++;
            casilla.classList.remove('bug-activo'); // Quitar el bug para evitar doble clic
            posicionActual = null; 
        } else {
            // Fallo (penalización)
            puntuacion -= 2; 
        }
        
        // Actualizar pantalla
        displayPuntos.textContent = puntuacion;
    });
});

// 8. Evento del botón de inicio
btnIniciar.addEventListener('click', iniciarJuego);

// 9. Bonus: Evento de teclado para activar el modo oscuro
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'n' || evento.key === 'N') {
        document.body.classList.toggle('modo-oscuro');
    }
});