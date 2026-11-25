const RANKING = [
  { id: "a1", jugador: "NOVA", puntos: 9800 },
  { id: "b2", jugador: "PIXEL", puntos: 8650 },
  { id: "c3", jugador: "KIRA", puntos: 7400 },
  { id: "d4", jugador: "BYTE", puntos: 5200 },
];

function Ranking({ jugadores }) {
  return (
    <ol>
      {jugadores.map(({ id, jugador, puntos }) => (
        <li key={id}>
          {jugador} — {puntos} {puntos > 8000 && '🏅'}
        </li>
      ))}
    </ol>
  )
}

export default function App() {
  return <Ranking jugadores={RANKING} />
}
