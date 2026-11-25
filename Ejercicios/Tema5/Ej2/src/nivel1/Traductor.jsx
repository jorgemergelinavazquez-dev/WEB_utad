export default function Traductor() {
  return (
    <main>
      {/* margin-inline: auto; max-width: 28rem; border-radius: 1rem;
          background-color: white; padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); */}
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg">Tarjeta</div>

      {/* font-size: 0.875rem (con line-height de 1.25rem); font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.025em; color: gris medio; */}
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Texto pequeño</p>

      {/* display: flex; flex-direction: column; gap: 0.5rem;
          @media (min-width: 48rem) { flex-direction: row; align-items: center; } */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <span>Uno</span>
        <span>Dos</span>
      </div>

      {/* width: 4rem; height: 4rem; border-radius: 9999px (círculo); object-fit: cover;
          box-shadow: 0 0 0 2px verde esmeralda; (el ring es una sombra, no un borde) */}
      <img
        className="size-16 rounded-full object-cover ring-2 ring-emerald-400"
        src="/favicon.svg"
        alt="Logo"
      />

      {/* color: azul al 75 % de opacidad; text-decoration-line: underline;
          @media (hover: hover) { &:hover { color: azul más oscuro; } } */}
      <a className="text-blue-600/75 underline hover:text-blue-800" href="#">
        Enlace
      </a>
    </main>
  )
}

// Reto: md:flex-row y flex-col cambian la misma propiedad (flex-direction), y
// Tailwind genera las variantes md: después de las utilidades base, así que a
// partir de 48rem gana md:flex-row. gap-2 es otra propiedad (gap): no hay
// conflicto y se mantiene.
