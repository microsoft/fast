import * as Benchmark from "benchmark";

const benchmark = new Benchmark.default("foo", () => 2 + 2);
export default benchmark;
