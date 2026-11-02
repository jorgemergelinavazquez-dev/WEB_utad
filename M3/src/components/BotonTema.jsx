// Muestra el tema al que vas a cambiar, no el que tienes puesto.
export function BotonTema({ tema, onAlternar }) {
  const siguiente = tema === 'oscuro' ? 'claro' : 'oscuro';
  const etiqueta = siguiente === 'oscuro' ? 'Dark' : 'Light';

  return (
    <button
      type="button"
      className="boton-tema"
      onClick={onAlternar}
      aria-label={`Switch to ${etiqueta.toLowerCase()} theme`}
      title={`Switch to ${etiqueta.toLowerCase()} theme`}
    >
      {siguiente === 'oscuro' ? '🌙' : '☀️'} {etiqueta}
    </button>
  );
}
