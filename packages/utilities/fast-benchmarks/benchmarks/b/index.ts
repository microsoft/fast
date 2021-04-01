import Benchmark from "benchmark";

const benchmark = new Benchmark("foo", () => 2 + 2);
export default benchmark;
