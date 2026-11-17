import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { esquemaReceta, recetaVacia } from '../schemas/receta';
import { ALERGENOS, CATEGORIAS, DIETAS, DIFICULTADES } from '../schemas/opciones';
import { crearReceta } from '../services/misRecetas';

// Ids de los elementos del formulario: "receta-nombre", "receta-nombre-error"...
const idDe = (campo) => `receta-${campo}`;
const idError = (campo) => `receta-${campo}-error`;
const idAyuda = (campo) => `receta-${campo}-ayuda`;

// aria-describedby admite varios ids separados por espacios (ayuda + error).
const describir = (...ids) => ids.filter(Boolean).join(' ') || undefined;

// Mensaje de error de un campo. role="alert" hace que el lector de pantalla lo lea en cuanto aparece.
function MensajeError({ campo, error }) {
  if (!error) return null;
  return (
    <p id={idError(campo)} className="error-campo" role="alert">
      {error.message}
    </p>
  );
}

// El asterisco es decorativo: la leyenda del formulario explica qué significa.
const Obligatorio = () => (
  <span className="obligatorio" aria-hidden="true">
    {' '}*
  </span>
);

export function FormularioReceta() {
  const queryClient = useQueryClient();

  // Formulario NO controlado: RHF lee los inputs con register, sin un useState por campo.
  // Toda la validación sale del esquema Zod (zodResolver); aquí no hay reglas sueltas.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquemaReceta),
    defaultValues: recetaVacia,
    mode: 'onTouched', // valida al salir de cada campo y, desde ahí, mientras escribes
    // shouldFocusError (true por defecto): al enviar con errores, el foco va al primer campo mal.
  });

  const guardar = useMutation({
    mutationFn: crearReceta,
    // Al guardar, la lista "My recipes" deja de estar al día: se invalida y TanStack la vuelve a pedir.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['misRecetas'] }),
  });

  // handleSubmit solo llama aquí si el esquema da el OK, y con los datos ya transformados
  // por Zod (números de verdad, ingredientes como array, textos sin espacios sobrantes).
  const enviar = (receta) => {
    guardar.mutate({ ...receta, creadaEn: new Date().toISOString() }, { onSuccess: () => reset() });
  };

  const limpiar = () => {
    reset();
    guardar.reset(); // quita también el mensaje de éxito o error anterior
  };

  // Props de accesibilidad comunes a cada campo con error.
  const aria = (campo, conAyuda = false) => ({
    'aria-invalid': !!errors[campo],
    'aria-describedby': describir(conAyuda && idAyuda(campo), errors[campo] && idError(campo)),
  });

  return (
    <section className="compartir" aria-labelledby="compartir-titulo">
      <h2 id="compartir-titulo">Share your recipe</h2>
      <p className="nota">
        Fields marked <span aria-hidden="true">*</span>
        <span className="solo-lector">with an asterisk</span> are required.
      </p>

      <form className="formulario" onSubmit={handleSubmit(enviar)} noValidate>
        <div className="campo ancho">
          <label htmlFor={idDe('nombre')}>
            Recipe name
            <Obligatorio />
          </label>
          <input id={idDe('nombre')} type="text" autoComplete="off" {...register('nombre')} {...aria('nombre')} />
          <MensajeError campo="nombre" error={errors.nombre} />
        </div>

        <div className="campo">
          <label htmlFor={idDe('email')}>
            Your email
            <Obligatorio />
          </label>
          <input id={idDe('email')} type="email" autoComplete="email" {...register('email')} {...aria('email')} />
          <MensajeError campo="email" error={errors.email} />
        </div>

        <div className="campo">
          <label htmlFor={idDe('categoria')}>
            Category
            <Obligatorio />
          </label>
          {/* deps: si cambia la categoría, se vuelve a comprobar la dieta (Beef no puede ser vegana). */}
          <select id={idDe('categoria')} {...register('categoria', { deps: ['dieta'] })} {...aria('categoria')}>
            <option value="">Choose a category…</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <MensajeError campo="categoria" error={errors.categoria} />
        </div>

        <div className="campo">
          <label htmlFor={idDe('tiempo')}>
            Prep time (minutes)
            <Obligatorio />
          </label>
          <input
            id={idDe('tiempo')}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            {...register('tiempo')}
            {...aria('tiempo')}
          />
          <MensajeError campo="tiempo" error={errors.tiempo} />
        </div>

        <div className="campo">
          <label htmlFor={idDe('raciones')}>
            Servings
            <Obligatorio />
          </label>
          <input
            id={idDe('raciones')}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            {...register('raciones')}
            {...aria('raciones')}
          />
          <MensajeError campo="raciones" error={errors.raciones} />
        </div>

        <fieldset className="campo grupo" aria-describedby={describir(errors.dificultad && idError('dificultad'))}>
          <legend>
            Difficulty
            <Obligatorio />
          </legend>
          {DIFICULTADES.map(({ valor, etiqueta }) => (
            <label key={valor} className="opcion">
              <input type="radio" value={valor} {...register('dificultad')} aria-invalid={!!errors.dificultad} />
              {etiqueta}
            </label>
          ))}
          <MensajeError campo="dificultad" error={errors.dificultad} />
        </fieldset>

        <fieldset className="campo grupo" aria-describedby={describir(errors.dieta && idError('dieta'))}>
          <legend>Diet</legend>
          {DIETAS.map(({ valor, etiqueta }) => (
            <label key={valor} className="opcion">
              {/* deps: al cambiar la dieta se revisan los alérgenos y la categoría. */}
              <input
                type="radio"
                value={valor}
                {...register('dieta', { deps: ['alergenos', 'categoria'] })}
                aria-invalid={!!errors.dieta}
              />
              {etiqueta}
            </label>
          ))}
          <MensajeError campo="dieta" error={errors.dieta} />
        </fieldset>

        <fieldset
          className="campo grupo ancho"
          aria-describedby={describir(idAyuda('alergenos'), errors.alergenos && idError('alergenos'))}
        >
          <legend>Allergens</legend>
          <p id={idAyuda('alergenos')} className="ayuda">
            Tick everything the recipe contains.
          </p>
          <div className="opciones">
            {ALERGENOS.map(({ valor, etiqueta }) => (
              <label key={valor} className="opcion">
                <input
                  type="checkbox"
                  value={valor}
                  {...register('alergenos', { deps: ['dieta'] })}
                  aria-invalid={!!errors.alergenos}
                />
                {etiqueta}
              </label>
            ))}
          </div>
          <MensajeError campo="alergenos" error={errors.alergenos} />
        </fieldset>

        <div className="campo ancho">
          <label htmlFor={idDe('ingredientes')}>
            Ingredients
            <Obligatorio />
          </label>
          <p id={idAyuda('ingredientes')} className="ayuda">
            One per line, e.g. “200 g red lentils”.
          </p>
          <textarea id={idDe('ingredientes')} rows={5} {...register('ingredientes')} {...aria('ingredientes', true)} />
          <MensajeError campo="ingredientes" error={errors.ingredientes} />
        </div>

        <div className="campo ancho">
          <label htmlFor={idDe('instrucciones')}>
            Instructions
            <Obligatorio />
          </label>
          <textarea id={idDe('instrucciones')} rows={6} {...register('instrucciones')} {...aria('instrucciones')} />
          <MensajeError campo="instrucciones" error={errors.instrucciones} />
        </div>

        <div className="campo ancho">
          <label htmlFor={idDe('imagen')}>Photo URL (optional)</label>
          <p id={idAyuda('imagen')} className="ayuda">
            A link to a photo of your dish, starting with https://
          </p>
          <input
            id={idDe('imagen')}
            type="url"
            autoComplete="url"
            {...register('imagen')}
            {...aria('imagen', true)}
          />
          <MensajeError campo="imagen" error={errors.imagen} />
        </div>

        <div className="acciones ancho">
          {/* Deshabilitado SOLO mientras se envía, nunca "hasta que sea válido". */}
          <button type="submit" disabled={guardar.isPending}>
            {guardar.isPending ? 'Saving…' : 'Share recipe'}
          </button>
          <button type="button" className="secundario" onClick={limpiar}>
            Clear form
          </button>
        </div>

        {/* Estados del envío: éxito con role="status", error del servidor con role="alert". */}
        <div className="ancho">
          {guardar.isSuccess && (
            <p className="aviso exito" role="status">
              ✅ “{guardar.data.nombre}” is now in My recipes.
            </p>
          )}
          {guardar.isError && (
            <p className="aviso fallo" role="alert">
              {guardar.error.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
