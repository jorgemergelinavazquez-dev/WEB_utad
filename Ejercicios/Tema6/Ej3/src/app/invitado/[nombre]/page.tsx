function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default async function InvitadoPage({ params }: {
  params: Promise<{ nombre: string }>;
}) {
  const { nombre } = await params;
  return <h1>Bienvenida a la base, {capitalizar(nombre)} 🛰️</h1>;
}

// Versión sin await:
// export default function InvitadoPage({ params }: {
//   params: Promise<{ nombre: string }>;
// }) {
//   const { nombre } = params;
//   return <h1>Bienvenida a la base, {nombre} 🛰️</h1>;
// }
// Error de TypeScript: Property 'nombre' does not exist on type 'Promise<{ nombre: string; }>'.
// En ejecución, nombre sale undefined: params es una promesa, no el objeto.
