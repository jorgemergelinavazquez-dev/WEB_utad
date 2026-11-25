export default async function ArchivoPage() {
  // Simula una consulta lenta
  await new Promise((r) => setTimeout(r, 2000));

  return <h1>Archivo</h1>;
}
