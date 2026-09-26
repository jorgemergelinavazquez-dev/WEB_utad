// funcion proporcionada
const secreto = Math.floor(Math.random() * 100) + 1;
console.log("(psst... el secreto es", secreto, ")");

// Fase 1: Conexión - selecciona input, botón y párrafos usando querySelector
const input = document.querySelector('#numero-input');
const boton = document.querySelector('#adivinar-btn');
const mensaje = document.querySelector('#mensaje-texto');
const marcador = document.querySelector('#marcador-texto');

// Fase 4: El marcador visible en pantalla (declaramos con let)
let intentos = 0;

// Fase 2: Primera consulta - evento click
boton.addEventListener('click', function() {
    
    // Lee el valor del input
    const valorOriginal = input.value;
    
    // Fase 3: Valor vacío - aviso sin gastar intento
    if (valorOriginal === '') {
        mensaje.textContent = 'El oráculo dice: ¡No has introducido ningún valor!';
        return; // Salimos de la función aquí para no contar el intento
    }

    // Convertimos a número usando Number()
    const numero = Number(valorOriginal);

    // Fase 3: Fuera de 1-100 - aviso sin gastar intento
    if (numero < 1 || numero > 100) {
        mensaje.textContent = 'El oráculo dice: El número debe estar entre 1 y 100.';
        return; 
    }

    // Si llegamos aquí, el número es válido. Sumamos un intento y lo mostramos (Fase 4)
    intentos = intentos + 1;
    // Usamos Template Literals (las comillas invertidas ``) para poder printerar variables y texto juntos
    marcador.textContent = `Intentos: ${intentos}`;

    // Fase 3: El oráculo responde (mayor / menor / correcto) usando condicionales y ===
    if (numero === secreto) {
        mensaje.textContent = `¡Correcto! El número era el ${secreto}.`;
        
        // Fase 5: Fin de partida - al acertar, desactivamos el botón
        boton.disabled = true;
    } else if (numero < secreto) {
        mensaje.textContent = `El número secreto es MAYOR que ${numero}.`;
    } else if (numero > secreto) {
        mensaje.textContent = `El número secreto es MENOR que ${numero}.`;
    }
    
    // Opcional: vaciar el input para la siguiente jugada
    input.value = '';
});