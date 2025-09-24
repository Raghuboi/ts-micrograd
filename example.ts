import { Value } from "./src/index.js";

// inputs: x1, x2
const x1 = new Value(2.0, { tag: "x1" });
const x2 = new Value(0.0, { tag: "x2" });
// weights: w1, w2
const w1 = new Value(-3.0, { tag: "w1" });
const w2 = new Value(1.0, { tag: "w2" });
// bias of the neuron
const b = new Value(8, { tag: "b" });

const x1w1 = x1.multiply(w1);
x1w1.tag = "x1w1";
const x2w2 = x2.multiply(w2);
x2w2.tag = "x2w2";

const x1w1_plus_x2w2 = x1w1.add(x2w2);
x1w1_plus_x2w2.tag = "x1w1 + x2w2";

const n = x1w1_plus_x2w2.add(b);
n.tag = "n";

const o = n.tanh();
o.tag = "o";

o.grad = 1.0;
o._backward();
n._backward();
b._backward();
x1w1_plus_x2w2._backward();
x2w2._backward();
x1w1._backward();
console.log(o.visualize());
