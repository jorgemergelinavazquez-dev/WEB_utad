const precioFinal = (precio, descuento) => {
  if (precio < 0) return "Precio no válido";
  // ?? solo sustituye null/undefined: un descuento de 0 se respeta
  const porcentaje = descuento ?? 0;
  return precio - (precio * porcentaje) / 100;
};

console.log(precioFinal(100, 25)); // 75
console.log(precioFinal(100, 0)); // 100
console.log(precioFinal(100)); // 100
console.log(precioFinal(-5, 10)); // "Precio no válido"
