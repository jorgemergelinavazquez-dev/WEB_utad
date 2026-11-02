export function Quiz({ 
  preguntaActual, 
  indicePreguntaActual, 
  totalPreguntas, 
  racha, 
  mostrarResultado, 
  seleccion, 
  manejarRespuesta 
}) {
  return (
    <div className="quiz-container">
      <div className="header-info">
         <span className="progreso">Pregunta {indicePreguntaActual + 1} de {totalPreguntas}</span>
         {racha > 1 && <span className="racha">🔥 Racha: {racha}</span>}
      </div>

      <h2 className="pregunta">{preguntaActual.pregunta}</h2>

      <div className="opciones">
        {preguntaActual.opciones.map((opcion, index) => {
          let claseBoton = "btn-opcion";
          if (mostrarResultado) {
            if (index === preguntaActual.respuestaCorrecta) {
               claseBoton += " correcta";
            } else if (index === seleccion) {
               claseBoton += " incorrecta";
            }
          }

          return (
            <button
              key={index}
              className={claseBoton}
              onClick={() => manejarRespuesta(index)}
              disabled={mostrarResultado}
            >
              {opcion}
            </button>
          );
        })}
      </div>
    </div>
  );
}