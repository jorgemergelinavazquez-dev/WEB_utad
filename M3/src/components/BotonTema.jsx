// Muestra el tema al que vas a cambiar, no el que tienes puesto.
export function BotonTema({ tema, onAlternar }) {
  const siguiente = tema === 'oscuro' ? 'claro' : 'oscuro';

  return (
    <button
      type="button"
      className="boton-tema"
      onClick={onAlternar}
      aria-label={`Cambiar a tema ${siguiente}`}
      title={`Cambiar a tema ${siguiente}`}
    >
      {siguiente === 'oscuro' ? '🌙 Oscuro' : '☀️ Claro'}
    </button>
  );
}
