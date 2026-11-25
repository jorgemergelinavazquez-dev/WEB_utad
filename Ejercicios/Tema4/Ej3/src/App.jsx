import { obtenerUsuario } from './services/usuarios'

async function mostrarUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id)
    console.log(usuario.name)
  } catch (error) {
    console.log(error.message)
  }
}

export default function App() {
  return (
    <main>
      <button onClick={() => mostrarUsuario(1)}>Usuario 1</button>
      <button onClick={() => mostrarUsuario(9999)}>Usuario 9999</button>
    </main>
  )
}
