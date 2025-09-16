class Value {
  data: number;
  _prev: Set<Value>;

  constructor(
    data: number,
    { _children = [] }: { _children?: Array<Value> } = {}
  ) {
    this.data = data;
    this._prev = new Set(_children);
  }

  toString(): string {
    return `Value(data=${Math.floor(this.data).toFixed(2).toString()})`;
  }

  // override console.log with custom toString method
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }

  add(other: Value): Value {
    return new Value(this.data + other.data, { _children: [this, other] });
  }

  multiply(other: Value): Value {
    return new Value(this.data * other.data, { _children: [this, other] });
  }

  divide(other: Value): Value {
    return new Value(this.data / other.data, { _children: [this, other] });
  }
}

export { Value };
