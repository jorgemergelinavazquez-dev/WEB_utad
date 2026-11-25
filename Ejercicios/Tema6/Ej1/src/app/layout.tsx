import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "El mapa de tu base",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav className="flex gap-4 bg-gray-200 p-4">
          <Link href="/">Inicio</Link>
          <Link href="/mision">Misión</Link>
          <Link href="/bitacora">Bitácora</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
