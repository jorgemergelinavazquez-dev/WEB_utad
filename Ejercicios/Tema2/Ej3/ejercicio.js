const votos = ["Ana", "Luis", "Ana", "Sara", "Luis", "Ana", "Sara", "Ana"];

const escrutinio = (votos) => {
  const candidatos = [...new Set(votos)];

  const recuento = new Map();
  for (const nombre of votos) {
    recuento.set(nombre, (recuento.get(nombre) ?? 0) + 1);
  }

  // Cada entrada es [nombre, votos]: se ordena por votos y se coge el primer nombre
  const [[ganadora]] = [...recuento].toSorted((a, b) => b[1] - a[1]);

  return { candidatos, recuento, ganadora };
};

const { candidatos, recuento, ganadora } = escrutinio(votos);
console.log("candidatos →", candidatos);
console.log("recuento   →", recuento);
console.log("ganadora   →", ganadora);
