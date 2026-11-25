const puntuaciones = [880, 1250, 445, 990, 1250, 720];

// (a) Set quita duplicados y toSorted ordena sin mutar
const podio = [...new Set(puntuaciones)].toSorted((a, b) => b - a).slice(0, 3);

// (b) with devuelve una copia con esa posición cambiada
const indiceMinimo = puntuaciones.indexOf(Math.min(...puntuaciones));
const corregidas = puntuaciones.with(indiceMinimo, 500);

console.log("podio      →", podio);
console.log("corregidas →", corregidas);
console.log("original   →", puntuaciones);
