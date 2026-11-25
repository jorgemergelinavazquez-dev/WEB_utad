function FichaTripulante({ nombre, rol, especie = 'humana' }) {
  return (
    <article>
      <h2>{nombre}</h2>
      <p>Rol: {rol}</p>
      <p>Especie: {especie}</p>
    </article>
  )
}

export default function App() {
  return (
    <main>
      <FichaTripulante nombre="Vega" rol="Capitana" />
      <FichaTripulante nombre="Zorg" rol="Piloto" especie="marciana" />
      <FichaTripulante nombre="Kai" rol="Mecánico" especie="androide" />
      <FichaTripulante nombre="Nova" rol="Médica" especie="venusiana" />
    </main>
  )
}
