import { useState } from 'react'
import { useForm } from 'react-hook-form'

function Newsletter() {
  console.log('render')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000)) // simula el envío
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="alias">Alias</label>
        <input
          id="alias"
          {...register('alias', {
            required: 'El alias es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          })}
        />
        {errors.alias && <p>{errors.alias.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email no válido' },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Suscribirme'}</button>
    </form>
  )
}

function InputControlado() {
  console.log('render controlado')
  const [texto, setTexto] = useState('')

  return (
    <div>
      <label htmlFor="controlado">Input controlado</label>
      <input id="controlado" value={texto} onChange={(e) => setTexto(e.target.value)} />
    </div>
  )
}

// Diferencia: React Hook Form usa inputs no controlados (el valor vive en el DOM),
// así que teclear no re-renderiza; solo lo hace al cambiar errores o isSubmitting.
// El input controlado guarda el valor en el estado y re-renderiza en cada tecla.
// (En desarrollo, StrictMode ejecuta cada render dos veces.)
export default function App() {
  return (
    <main>
      <h1>Alta en la newsletter</h1>
      <Newsletter />
      <InputControlado />
    </main>
  )
}
