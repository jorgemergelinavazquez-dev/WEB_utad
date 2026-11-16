// Las categorías no son estado: se calculan en App a partir de la lista visible.
export function FiltroCategoria({ categorias, valor, onCambiar }) {
  return (
    <label className="filtro">
      Category
      <select value={valor} onChange={(evento) => onCambiar(evento.target.value)}>
        <option value="todas">All</option>
        {categorias.map((categoria) => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
    </label>
  );
}
