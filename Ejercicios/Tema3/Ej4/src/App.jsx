import { useState } from 'react'

function Aplausometro() {
  // Pregunta trampa: basta un useState. El mensaje se calcula a partir
  // del contador en cada render, así que guardarlo sería estado redundante.
  const [aplausos, setAplausos] = useState(0)

  let mensaje = 'Tímido…'
  if (aplausos >= 15) {
    mensaje = '¡OVACIÓN TOTAL! 🎉'
  } else if (aplausos >= 5) {
    mensaje = '¡Se anima la sala!'
  }

  return (
    <section>
      <p>{aplausos}</p>
      <p>{mensaje}</p>
      <button onClick={() => setAplausos((a) => a + 1)}>👏 Aplaudir</button>
      <button onClick={() => setAplausos(0)}>Reiniciar</button>
    </section>
  )
}

export default function App() {
  return <Aplausometro />
}
