import { Value } from "./src/index.js";

const a = new Value(2.0);
const b = new Value(-3.0);
const c = new Value(10);

const d = a.multiply(b).add(c);
console.log(d);
console.log(d._prev);
console.log(d._op);
