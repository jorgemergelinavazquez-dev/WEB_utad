// Versión rota:
// export default function TarjetaRota() {
//   return (
//     <article className="block flex w-[303px] max-w-sm p-2 p-6 text-left text-center rounded-lg rounded-[13px] bg-white shadow-sm shadow-lg">
//       <h2 className="text-xl text-[19px] font-bold font-light">Oferta especial</h2>
//       <p className="mt-[9px] text-gray-600">Solo hoy, envío gratis.</p>
//     </article>
//   )
// }

// Cambios:
// - block flex → ninguna: chocan en display, y <article> ya es block.
// - w-[303px] max-w-sm → max-w-sm: ancho arbitrario; con un máximo se adapta.
// - p-2 p-6 → p-6: chocan en padding.
// - text-left text-center → text-center: chocan en text-align.
// - rounded-lg rounded-[13px] → rounded-lg: chocan, y 13px se sale de la escala.
// - shadow-sm shadow-lg → shadow-lg: chocan en la sombra.
// - text-xl text-[19px] → text-xl: 19px se sale de la escala (text-xl son 20px).
// - font-bold font-light → font-bold: chocan, y es un título.
// - mt-[9px] → mt-2: valor de la escala (8px).
export default function TarjetaRota() {
  return (
    <article className="max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
      <h2 className="text-xl font-bold">Oferta especial</h2>
      <p className="mt-2 text-gray-600">Solo hoy, envío gratis.</p>
    </article>
  )
}

// ¿Quién gana cuando dos utilidades chocan? Mirando el className no se sabe con
// certeza: tienen la misma especificidad, así que gana la que aparece después en
// el CSS generado, y ese orden lo decide Tailwind, no el orden del className.
// Si las clases vienen por props, lo resuelve tailwind-merge (twMerge): elimina
// las que chocan y se queda con la última.
