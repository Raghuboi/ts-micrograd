class Value {
  data: number;

  constructor(data: number) {
    this.data = data;
  }

  toString(): string {
    return `Value(data=${this.data})`;
  }

  // override console.log with custom toString method
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }

  add(other: Value): Value {
    return new Value(this.data + other.data);
  }

  multiply(other: Value): Value {
    return new Value(this.data * other.data);
  }

  divide(other: Value): Value {
    return new Value(this.data / other.data);
  }
}

export { Value };
