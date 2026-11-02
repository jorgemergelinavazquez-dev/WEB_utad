import { useEffect, useState } from 'react';

// Pide JSON a una URL. Si "cachear" es true, guarda la respuesta cruda en
// localStorage y la reutiliza (es la caché de M2, ahora dentro del hook).
async function obtenerJSON(url, { cachear, signal }) {
  const clave = `cache:${url}`;
  if (cachear) {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  }

  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
  const datos = await respuesta.json();

  if (cachear) localStorage.setItem(clave, JSON.stringify(datos));
  return datos;
}

// Hook reutilizable: le das una URL (o null) y te devuelve datos, error y cargando.
export function useFetch(url, { cachear = true } = {}) {
  // Guardamos a qué URL pertenece la respuesta. Así "cargando" se deriva
  // (la respuesta guardada no es de la URL actual) en vez de ser otro estado.
  const [respuesta, setRespuesta] = useState({ url: null, datos: null, error: null });

  useEffect(() => {
    if (!url) return;
    const controlador = new AbortController();

    obtenerJSON(url, { cachear, signal: controlador.signal })
      .then((datos) => setRespuesta({ url, datos, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setRespuesta({ url, datos: null, error });
      });

    // Limpieza: si la URL cambia o el componente desaparece, cancelamos la
    // petición anterior para que una respuesta vieja no pise a la nueva.
    return () => controlador.abort();
  }, [url, cachear]);

  const esDeEstaUrl = respuesta.url === url;
  return {
    datos: esDeEstaUrl ? respuesta.datos : null,
    error: esDeEstaUrl ? respuesta.error : null,
    cargando: Boolean(url) && !esDeEstaUrl,
  };
}
