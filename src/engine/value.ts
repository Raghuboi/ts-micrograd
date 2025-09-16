class Value {
  data: number | undefined = undefined;

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
}

export { Value };
