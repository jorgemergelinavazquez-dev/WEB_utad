export function PantallaFinal({ 
  puntos, 
  totalPreguntas, 
  porcentajeAciertos, 
  mensajeFinal, 
  reiniciarJuego 
}) {
  return (
    <div className="pantalla-final">
      <h2>¡Juego Terminado!</h2>
      <p>Has acertado {puntos} de {totalPreguntas} preguntas.</p>
      <p>Porcentaje: {porcentajeAciertos}%</p>
      <p className="mensaje-final">{mensajeFinal}</p>
      <button onClick={reiniciarJuego} className="btn-reiniciar">Reiniciar Quiz</button>
    </div>
  );
}