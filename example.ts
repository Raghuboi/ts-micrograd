import { Value } from "./src/index.js";

const a = new Value(2.0, { tag: 'a' });
const b = new Value(-3.0, { tag: 'b' });
const c = new Value(10, { tag: 'c' });

const d = a.multiply(b).add(c);
d.tag = 'L';  // Mark as loss
console.log(d);
console.log(d._prev);
console.log(d._op);
console.log(d.visualize());
