const PESTANAS = [
  { id: 'resultados', texto: 'Resultados' },
  { id: 'favoritas', texto: '★ Favoritas' },
];

export function Pestanas({ vista, totalFavoritas, onCambiar }) {
  return (
    <nav className="pestanas">
      {PESTANAS.map((pestana) => (
        <button
          key={pestana.id}
          type="button"
          className={pestana.id === vista ? 'activa' : ''}
          aria-pressed={pestana.id === vista}
          onClick={() => onCambiar(pestana.id)}
        >
          {pestana.texto}
          {pestana.id === 'favoritas' && ` (${totalFavoritas})`}
        </button>
      ))}
    </nav>
  );
}
