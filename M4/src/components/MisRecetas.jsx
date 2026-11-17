import { useRef, useState } from 'react';
import { FormularioReceta } from './FormularioReceta';
import { ListaMisRecetas } from './ListaMisRecetas';

// Vista "My recipes": el listado siempre a la vista y el formulario desplegable.
export function MisRecetas() {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef(null);

  // Al cerrar, el foco vuelve al botón (si no, quien usa teclado se "pierde").
  const cerrar = () => {
    setAbierto(false);
    boton.current?.focus();
  };

  const accion = (
    <button
      ref={boton}
      type="button"
      className="boton-principal"
      aria-expanded={abierto}
      aria-controls="compartir"
      onClick={() => (abierto ? cerrar() : setAbierto(true))}
    >
      {abierto ? '✕ Close form' : '+ Add recipe'}
    </button>
  );

  return (
    <ListaMisRecetas accion={accion}>
      {/* Se oculta con "hidden" en vez de desmontarlo: así no se pierde lo que ya estaba escrito. */}
      <FormularioReceta abierto={abierto} onCerrar={cerrar} />
    </ListaMisRecetas>
  );
}
