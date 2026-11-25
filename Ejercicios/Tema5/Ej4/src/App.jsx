// Las clases van completas: Tailwind busca los nombres como texto en el código.
// Con `bg-${color}-50` nunca vería "bg-red-50" y no generaría ese CSS.
const ESTILOS = {
  exito: 'border-emerald-500 bg-emerald-50 text-emerald-800',
  aviso: 'border-amber-500 bg-amber-50 text-amber-800',
  error: 'border-red-500 bg-red-50 text-red-800',
}

function Alerta({ tipo, titulo, children }) {
  return (
    <div className={`border-l-4 p-4 ${ESTILOS[tipo]}`}>
      <p className="font-semibold">{titulo}</p>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  )
}

export default function App() {
  return (
    <main className="flex flex-col gap-4 p-8">
      <Alerta tipo="exito" titulo="¡Guardado!">
        Tus cambios se han guardado correctamente.
      </Alerta>
      <Alerta tipo="aviso" titulo="Atención">
        Tu sesión está a punto de caducar.
      </Alerta>
      <Alerta tipo="error" titulo="Error">
        No se han podido guardar los cambios.
      </Alerta>
    </main>
  )
}
