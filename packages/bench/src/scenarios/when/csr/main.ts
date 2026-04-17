import { runBenchmark } from "../../harness.js";
import { BenchElement, template } from "../element.js";

BenchElement.define({
    name: "when-bench-element",
    template,
});

runBenchmark(() => document.createElement("when-bench-element"));
