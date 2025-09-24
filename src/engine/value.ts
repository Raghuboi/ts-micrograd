import { visualize, generateVisualizationUrl, trace } from "./visualize.js";

type Operation = "+" | "-" | "*" | "/" | "tanh" | undefined;

class Value {
  data: number;
  grad: number = 0;
  _prev: Set<Value>;
  _backward: () => void = () => {};
  _op: Operation;
  tag: string;

  constructor(
    data: number,
    {
      _children = [],
      _op = undefined,
      tag,
      grad = 0,
      _backward = () => {},
    }: {
      _children?: Array<Value>;
      _op?: Operation;
      tag?: string;
      grad?: number;
      _backward?: () => void;
    } = {}
  ) {
    this.data = data;
    this.grad = grad;
    this._prev = new Set(_children);
    this._op = _op;
    this.tag = tag || `v(${this.data.toFixed(2)})`;
    this._backward = _backward;
  }

  toString(): string {
    return `Value(data=${Math.floor(this.data).toFixed(2).toString()})`;
  }

  // override console.log with custom toString method
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }

  add(other: Value): Value {
    const output = new Value(this.data + other.data, {
      _children: [this, other],
      _op: "+",
    });
    output._backward = () => {
      this.grad += output.grad;
      other.grad += output.grad;
    };
    return output;
  }

  subtract(other: Value): Value {
    return new Value(this.data - other.data, {
      _children: [this, other],
      _op: "-",
    });
  }

  multiply(other: Value): Value {
    const output = new Value(this.data * other.data, {
      _children: [this, other],
      _op: "*",
    });
    output._backward = () => {
      this.grad += other.data * output.grad;
      other.grad += this.data * output.grad;
    };
    return output;
  }

  divide(other: Value): Value {
    return new Value(this.data / other.data, {
      _children: [this, other],
      _op: "/",
    });
  }

  tanh(): Value {
    const e2x = Math.exp(2 * this.data);
    const result = (e2x - 1) / (e2x + 1);
    const output = new Value(result, {
      _children: [this],
      _op: "tanh",
    });
    output._backward = () => {
      this.grad += (1 - result ** 2) * output.grad;
    };
    return output;
  }

  visualize(): string {
    const dotString = visualize(this);
    const url = generateVisualizationUrl(dotString);

    const { nodes } = trace(this);
    const nodeCount = nodes.size;
    const inputCount = Array.from(nodes).filter(
      (n) => n._prev.size === 0
    ).length;
    const opCount = Array.from(nodes).filter((n) => n._op).length;

    console.log(
      `Computational Graph: ${nodeCount} nodes (${inputCount} inputs, ${opCount} operations)`
    );
    return `👀 View: ${url}`;
  }
}

export { Value };
