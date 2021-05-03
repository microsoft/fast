import _Benchmark from "benchmark";

declare global {
    const Benchmark: typeof _Benchmark;
    interface Window {
        Benchmark: typeof _Benchmark;
    }
}
