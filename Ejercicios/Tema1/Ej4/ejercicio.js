for (let n = 10; n >= 0; n--) {
  if (n === 0) {
    console.log("🚀 ¡Despegue!");
    break;
  }
  let linea = `${n}...`;
  if (n % 2 === 0) linea += " (comprobando sistemas)";
  if (n <= 3) linea += " ¡Abróchense!";
  console.log(linea);
}
