import Link from "next/link";

export default function InicioPage() {
  return (
    <main>
      <h1>Inicio</h1>
      <p>
        <Link href="/archivo">Ir al archivo</Link>
      </p>
      <p>
        <Link href="/otra">Ir a otra página</Link>
      </p>
    </main>
  );
}
