import { TarjetaReceta } from './TarjetaReceta';

export function ListaRecetas({ recetas, idsFavoritas, mensajeVacio, onAbrir, onAlternarFavorita }) {
  if (recetas.length === 0) {
    return <p className="estado">{mensajeVacio}</p>;
  }

  return (
    <section className="rejilla">
      {recetas.map((receta) => (
        <TarjetaReceta
          key={receta.id}
          receta={receta}
          esFavorita={idsFavoritas.has(receta.id)}
          onAbrir={onAbrir}
          onAlternarFavorita={onAlternarFavorita}
        />
      ))}
    </section>
  );
}
