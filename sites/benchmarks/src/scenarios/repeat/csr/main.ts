import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "repeat-bench-element",
    template,
});

runBenchmark(() => document.createElement("repeat-bench-element"), 100);
