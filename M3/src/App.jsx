import { useState, useEffect } from 'react';
import './App.css';
import { PREGUNTAS_ORIGINALES } from './preguntas';
import { Quiz } from './components/Quiz';
import { PantallaFinal } from './components/PantallaFinal';

const barajarArray = (array) => {
  const nuevoArray = [...array];
  for (let i = nuevoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
  }
  return nuevoArray;
};

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [indicePreguntaActual, setIndicePreguntaActual] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [racha, setRacha] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    iniciarJuego();
  }, []);

  const iniciarJuego = () => {
    setPreguntas(barajarArray(PREGUNTAS_ORIGINALES));
    setIndicePreguntaActual(0);
    setPuntos(0);
    setJuegoTerminado(false);
    setRacha(0);
    setSeleccion(null);
    setMostrarResultado(false);
  };

  const manejarRespuesta = (indiceSeleccionado) => {
    if (mostrarResultado) return;

    setSeleccion(indiceSeleccionado);
    setMostrarResultado(true);

    const preguntaActual = preguntas[indicePreguntaActual];
    const esCorrecta = indiceSeleccionado === preguntaActual.respuestaCorrecta;

    setTimeout(() => {
      if (esCorrecta) {
        setPuntos(puntos + 1);
        setRacha(racha + 1);
      } else {
        setRacha(0);
      }

      const siguienteIndice = indicePreguntaActual + 1;
      if (siguienteIndice < preguntas.length) {
        setIndicePreguntaActual(siguienteIndice);
      } else {
        setJuegoTerminado(true);
      }

      setSeleccion(null);
      setMostrarResultado(false);
    }, 1500);
  };

  const porcentajeAciertos = preguntas.length > 0 ? Math.round((puntos / preguntas.length) * 100) : 0;
  
  let mensajeFinal = "¡Sigue practicando!";
  if (porcentajeAciertos === 100) mensajeFinal = "¡Perfecto! Eres un genio.";
  else if (porcentajeAciertos >= 75) mensajeFinal = "¡Muy bien hecho!";
  else if (porcentajeAciertos >= 50) mensajeFinal = "¡No está mal, aprobaste!";

  if (preguntas.length === 0) return <div>Cargando...</div>;

  return (
    <div className="app-container">
      <h1>Quiz React</h1>

      {juegoTerminado ? (
        <PantallaFinal 
          puntos={puntos}
          totalPreguntas={preguntas.length}
          porcentajeAciertos={porcentajeAciertos}
          mensajeFinal={mensajeFinal}
          reiniciarJuego={iniciarJuego}
        />
      ) : (
        <Quiz 
          preguntaActual={preguntas[indicePreguntaActual]}
          indicePreguntaActual={indicePreguntaActual}
          totalPreguntas={preguntas.length}
          racha={racha}
          mostrarResultado={mostrarResultado}
          seleccion={seleccion}
          manejarRespuesta={manejarRespuesta}
        />
      )}
    </div>
  );
}

export default App;