// "10" + 5 → predigo "105" → correcto: + con string concatena
console.log("10" + 5);
// "10" - 5 → predigo 5 → correcto: - siempre convierte a número
console.log("10" - 5);
// 10 == "10" → predigo true → correcto: == convierte el string a número
console.log(10 == "10");
// 10 === "10" → predigo false → correcto: === no convierte y los tipos son distintos
console.log(10 === "10");
// true + true → predigo 2 → correcto: true se convierte en 1
console.log(true + true);
// "" == false → predigo true → correcto: los dos se convierten en 0
console.log("" == false);
// "" === false → predigo false → correcto: string y boolean son tipos distintos
console.log("" === false);
// null ?? "vacío" → predigo "vacío" → correcto: ?? actúa con null o undefined
console.log(null ?? "vacío");
// 0 || "cero" → predigo "cero" → correcto: || descarta cualquier falsy, y 0 lo es
console.log(0 || "cero");
// 0 ?? "cero" → predigo 0 → correcto: 0 no es null ni undefined
console.log(0 ?? "cero");

// Fáciles de fallar:
// - "10" + 5 y "10" - 5: con strings, + concatena pero - resta.
// - true + true: no es evidente que los booleanos se conviertan en números.
// - "" == false: parecen distintos, pero == los convierte a 0.
// - 0 || "cero" y 0 ?? "cero": || mira si es falsy, ?? solo si es null/undefined.
