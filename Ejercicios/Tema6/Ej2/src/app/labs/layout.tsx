import Link from "next/link";

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="flex w-48 flex-col gap-2 p-8">
        <Link href="/labs/colores">Colores</Link>
        <Link href="/labs/tipografia">Tipografía</Link>
      </aside>
      <section className="flex-1 p-8">{children}</section>
    </div>
  );
}
