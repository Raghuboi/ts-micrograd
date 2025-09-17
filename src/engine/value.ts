import { visualize, generateVisualizationUrl, trace } from "./visualize.js";

type Operation = "+" | "-" | "*" | "/" | undefined;

class Value {
  data: number;
  grad: number = 0;
  _prev: Set<Value>;
  _op: Operation;
  tag: string;

  constructor(
    data: number,
    {
      _children = [],
      _op = undefined,
      tag,
      grad = 0,
    }: {
      _children?: Array<Value>;
      _op?: Operation;
      tag?: string;
      grad?: number;
    } = {}
  ) {
    this.data = data;
    this.grad = grad;
    this._prev = new Set(_children);
    this._op = _op;
    this.tag = tag || `v(${this.data.toFixed(2)})`;
  }

  toString(): string {
    return `Value(data=${Math.floor(this.data).toFixed(2).toString()})`;
  }

  // override console.log with custom toString method
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }

  add(other: Value): Value {
    return new Value(this.data + other.data, {
      _children: [this, other],
      _op: "+",
    });
  }

  subtract(other: Value): Value {
    return new Value(this.data - other.data, {
      _children: [this, other],
      _op: "-",
    });
  }

  multiply(other: Value): Value {
    return new Value(this.data * other.data, {
      _children: [this, other],
      _op: "*",
    });
  }

  divide(other: Value): Value {
    return new Value(this.data / other.data, {
      _children: [this, other],
      _op: "/",
    });
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
