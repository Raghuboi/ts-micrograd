type Operation = "+" | "-" | "*" | "/" | undefined;

class Value {
  data: number;
  _prev: Set<Value>;
  _op: Operation;

  constructor(
    data: number,
    {
      _children = [],
      _op = undefined,
    }: { _children?: Array<Value>; _op?: Operation } = {}
  ) {
    this.data = data;
    this._prev = new Set(_children);
    this._op = _op;
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
}

export { Value };
