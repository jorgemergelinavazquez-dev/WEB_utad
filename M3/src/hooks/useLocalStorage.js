import { useEffect, useState } from 'react';

// Como en useState, el valor inicial puede ser una función: así solo se
// calcula si no hay nada guardado.
function leer(clave, valorInicial) {
  const porDefecto = () => (typeof valorInicial === 'function' ? valorInicial() : valorInicial);
  try {
    const guardado = localStorage.getItem(clave);
    return guardado !== null ? JSON.parse(guardado) : porDefecto();
  } catch {
    return porDefecto();
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
