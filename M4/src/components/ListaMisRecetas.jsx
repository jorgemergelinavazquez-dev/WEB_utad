import { useQuery } from '@tanstack/react-query';
import { obtenerMisRecetas } from '../services/misRecetas';
import { ALERGENOS, DIETAS, DIFICULTADES, etiquetaDe } from '../schemas/opciones';

// Solo pintamos imágenes con http(s): nunca un "javascript:" ni algo raro venido del servidor.
const esUrlWeb = (url) => typeof url === 'string' && /^https?:\/\//i.test(url);

const formatoFecha = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fechaLegible = (iso) => {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? null : formatoFecha.format(fecha);
};

function TarjetaMiReceta({ receta }) {
  const fecha = fechaLegible(receta.creadaEn);

  return (
    <article className="mi-receta">
      {esUrlWeb(receta.imagen) ? (
        <img src={receta.imagen} alt={receta.nombre} loading="lazy" />
      ) : (
        <div className="sin-foto" aria-hidden="true">
          🍲
        </div>
      )}

      <div className="mi-receta-cuerpo">
        <h3>{receta.nombre}</h3>
        <p className="meta">
          {receta.categoria} · {etiquetaDe(DIFICULTADES, receta.dificultad)} · {receta.tiempo} min ·{' '}
          {receta.raciones} {receta.raciones === 1 ? 'serving' : 'servings'}
        </p>

        {receta.dieta !== 'none' && <p className="sello">🌱 {etiquetaDe(DIETAS, receta.dieta)}</p>}

        {receta.alergenos.length > 0 ? (
          <ul className="chips" aria-label="Allergens">
            {receta.alergenos.map((alergeno) => (
              <li key={alergeno}>{etiquetaDe(ALERGENOS, alergeno)}</li>
            ))}
          </ul>
        ) : (
          <p className="ayuda">No allergens listed.</p>
        )}

        {/* <details> se abre y cierra con teclado sin JavaScript. */}
        <details>
          <summary>Ingredients ({receta.ingredientes.length})</summary>
          <ul className="lista-simple">
            {receta.ingredientes.map((ingrediente, i) => (
              <li key={i}>{ingrediente}</li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Instructions</summary>
          <p className="instrucciones">{receta.instrucciones}</p>
        </details>

        {fecha && <p className="pie">Shared on {fecha}</p>}
      </div>
    </article>
  );
}

// "accion" es el botón de la cabecera y "children" lo que va entre la cabecera y la lista (el formulario).
export function ListaMisRecetas({ accion, children }) {
  // Misma clave que invalida el formulario al guardar: así la lista se actualiza sola.
  const misRecetas = useQuery({
    queryKey: ['misRecetas'],
    queryFn: ({ signal }) => obtenerMisRecetas(signal),
    // select transforma lo que ve el componente sin tocar la caché: las más nuevas primero.
    select: (recetas) => recetas.toSorted((a, b) => String(b.creadaEn).localeCompare(String(a.creadaEn))),
  });

  const total = misRecetas.data?.length;

  return (
    <section className="mis-recetas" aria-labelledby="mis-recetas-titulo" aria-busy={misRecetas.isFetching}>
      <div className="mis-recetas-cabecera">
        <h2 id="mis-recetas-titulo">My recipes{total ? ` (${total})` : ''}</h2>
        {/* Se ve tras guardar: es la invalidación volviendo a pedir la lista. */}
        {misRecetas.isFetching && !misRecetas.isPending && (
          <span className="actualizando" role="status">
            Updating…
          </span>
        )}
        {accion}
      </div>

      {children}

      {misRecetas.isPending && (
        <p className="estado" role="status">
          Loading your recipes… ⏳
        </p>
      )}

      {misRecetas.isError && (
        <p className="estado error" role="alert">
          {misRecetas.error.message}{' '}
          <button type="button" className="secundario" onClick={() => misRecetas.refetch()}>
            Try again
          </button>
        </p>
      )}

      {misRecetas.isSuccess && total === 0 && (
        <p className="estado">No recipes yet. Share your first one above! 👆</p>
      )}

      {misRecetas.isSuccess && total > 0 && (
        <div className="rejilla">
          {misRecetas.data.map((receta) => (
            <TarjetaMiReceta key={receta.id} receta={receta} />
          ))}
        </div>
      )}
    </section>
  );
}
