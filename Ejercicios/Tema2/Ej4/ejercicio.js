// Predicción: A F C D B E

console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));
setTimeout(() => console.log("E"), 0);
console.log("F");

// Explicación:
// 1. Call stack: primero se ejecuta todo lo síncrono → A F.
// 2. Microtareas: se vacían todas. C encola D (el segundo .then) y D
//    también se ejecuta antes de pasar a las macrotareas → C D.
// 3. Macrotareas: los setTimeout, en su orden de llegada → B E.
