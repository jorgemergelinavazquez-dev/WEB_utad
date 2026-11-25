function Esclusa({ abierta, avisos }) {
  return (
    <article>
      <p>{abierta ? '🟢 Esclusa abierta' : '🔴 Esclusa cerrada'}</p>
      {/* Con "avisos &&", si avisos es 0 la expresión vale 0 y React pinta ese 0.
          "avisos > 0" vale false, y false no se pinta. */}
      {avisos > 0 && <p>⚠️ Tienes {avisos} avisos pendientes</p>}
    </article>
  )
}

export default function App() {
  return (
    <main>
      <Esclusa abierta={true} avisos={2} />
      <Esclusa abierta={false} avisos={0} />
      <Esclusa abierta={true} avisos={0} />
    </main>
  )
}
