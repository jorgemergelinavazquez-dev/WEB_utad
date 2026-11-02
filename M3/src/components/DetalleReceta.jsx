import { useEffect } from 'react';

export function DetalleReceta({ receta, esFavorita, onAlternarFavorita, onCerrar }) {
  // Escuchar el teclado es un sistema externo a React: efecto con limpieza,
  // para no dejar el listener vivo cuando se cierra el detalle.
  useEffect(() => {
    const alPulsarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', alPulsarTecla);
    return () => window.removeEventListener('keydown', alPulsarTecla);
  }, [onCerrar]);

  return (
    <div className="fondo-modal" onClick={onCerrar}>
      <article
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={receta.nombre}
        onClick={(evento) => evento.stopPropagation()}
      >
        <button type="button" className="cerrar" onClick={onCerrar} aria-label="Close">
          ✕
        </button>
        <img src={receta.imagen} alt={receta.nombre} />
        <h2>{receta.nombre}</h2>
        <p className="meta">
          {receta.categoria}
          {receta.origen && ` · ${receta.origen}`}
        </p>
        <button type="button" className="secundario" onClick={() => onAlternarFavorita(receta)}>
          {esFavorita ? '★ Remove from favorites' : '☆ Save to favorites'}
        </button>

        <h3>Ingredients ({receta.ingredientes.length})</h3>
        <ul className="ingredientes">
          {receta.ingredientes.map((ingrediente) => (
            <li key={ingrediente.posicion}>
              <span>{ingrediente.nombre}</span>
              <span>{ingrediente.medida}</span>
            </li>
          ))}
        </ul>

        <h3>Instructions</h3>
        <p className="instrucciones">{receta.instrucciones}</p>
      </article>
    </div>
  );
}
