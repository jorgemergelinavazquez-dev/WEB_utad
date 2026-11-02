export function TarjetaReceta({ receta, esFavorita, onAbrir, onAlternarFavorita }) {
  return (
    <article className="tarjeta">
      <button type="button" className="tarjeta-abrir" onClick={() => onAbrir(receta.id)}>
        <img src={receta.imagen} alt={receta.nombre} loading="lazy" />
        <h2>{receta.nombre}</h2>
        <p>
          {receta.categoria}
          {receta.origen && ` · ${receta.origen}`}
        </p>
      </button>
      <button
        type="button"
        className={`favorita ${esFavorita ? 'marcada' : ''}`}
        onClick={() => onAlternarFavorita(receta)}
        aria-label={esFavorita ? 'Quitar de favoritas' : 'Añadir a favoritas'}
        aria-pressed={esFavorita}
      >
        {esFavorita ? '★' : '☆'}
      </button>
    </article>
  );
}
