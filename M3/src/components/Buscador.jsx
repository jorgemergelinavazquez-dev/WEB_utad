import { useState } from 'react';

// El texto que se está escribiendo solo le importa a este componente,
// así que su estado vive aquí. A App solo le llega al pulsar "Buscar".
export function Buscador({ onBuscar, onSorpresa }) {
  const [texto, setTexto] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    const limpio = texto.trim();
    if (limpio) onBuscar(limpio);
  };

  return (
    <form className="buscador" onSubmit={enviar}>
      <input
        type="search"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder="e.g. chicken, pasta, cake…"
        aria-label="Dish name"
      />
      <button type="submit">Search</button>
      <button type="button" className="secundario" onClick={onSorpresa}>
        🎲 Surprise me
      </button>
    </form>
  );
}
