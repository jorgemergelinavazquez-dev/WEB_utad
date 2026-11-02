import { useEffect, useState } from 'react';

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado !== null ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

// Igual que useState, pero el valor sobrevive al recargar la página.
export function useLocalStorage(clave, valorInicial) {
  // Inicializador perezoso: localStorage se lee una sola vez, al montar.
  const [valor, setValor] = useState(() => leer(clave, valorInicial));

  // Sincronizar con un sistema externo (localStorage) es justo para lo que sirve un efecto.
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Modo incógnito o almacenamiento lleno: la app sigue funcionando sin guardar.
    }
  }, [clave, valor]);

  return [valor, setValor];
}
